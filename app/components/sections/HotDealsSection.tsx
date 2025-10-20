import { useProducts } from '../../hooks/useProducts';
import ProductItem from './Product';

interface HotDealsSectionProps {
  className?: string;
}

export default function HotDealsSection({ className }: HotDealsSectionProps) {
  const { data: products } = useProducts({
    limit: 6,
    where: `(SubGenre,eq,3)~or(SubGenre,eq,2)~or(SubGenre,eq,1)`,
    sort: `-LastUpdated`,
  });
  return (
    <section className={`bg-white py-12 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            LASTEST PRODUCTS
          </h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {products?.map((product) => (
            <ProductItem key={product.ID} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
