import { Product } from "@/app/hooks/useProducts";

export default function ProductItem({ product }: { product: Product }) {

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {product.Name}
      </h3>
      <div className="text-sm text-gray-600 space-y-1">
        <p><span className="font-medium">Author:</span> {product.Author}</p>
        <p><span className="font-medium">Description:</span> {product.Description}</p>
        <p><span className="font-medium">Last Updated:</span> {product.LastUpdated}</p>
      </div>
    </div>
  );
}