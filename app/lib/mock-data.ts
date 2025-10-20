/**
 * Mock 数据 - 根据 Excel 表格字段创建
 */

import { User, UserRole } from '@/app/types/auth';
import { Product, Order, OrderItem, DashboardStats } from '@/app/types/admin';

// Mock 用户数据
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@jbhifi.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    phone: '+61 2 1234 5678',
    address: '123 Admin Street',
    city: 'Sydney',
    state: 'NSW',
    zipCode: '2000',
    country: 'Australia',
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'employee@jbhifi.com',
    password: 'employee123',
    firstName: 'John',
    lastName: 'Employee',
    phone: '+61 2 2345 6789',
    address: '456 Employee Avenue',
    city: 'Melbourne',
    state: 'VIC',
    zipCode: '3000',
    country: 'Australia',
    role: 'employee',
    isActive: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    email: 'customer1@example.com',
    password: 'customer123',
    firstName: 'Alice',
    lastName: 'Customer',
    phone: '+61 2 3456 7890',
    address: '789 Customer Road',
    city: 'Brisbane',
    state: 'QLD',
    zipCode: '4000',
    country: 'Australia',
    role: 'customer',
    isActive: true,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
  {
    id: '4',
    email: 'customer2@example.com',
    password: 'customer123',
    firstName: 'Bob',
    lastName: 'Smith',
    phone: '+61 2 4567 8901',
    address: '321 Smith Street',
    city: 'Perth',
    state: 'WA',
    zipCode: '6000',
    country: 'Australia',
    role: 'customer',
    isActive: true,
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z',
  },
];

// Mock 产品数据
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Apple iPhone 16 Pro',
    description: 'Latest iPhone with advanced camera system and A18 Pro chip',
    price: 1799,
    category: 'Mobile Phones',
    brand: 'Apple',
    sku: 'IPH16PRO-256-BLK',
    stock: 50,
    imageUrl: '/images/iphone-16-pro.jpg',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Premium Android smartphone with S Pen and advanced AI features',
    price: 1699,
    category: 'Mobile Phones',
    brand: 'Samsung',
    sku: 'SGS24U-512-TIT',
    stock: 30,
    imageUrl: '/images/galaxy-s24-ultra.jpg',
    isActive: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'MacBook Pro 16-inch M3',
    description: 'Professional laptop with M3 chip and Liquid Retina XDR display',
    price: 3299,
    category: 'Computers & Tablets',
    brand: 'Apple',
    sku: 'MBP16-M3-512-SLV',
    stock: 20,
    imageUrl: '/images/macbook-pro-16.jpg',
    isActive: true,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
  {
    id: '4',
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling wireless headphones',
    price: 549,
    category: 'Headphones, Speakers & Audio',
    brand: 'Sony',
    sku: 'WH1000XM5-BLK',
    stock: 100,
    imageUrl: '/images/sony-wh1000xm5.jpg',
    isActive: true,
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z',
  },
  {
    id: '5',
    name: 'Samsung 65" QLED 4K TV',
    description: 'Smart TV with Quantum Dot technology and HDR10+',
    price: 1999,
    category: 'TVs & Home Theatre',
    brand: 'Samsung',
    sku: 'QLED65-Q80C-BLK',
    stock: 15,
    imageUrl: '/images/samsung-qled-65.jpg',
    isActive: true,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  },
];

// Mock 订单项数据
export const mockOrderItems: OrderItem[] = [
  {
    id: '1',
    orderId: '1',
    productId: '1',
    product: mockProducts[0],
    quantity: 1,
    price: 1799,
    total: 1799,
  },
  {
    id: '2',
    orderId: '1',
    productId: '4',
    product: mockProducts[3],
    quantity: 1,
    price: 549,
    total: 549,
  },
  {
    id: '3',
    orderId: '2',
    productId: '2',
    product: mockProducts[1],
    quantity: 1,
    price: 1699,
    total: 1699,
  },
  {
    id: '4',
    orderId: '3',
    productId: '3',
    product: mockProducts[2],
    quantity: 1,
    price: 3299,
    total: 3299,
  },
];

// Mock 订单数据
export const mockOrders: Order[] = [
  {
    id: '1',
    userId: '3',
    user: {
      id: '3',
      firstName: 'Alice',
      lastName: 'Customer',
      email: 'customer1@example.com',
    },
    status: 'delivered',
    total: 2348,
    shippingAddress: {
      firstName: 'Alice',
      lastName: 'Customer',
      address: '789 Customer Road',
      city: 'Brisbane',
      state: 'QLD',
      zipCode: '4000',
      country: 'Australia',
    },
    orderItems: mockOrderItems.filter(item => item.orderId === '1'),
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
  },
  {
    id: '2',
    userId: '4',
    user: {
      id: '4',
      firstName: 'Bob',
      lastName: 'Smith',
      email: 'customer2@example.com',
    },
    status: 'processing',
    total: 1699,
    shippingAddress: {
      firstName: 'Bob',
      lastName: 'Smith',
      address: '321 Smith Street',
      city: 'Perth',
      state: 'WA',
      zipCode: '6000',
      country: 'Australia',
    },
    orderItems: mockOrderItems.filter(item => item.orderId === '2'),
    createdAt: '2024-01-12T15:30:00Z',
    updatedAt: '2024-01-12T15:30:00Z',
  },
  {
    id: '3',
    userId: '3',
    user: {
      id: '3',
      firstName: 'Alice',
      lastName: 'Customer',
      email: 'customer1@example.com',
    },
    status: 'shipped',
    total: 3299,
    shippingAddress: {
      firstName: 'Alice',
      lastName: 'Customer',
      address: '789 Customer Road',
      city: 'Brisbane',
      state: 'QLD',
      zipCode: '4000',
      country: 'Australia',
    },
    orderItems: mockOrderItems.filter(item => item.orderId === '3'),
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-16T11:45:00Z',
  },
];

// Mock 统计数据
export const mockDashboardStats: DashboardStats = {
  totalUsers: mockUsers.length,
  totalProducts: mockProducts.length,
  totalOrders: mockOrders.length,
  totalRevenue: mockOrders.reduce((sum, order) => sum + order.total, 0),
  recentOrders: mockOrders.slice(0, 5),
  topProducts: [
    {
      product: mockProducts[0],
      totalSold: 15,
      revenue: 26985,
    },
    {
      product: mockProducts[1],
      totalSold: 12,
      revenue: 20388,
    },
    {
      product: mockProducts[3],
      totalSold: 25,
      revenue: 13725,
    },
  ],
};

// 模拟 API 延迟
export const simulateApiDelay = (ms: number = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// 模拟 API 错误
export const simulateApiError = (message: string = 'API Error'): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), 500);
  });
};
