'use client';

import { useProduct } from '@/app/hooks/useProduct';
import { useParams } from 'next/navigation';
import Header from '@/app/components/layout/Header';
import Navigation from '@/app/components/layout/Navigation';
import AddToCartButton from '@/app/components/common/AddToCartButton';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// SubGenre映射
const subGenreMap: Record<number, { name: string; icon: string; color: string }> = {
  1: { name: 'Book', icon: '📚', color: 'bg-blue-100 text-blue-800' },
  2: { name: 'Movie', icon: '🎬', color: 'bg-green-100 text-green-800' },
  3: { name: 'Game', icon: '🎮', color: 'bg-purple-100 text-purple-800' },
  4: { name: 'Home & Garden', icon: '🏠', color: 'bg-orange-100 text-orange-800' },
  5: { name: 'Sports', icon: '⚽', color: 'bg-red-100 text-red-800' },
};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;
  
  const { 
    data: product, 
    isLoading,
    error 
  } = useProduct(productId);

  const subGenre = product ? subGenreMap[product.SubGenre] || { 
    name: 'Unknown', 
    icon: '❓', 
    color: 'bg-gray-100 text-gray-800' 
  } : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading product...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <p className="text-red-600 text-lg">Product not found</p>
              <Link 
                href="/"
                className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Product Detail */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Product Image Placeholder */}
              <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">{subGenre?.icon}</div>
                  <p className="text-gray-500">Product Image</p>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                {/* Product Header */}
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <h1 className="text-3xl font-bold text-gray-900 flex-1">
                      {product.Name}
                    </h1>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${subGenre?.color} ml-4 flex-shrink-0`}>
                      <span className="mr-2">{subGenre?.icon}</span>
                      {subGenre?.name}
                    </span>
                  </div>
                  
                  <p className="text-xl text-gray-600 mb-4">
                    by <span className="font-semibold">{product.Author}</span>
                  </p>
                </div>

                {/* Product Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {product.Description}
                  </p>
                </div>

                {/* Product Details */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Product ID:</span>
                      <span className="font-medium">{product.ID}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{subGenre?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium">
                        {new Date(product.LastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Updated By:</span>
                      <span className="font-medium">{product.LastUpdatedBy}</span>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Section */}
                <div className="border-t pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <AddToCartButton
                        productName={product.Name}
                        className="w-full py-3 text-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
