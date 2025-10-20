/**
 * 后台管理相关的类型定义
 */

import { UserRole } from './auth';

// 产品相关类型
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  sku: string;
  stock: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  sku: string;
  stock: number;
  imageUrl?: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  isActive?: boolean;
}

// 订单相关类型
export interface Order {
  id: string;
  userId: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
  total: number;
}

export interface UpdateOrderData {
  status?: Order['status'];
  shippingAddress?: Partial<Order['shippingAddress']>;
}

// 用户管理相关类型
export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  role: UserRole;
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  role?: UserRole;
  isActive?: boolean;
}

// 统计数据相关类型
export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
  topProducts: Array<{
    product: Product;
    totalSold: number;
    revenue: number;
  }>;
}

// 权限相关类型
export interface Permission {
  resource: string;
  actions: string[];
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  customer: [
    { resource: 'orders', actions: ['read', 'update', 'delete'] },
    { resource: 'profile', actions: ['read', 'update'] },
  ],
  employee: [
    { resource: 'products', actions: ['read'] },
    { resource: 'profile', actions: ['read', 'update'] },
  ],
  admin: [
    { resource: 'products', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'orders', actions: ['read', 'update'] },
    { resource: 'dashboard', actions: ['read'] },
  ],
};
