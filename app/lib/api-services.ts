import { apiClient } from './api-client';
import { ApiResponse, PaginatedResponse, QueryParams } from '@/app/types/api';

/**
 * 用户相关 API 服务
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
}

export interface UpdateUserData {
  name?: string;
  avatar?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  email: string;
  username: string;
  isAdmin: boolean;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export const userApi = {
  /**
   * 用户登录
   */
  login: (data: LoginData): Promise<ApiResponse<LoginResponse>> => {
    return apiClient.post('/auth/login', data);
  },

  /**
   * 用户注册
   */
  register: (data: CreateUserData): Promise<ApiResponse<LoginResponse>> => {
    return apiClient.post('/auth/register', data);
  },

  /**
   * 获取当前用户信息
   */
  getCurrentUser: (): Promise<ApiResponse<User>> => {
    return apiClient.get('/auth/me');
  },

  /**
   * 更新用户信息
   */
  updateUser: (id: string, data: UpdateUserData): Promise<ApiResponse<User>> => {
    return apiClient.put(`/users/${id}`, data);
  },

  /**
   * 获取用户列表
   */
  getUsers: (params?: QueryParams): Promise<ApiResponse<PaginatedResponse<User>>> => {
    return apiClient.get('/users', params);
  },

  /**
   * 根据 ID 获取用户
   */
  getUserById: (id: string): Promise<ApiResponse<User>> => {
    return apiClient.get(`/users/${id}`);
  },

  /**
   * 删除用户
   */
  deleteUser: (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/users/${id}`);
  },

  /**
   * 上传用户头像
   */
  uploadAvatar: (file: File): Promise<ApiResponse<{ url: string }>> => {
    return apiClient.upload('/users/avatar', file, 'avatar');
  },

  /**
   * 忘记密码
   */
  forgotPassword: (data: ForgotPasswordData): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post('/auth/forgot-password', data);
  },

  /**
   * 重置密码
   */
  resetPassword: (data: ResetPasswordData): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post('/auth/reset-password', data);
  },
};

/**
 * 产品相关 API 服务
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  images?: string[];
  category: string;
  stock: number;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  images?: string[];
  category?: string;
  stock?: number;
  isActive?: boolean;
}

export const productApi = {
  /**
   * 获取产品列表
   */
  getProducts: (params?: QueryParams): Promise<ApiResponse<PaginatedResponse<Product>>> => {
    return apiClient.get('/products', params);
  },

  /**
   * 根据 ID 获取产品
   */
  getProductById: (id: string): Promise<ApiResponse<Product>> => {
    return apiClient.get(`/products/${id}`);
  },

  /**
   * 创建产品
   */
  createProduct: (data: CreateProductData): Promise<ApiResponse<Product>> => {
    return apiClient.post('/products', data);
  },

  /**
   * 更新产品
   */
  updateProduct: (id: string, data: UpdateProductData): Promise<ApiResponse<Product>> => {
    return apiClient.put(`/products/${id}`, data);
  },

  /**
   * 删除产品
   */
  deleteProduct: (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/products/${id}`);
  },

  /**
   * 上传产品图片
   */
  uploadProductImage: (file: File): Promise<ApiResponse<{ url: string }>> => {
    return apiClient.upload('/products/images', file, 'image');
  },

  /**
   * 搜索产品
   */
  searchProducts: (query: string, params?: QueryParams): Promise<ApiResponse<PaginatedResponse<Product>>> => {
    return apiClient.get('/products/search', { ...params, q: query });
  },
};

/**
 * 订单相关 API 服务
 */
export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export const orderApi = {
  /**
   * 创建订单
   */
  createOrder: (data: CreateOrderData): Promise<ApiResponse<Order>> => {
    return apiClient.post('/orders', data);
  },

  /**
   * 获取用户订单列表
   */
  getUserOrders: (params?: QueryParams): Promise<ApiResponse<PaginatedResponse<Order>>> => {
    return apiClient.get('/orders', params);
  },

  /**
   * 根据 ID 获取订单
   */
  getOrderById: (id: string): Promise<ApiResponse<Order>> => {
    return apiClient.get(`/orders/${id}`);
  },

  /**
   * 更新订单状态
   */
  updateOrderStatus: (id: string, status: Order['status']): Promise<ApiResponse<Order>> => {
    return apiClient.patch(`/orders/${id}/status`, { status });
  },

  /**
   * 取消订单
   */
  cancelOrder: (id: string): Promise<ApiResponse<Order>> => {
    return apiClient.patch(`/orders/${id}/cancel`);
  },
};

/**
 * 购物车相关 API 服务
 */
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
}

export const cartApi = {
  /**
   * 获取购物车
   */
  getCart: (): Promise<ApiResponse<CartItem[]>> => {
    return apiClient.get('/cart');
  },

  /**
   * 添加商品到购物车
   */
  addToCart: (data: AddToCartData): Promise<ApiResponse<CartItem>> => {
    return apiClient.post('/cart/items', data);
  },

  /**
   * 更新购物车商品数量
   */
  updateCartItem: (id: string, quantity: number): Promise<ApiResponse<CartItem>> => {
    return apiClient.put(`/cart/items/${id}`, { quantity });
  },

  /**
   * 从购物车删除商品
   */
  removeFromCart: (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/cart/items/${id}`);
  },

  /**
   * 清空购物车
   */
  clearCart: (): Promise<ApiResponse<void>> => {
    return apiClient.delete('/cart');
  },
};

/**
 * 分类相关 API 服务
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
}

export const categoryApi = {
  /**
   * 获取所有分类
   */
  getCategories: (params?: QueryParams): Promise<ApiResponse<Category[]>> => {
    return apiClient.get('/categories', params);
  },

  /**
   * 根据 ID 获取分类
   */
  getCategoryById: (id: string): Promise<ApiResponse<Category>> => {
    return apiClient.get(`/categories/${id}`);
  },

  /**
   * 根据 slug 获取分类
   */
  getCategoryBySlug: (slug: string): Promise<ApiResponse<Category>> => {
    return apiClient.get(`/categories/slug/${slug}`);
  },

  /**
   * 创建分类
   */
  createCategory: (data: CreateCategoryData): Promise<ApiResponse<Category>> => {
    return apiClient.post('/categories', data);
  },

  /**
   * 更新分类
   */
  updateCategory: (id: string, data: Partial<CreateCategoryData>): Promise<ApiResponse<Category>> => {
    return apiClient.put(`/categories/${id}`, data);
  },

  /**
   * 删除分类
   */
  deleteCategory: (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/categories/${id}`);
  },
};
