import { 
  ApiClientConfig, 
  RequestConfig, 
  RequestOptions, 
  ApiResponse, 
  ApiError,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
  QueryParams
} from '@/app/types/api';

/**
 * API 客户端类 - 基于原生 fetch 的封装
 */
export class ApiClient {
  private config: Required<ApiClientConfig>;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor(config: ApiClientConfig) {
    this.config = {
      timeout: 10000,
      defaultHeaders: {
        'Content-Type': 'application/json',
      },
      retries: 3,
      retryDelay: 1000,
      ...config,
    };
  }

  /**
   * 添加请求拦截器
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * 添加响应拦截器
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * 添加错误拦截器
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  /**
   * 构建完整的 URL
   */
  private buildURL(endpoint: string, params?: QueryParams): string {
    const url = new URL(endpoint, this.config.baseURL);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  /**
   * 应用请求拦截器
   */
  private async applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let finalConfig = { ...config };
    
    for (const interceptor of this.requestInterceptors) {
      finalConfig = await interceptor(finalConfig);
    }
    
    return finalConfig;
  }

  /**
   * 应用响应拦截器
   */
  private async applyResponseInterceptors<T>(response: Response, data: T): Promise<T> {
    let finalData = data;
    
    for (const interceptor of this.responseInterceptors) {
      finalData = await interceptor(response, finalData);
    }
    
    return finalData;
  }

  /**
   * 应用错误拦截器
   */
  private async applyErrorInterceptors(error: Error, response?: Response): Promise<Error> {
    let finalError = error;
    
    for (const interceptor of this.errorInterceptors) {
      finalError = await interceptor(finalError, response);
    }
    
    return finalError;
  }

  /**
   * 创建 AbortController 用于超时控制
   */
  private createAbortController(timeout?: number): AbortController {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout || this.config.timeout);
    
    controller.signal.addEventListener('abort', () => {
      clearTimeout(timeoutId);
    });
    
    return controller;
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 解析响应数据
   */
  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      return await response.json();
    }
    
    if (contentType?.includes('text/')) {
      return await response.text() as T;
    }
    
    return await response.blob() as T;
  }

  /**
   * 处理错误
   */
  private async handleError(error: Error, response?: Response): Promise<never> {
    let apiError: ApiError;
    
    if (error.name === 'AbortError') {
      apiError = {
        message: '请求超时',
        code: 'TIMEOUT',
        timestamp: new Date().toISOString(),
      };
    } else if (response) {
      try {
        const errorData = await this.parseResponse<ApiError>(response);
        apiError = {
          message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          code: errorData.code || response.status,
          details: errorData.details,
          timestamp: errorData.timestamp || new Date().toISOString(),
        };
      } catch {
        apiError = {
          message: `HTTP ${response.status}: ${response.statusText}`,
          code: response.status,
          timestamp: new Date().toISOString(),
        };
      }
    } else {
      apiError = {
        message: error.message || '网络错误',
        code: 'NETWORK_ERROR',
        timestamp: new Date().toISOString(),
      };
    }
    
    const finalError = await this.applyErrorInterceptors(new Error(apiError.message), response);
    throw finalError;
  }

  /**
   * 执行请求
   */
  private async executeRequest<T>(
    endpoint: string,
    config: RequestConfig,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const finalConfig = await this.applyRequestInterceptors({
      ...config,
      headers: {
        ...this.config.defaultHeaders,
        ...config.headers,
      },
    });

    const url = this.buildURL(endpoint, config.params);
    const controller = this.createAbortController(config.timeout);
    const signal = options?.signal || controller.signal;

    const requestInit: RequestInit = {
      method: finalConfig.method || 'GET',
      headers: finalConfig.headers,
      signal,
    };

    if (finalConfig.body && finalConfig.method !== 'GET') {
      if (finalConfig.body instanceof FormData) {
        // FormData 不需要设置 Content-Type，浏览器会自动设置
        delete requestInit.headers!['Content-Type'];
        requestInit.body = finalConfig.body;
      } else {
        requestInit.body = JSON.stringify(finalConfig.body);
      }
    }

    const retries = finalConfig.retries ?? this.config.retries;
    const retryDelay = finalConfig.retryDelay ?? this.config.retryDelay;
    
    let lastError: Error;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, requestInit);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await this.parseResponse<T>(response);
        const finalData = await this.applyResponseInterceptors(response, data);
        
        return {
          data: finalData,
          success: true,
          timestamp: new Date().toISOString(),
        };
        
      } catch (error) {
        lastError = error as Error;
        
        // 如果是最后一次尝试，或者不是网络错误，直接抛出
        if (attempt === retries || error.name !== 'TypeError') {
          break;
        }
        
        // 等待后重试
        await this.delay(retryDelay * (attempt + 1));
      }
    }
    
    await this.handleError(lastError);
  }

  /**
   * GET 请求
   */
  async get<T>(endpoint: string, params?: QueryParams, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.executeRequest<T>(endpoint, { method: 'GET', params }, options);
  }

  /**
   * POST 请求
   */
  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.executeRequest<T>(endpoint, { method: 'POST', body: data }, options);
  }

  /**
   * PUT 请求
   */
  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.executeRequest<T>(endpoint, { method: 'PUT', body: data }, options);
  }

  /**
   * PATCH 请求
   */
  async patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.executeRequest<T>(endpoint, { method: 'PATCH', body: data }, options);
  }

  /**
   * DELETE 请求
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.executeRequest<T>(endpoint, { method: 'DELETE' }, options);
  }

  /**
   * 上传文件
   */
  async upload<T>(endpoint: string, file: File, field: string = 'file', onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append(field, file);
    
    return this.executeRequest<T>(endpoint, {
      method: 'POST',
      body: formData,
    });
  }

  /**
   * 下载文件
   */
  async download(endpoint: string, filename?: string): Promise<void> {
    const response = await this.get<Blob>(endpoint);
    
    const blob = response.data;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

/**
 * 创建默认的 API 客户端实例
 */
export const createApiClient = (config: ApiClientConfig): ApiClient => {
  const client = new ApiClient(config);
  
  // 添加默认的请求拦截器 - 添加认证 token
  client.addRequestInterceptor(async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  });
  
  // 添加默认的响应拦截器 - 处理通用响应格式
  client.addResponseInterceptor(async (response, data) => {
    if (response.status >= 400) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return data;
  });
  
  // 添加默认的错误拦截器 - 处理认证错误
  client.addErrorInterceptor(async (error, response) => {
    if (response?.status === 401) {
      localStorage.removeItem('token');
      // 可以在这里添加重定向到登录页的逻辑
      window.location.href = '/login';
    }
    return error;
  });
  
  return client;
};

/**
 * 默认 API 客户端实例
 */
export const apiClient = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
});
