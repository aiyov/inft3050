# API 客户端使用指南

这是一个基于原生 `fetch` 的 API 客户端封装，提供了完整的类型安全和易用的接口。

## 文件结构

```
app/
├── types/
│   └── api.ts              # API 相关类型定义
├── lib/
│   ├── api-client.ts       # 核心 API 客户端
│   ├── api-services.ts     # 具体 API 服务方法
│   └── utils.ts            # 工具函数
├── hooks/
│   └── use-api.ts          # React hooks
└── examples/
    └── api-usage.tsx       # 使用示例
```

## 核心功能

### 1. ApiClient 类

基于原生 `fetch` 的 HTTP 客户端，支持：

- ✅ 完整的 TypeScript 类型支持
- ✅ 请求/响应拦截器
- ✅ 自动重试机制
- ✅ 请求超时控制
- ✅ 错误处理
- ✅ 文件上传/下载
- ✅ 自动认证 token 管理

### 2. 自定义 Hooks

提供了三个主要的 React hooks：

- `useApi`: 处理基本 API 请求状态
- `usePagination`: 处理分页数据
- `useFormSubmit`: 处理表单提交

### 3. API 服务

预定义了常用的 API 服务：

- 用户管理 (`userApi`)
- 产品管理 (`productApi`)
- 订单管理 (`orderApi`)
- 购物车管理 (`cartApi`)
- 分类管理 (`categoryApi`)

## 快速开始

### 1. 基本使用

```tsx
import { useApi } from '@/app/hooks/use-api';
import { userApi } from '@/app/lib/api-services';

function UserProfile() {
  const { data: user, loading, error, execute } = useApi(userApi.getCurrentUser, {
    immediate: true,
  });

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error.message}</div>;

  return (
    <div>
      <h1>{user?.name}</h1>
      <p>{user?.email}</p>
      <button onClick={() => execute()}>刷新</button>
    </div>
  );
}
```

### 2. 分页数据

```tsx
import { usePagination } from '@/app/hooks/use-api';
import { productApi } from '@/app/lib/api-services';

function ProductList() {
  const {
    data: products,
    loading,
    pagination,
    nextPage,
    prevPage,
  } = usePagination(productApi.getProducts, {
    immediate: true,
  });

  return (
    <div>
      {products?.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
      
      <button onClick={prevPage} disabled={!pagination.hasPrev}>
        上一页
      </button>
      <button onClick={nextPage} disabled={!pagination.hasNext}>
        下一页
      </button>
    </div>
  );
}
```

### 3. 表单提交

```tsx
import { useFormSubmit } from '@/app/hooks/use-api';
import { userApi } from '@/app/lib/api-services';

function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  const { loading, error, submit } = useFormSubmit(userApi.login, {
    onSuccess: (response) => {
      localStorage.setItem('token', response.token);
      window.location.href = '/';
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
      />
      <button type="submit" disabled={loading}>
        {loading ? '登录中...' : '登录'}
      </button>
      {error && <div className="error">{error.message}</div>}
    </form>
  );
}
```

## 配置

### 环境变量

在 `.env.local` 中配置 API 基础 URL：

```env
NEXT_PUBLIC_API_URL=https://api.example.com
```

### 自定义配置

```tsx
import { createApiClient } from '@/app/lib/api-client';

const customApiClient = createApiClient({
  baseURL: 'https://api.example.com',
  timeout: 15000,
  retries: 5,
  retryDelay: 2000,
});

// 添加自定义拦截器
customApiClient.addRequestInterceptor(async (config) => {
  // 添加自定义请求头
  config.headers = {
    ...config.headers,
    'X-Custom-Header': 'value',
  };
  return config;
});

customApiClient.addResponseInterceptor(async (response, data) => {
  // 处理响应数据
  console.log('Response:', data);
  return data;
});
```

## 错误处理

### 全局错误处理

```tsx
import { apiClient } from '@/app/lib/api-client';

// 添加全局错误拦截器
apiClient.addErrorInterceptor(async (error, response) => {
  if (response?.status === 401) {
    // 处理认证错误
    localStorage.removeItem('token');
    window.location.href = '/login';
  } else if (response?.status === 403) {
    // 处理权限错误
    alert('没有权限访问此资源');
  } else if (response?.status >= 500) {
    // 处理服务器错误
    alert('服务器错误，请稍后重试');
  }
  
  return error;
});
```

### 组件级错误处理

```tsx
const { data, loading, error, execute } = useApi(apiFunction, {
  onError: (error) => {
    // 处理特定组件的错误
    if (error.message.includes('网络')) {
      showToast('网络连接失败，请检查网络设置');
    } else {
      showToast(error.message);
    }
  },
});
```

## 文件上传

```tsx
import { apiClient } from '@/app/lib/api-client';

function FileUpload() {
  const handleFileUpload = async (file: File) => {
    try {
      const response = await apiClient.upload('/upload', file, 'file', (progress) => {
        console.log(`上传进度: ${progress}%`);
      });
      console.log('上传成功:', response.data.url);
    } catch (error) {
      console.error('上传失败:', error);
    }
  };

  return (
    <input
      type="file"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) handleFileUpload(file);
      }}
    />
  );
}
```

## 最佳实践

### 1. 类型安全

```tsx
// 定义响应数据类型
interface User {
  id: string;
  name: string;
  email: string;
}

// 使用类型参数
const { data: user } = useApi<User>(userApi.getCurrentUser);
```

### 2. 错误边界

```tsx
import { ErrorBoundary } from 'react-error-boundary';

function App() {
  return (
    <ErrorBoundary
      fallback={<div>Something went wrong</div>}
      onError={(error) => console.error('API Error:', error)}
    >
      <UserProfile />
    </ErrorBoundary>
  );
}
```

### 3. 加载状态

```tsx
function ProductList() {
  const { data, loading, error } = useApi(productApi.getProducts, {
    immediate: true,
  });

  if (loading) {
    return <div className="animate-pulse">加载中...</div>;
  }

  if (error) {
    return <div className="text-red-500">错误: {error.message}</div>;
  }

  return (
    <div>
      {data?.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### 4. 缓存策略

```tsx
import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/app/lib/api-services';

function UserProfile() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => userApi.getCurrentUser().then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5分钟内认为数据是新鲜的
    cacheTime: 10 * 60 * 1000, // 10分钟后清除缓存
  });

  if (isLoading) return <div>加载中...</div>;

  return <div>{user?.name}</div>;
}
```

## 常见问题

### Q: 如何处理请求取消？

A: 使用 AbortController：

```tsx
const { execute } = useApi(apiFunction);

useEffect(() => {
  const controller = new AbortController();
  
  execute({ signal: controller.signal });
  
  return () => controller.abort();
}, []);
```

### Q: 如何实现乐观更新？

A: 在成功回调中手动更新状态：

```tsx
const [products, setProducts] = useState([]);

const { execute: addProduct } = useApi(productApi.createProduct, {
  onSuccess: (newProduct) => {
    setProducts(prev => [...prev, newProduct]);
  },
});
```

### Q: 如何处理并发请求？

A: 使用 Promise.all 或 Promise.allSettled：

```tsx
const { execute: getUser } = useApi(userApi.getCurrentUser);
const { execute: getProducts } = useApi(productApi.getProducts);

const loadData = async () => {
  const [user, products] = await Promise.all([
    getUser(),
    getProducts(),
  ]);
  
  console.log('用户:', user);
  console.log('产品:', products);
};
```

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个 API 客户端！
