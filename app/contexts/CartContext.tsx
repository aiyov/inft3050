'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: number;
  name: string;
  description: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: { id: number; name: string; description: string }) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  // 标记客户端渲染
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 从localStorage加载购物车数据
  useEffect(() => {
    if (isClient) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error('Failed to load cart:', error);
        }
      }
    }
  }, [isClient]);

  // 保存购物车数据到localStorage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    if (isClient) {
      localStorage.setItem('cart', JSON.stringify(newCart));
    }
  };

  // 添加商品到购物车
  const addToCart = (product: { id: number; name: string; description: string }) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // 如果商品已存在，增加数量
      const updatedCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      saveCart(updatedCart);
    } else {
      // 如果是新商品，添加到购物车
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        description: product.description,
        quantity: 1,
      };
      saveCart([...cart, newItem]);
    }
  };

  // 更新商品数量
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    const updatedCart = cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    saveCart(updatedCart);
  };

  // 从购物车移除商品
  const removeFromCart = (id: number) => {
    const updatedCart = cart.filter(item => item.id !== id);
    saveCart(updatedCart);
  };

  // 清空购物车
  const clearCart = () => {
    saveCart([]);
  };

  // 获取购物车总数量
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

