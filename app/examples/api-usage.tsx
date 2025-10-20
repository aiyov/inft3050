/**
 * API 使用示例
 * 展示如何使用封装的 API 客户端和 hooks
 */

import React, { useState } from 'react';
import { useApi, usePagination, useFormSubmit } from '@/app/hooks/use-api';
import { userApi, productApi, cartApi } from '@/app/lib/api-services';
import { cn } from '@/app/lib/utils';

// 1. 基本 API 请求示例
export function UserProfileExample() {
  const { data: user, loading, error, execute } = useApi(userApi.getCurrentUser, {
    immediate: true,
    onSuccess: (user) => {
      console.log('用户信息加载成功:', user);
    },
    onError: (error) => {
      console.error('加载用户信息失败:', error);
    },
  });

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error.message}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">用户信息</h2>
      {user && (
        <div className="bg-gray-100 p-4 rounded">
          <p>姓名: {user.name}</p>
          <p>邮箱: {user.email}</p>
          <p>创建时间: {user.createdAt}</p>
        </div>
      )}
      <button
        onClick={() => execute()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        刷新数据
      </button>
    </div>
  );
}

// 2. 分页数据示例
export function ProductListExample() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    data: products,
    loading,
    error,
    pagination,
    execute,
    nextPage,
    prevPage,
    goToPage,
  } = usePagination(productApi.getProducts, {
    immediate: true,
  });

  const handleSearch = async () => {
    await execute({ search: searchTerm });
  };

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error.message}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">产品列表</h2>
      
      {/* 搜索框 */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="搜索产品..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          搜索
        </button>
      </div>

      {/* 产品列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {products?.map((product) => (
          <div key={product.id} className="border border-gray-200 rounded p-4">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600 text-sm">{product.description}</p>
            <p className="text-lg font-bold text-green-600">¥{product.price}</p>
          </div>
        ))}
      </div>

      {/* 分页控件 */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          显示第 {pagination.page} 页，共 {pagination.totalPages} 页
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={prevPage}
            disabled={!pagination.hasPrev}
            className={cn(
              "px-3 py-1 border rounded",
              pagination.hasPrev
                ? "border-gray-300 hover:bg-gray-50"
                : "border-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            上一页
          </button>
          
          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={cn(
                  "px-3 py-1 border rounded",
                  page === pagination.page
                    ? "bg-blue-500 text-white border-blue-500"
                    : "border-gray-300 hover:bg-gray-50"
                )}
              >
                {page}
              </button>
            );
          })}
          
          <button
            onClick={nextPage}
            disabled={!pagination.hasNext}
            className={cn(
              "px-3 py-1 border rounded",
              pagination.hasNext
                ? "border-gray-300 hover:bg-gray-50"
                : "border-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  );
}

// 3. 表单提交示例
export function LoginFormExample() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { loading, error, success, submit } = useFormSubmit(userApi.login, {
    onSuccess: (response) => {
      console.log('登录成功:', response);
      // 保存 token 到 localStorage
      localStorage.setItem('token', response.token);
      // 重定向到首页
      window.location.href = '/';
    },
    onError: (error) => {
      console.error('登录失败:', error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">用户登录</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            邮箱地址
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            密码
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {error && (
          <div className="text-red-600 text-sm">
            {error.message}
          </div>
        )}
        
        {success && (
          <div className="text-green-600 text-sm">
            登录成功！
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "w-full py-2 px-4 rounded-md font-medium",
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          )}
        >
          {loading ? '登录中...' : '登录'}
        </button>
      </form>
    </div>
  );
}

// 4. 购物车操作示例
export function CartExample() {
  const { data: cartItems, loading, error, execute: refreshCart } = useApi(
    cartApi.getCart,
    { immediate: true }
  );

  const { execute: addToCart } = useApi(cartApi.addToCart);
  const { execute: removeFromCart } = useApi(cartApi.removeFromCart);

  const handleAddToCart = async (productId: string) => {
    await addToCart({ productId, quantity: 1 });
    await refreshCart(); // 刷新购物车数据
  };

  const handleRemoveFromCart = async (itemId: string) => {
    await removeFromCart(itemId);
    await refreshCart(); // 刷新购物车数据
  };

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error.message}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">购物车</h2>
      
      {cartItems?.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          购物车为空
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems?.map((item) => (
            <div key={item.id} className="flex items-center justify-between border border-gray-200 rounded p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-gray-600">数量: {item.quantity}</p>
                  <p className="text-green-600 font-bold">¥{item.product.price}</p>
                </div>
              </div>
              
              <button
                onClick={() => handleRemoveFromCart(item.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                删除
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 5. 完整页面示例
export default function ApiUsageExample() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">API 使用示例</h1>
        
        {/* 标签页导航 */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            {[
              { id: 'profile', label: '用户信息' },
              { id: 'products', label: '产品列表' },
              { id: 'login', label: '登录表单' },
              { id: 'cart', label: '购物车' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2 rounded-md font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 标签页内容 */}
        <div className="bg-white rounded-lg shadow-sm">
          {activeTab === 'profile' && <UserProfileExample />}
          {activeTab === 'products' && <ProductListExample />}
          {activeTab === 'login' && <LoginFormExample />}
          {activeTab === 'cart' && <CartExample />}
        </div>
      </div>
    </div>
  );
}
