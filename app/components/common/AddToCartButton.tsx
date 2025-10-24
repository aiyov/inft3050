'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import AddToCartModal from '../modals/AddToCartModal';
import { useCart } from '@/app/contexts/CartContext';

interface AddToCartButtonProps {
  productId: number;
  productName: string;
  productDescription: string;
  className?: string;
}

export default function AddToCartButton({ 
  productId,
  productName,
  productDescription,
  className = '' 
}: AddToCartButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    setIsLoading(true);
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 添加到购物车
      addToCart({
        id: productId,
        name: productName,
        description: productDescription,
      });
      
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={handleAddToCart}
        disabled={isLoading}
        className={`flex items-center justify-center px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 disabled:bg-yellow-300 disabled:cursor-not-allowed transition-colors font-medium text-sm ${className}`}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Adding...
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </>
        )}
      </button>

      <AddToCartModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        productName={productName}
      />
    </>
  );
}
