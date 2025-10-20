/**
 * API 相关的类型定义
 */

// HTTP 方法类型
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// API 响应基础类型
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

// API 错误响应类型
export interface ApiError {
  message: string;
  code?: string | number;
  details?: any;
  timestamp: string;
}

// 请求配置类型
export interface RequestConfig {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

// 请求选项类型
export interface RequestOptions extends Omit<RequestConfig, 'method'> {
  signal?: AbortSignal;
}

// API 客户端配置类型
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
  retries?: number;
  retryDelay?: number;
}

// 分页响应类型
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// 查询参数类型
export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  [key: string]: any;
}

// 上传文件类型
export interface UploadFile {
  file: File;
  field?: string;
  onProgress?: (progress: number) => void;
}

// 请求拦截器类型
export type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;

// 响应拦截器类型
export type ResponseInterceptor = <T>(response: Response, data: T) => T | Promise<T>;

// 错误拦截器类型
export type ErrorInterceptor = (error: Error, response?: Response) => Error | Promise<Error>;
