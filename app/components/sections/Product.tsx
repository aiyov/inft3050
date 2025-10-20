import { Product } from "@/app/hooks/useProducts";
import AddToCartButton from "../common/AddToCartButton";
import Link from "next/link";

// SubGenre映射
const subGenreMap: Record<number, { name: string; icon: string; color: string }> = {
  1: { name: 'Book', icon: '📚', color: 'bg-blue-100 text-blue-800' },
  2: { name: 'Movie', icon: '🎬', color: 'bg-green-100 text-green-800' },
  3: { name: 'Game', icon: '🎮', color: 'bg-purple-100 text-purple-800' },
  4: { name: 'Home & Garden', icon: '🏠', color: 'bg-orange-100 text-orange-800' },
  5: { name: 'Sports', icon: '⚽', color: 'bg-red-100 text-red-800' },
};

export default function ProductItem({ product }: { product: Product }) {
  const subGenre = subGenreMap[product.SubGenre] || { 
    name: 'Unknown', 
    icon: '❓', 
    color: 'bg-gray-100 text-gray-800' 
  };

  // 截取description的前100个字符
  const truncatedDescription = product.Description.length > 100 
    ? product.Description.substring(0, 100) + '...' 
    : product.Description;

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white h-full flex flex-col">
      {/* Product Header with SubGenre Badge */}
      <div className="flex items-start justify-between mb-3">
        <Link 
          href={`/products/${product.ID}`}
          className="text-lg font-semibold text-gray-900 flex-1 line-clamp-2 hover:text-blue-600 transition-colors"
        >
          {product.Name}
        </Link>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${subGenre.color} ml-2 flex-shrink-0`}>
          <span className="mr-1">{subGenre.icon}</span>
          {subGenre.name}
        </span>
      </div>
      
      <div className="text-sm text-gray-600 space-y-2 mb-4 flex-1">
        <p><span className="font-medium">Author:</span> {product.Author}</p>
        <p><span className="font-medium">Description:</span> {truncatedDescription}</p>
        <p className="text-xs text-gray-500">
          <span className="font-medium">Updated:</span> {new Date(product.LastUpdated).toLocaleDateString()}
        </p>
      </div>
      
      {/* Add to Cart Button */}
      <div className="mt-auto pt-2">
        <AddToCartButton
          productName={product.Name}
          className="w-full text-sm py-2"
        />
      </div>
    </div>
  );
}