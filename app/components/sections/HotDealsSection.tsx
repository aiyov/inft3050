import { Heart } from 'lucide-react';

interface HotDealsSectionProps {
  className?: string;
}

const hotDeals = [
  {
    id: 1,
    name: 'Apple iPhone 16e 128GB',
    image: '📱',
    price: '$899',
    originalPrice: '$1,099',
    badge: 'ON SALE',
    discount: '$200 OFF',
  },
  {
    id: 2,
    name: 'Gaming Laptop RTX 4070',
    image: '💻',
    price: '$1,299',
    originalPrice: '$1,599',
    badge: 'HOT DEAL',
    discount: '$300 OFF',
  },
  {
    id: 3,
    name: 'Beats Studio Pro',
    image: '🎧',
    price: '$299',
    originalPrice: '$399',
    badge: 'BUNDLE BUY',
    discount: '$100 OFF',
  },
  {
    id: 4,
    name: 'Robot Vacuum Cleaner',
    image: '🤖',
    price: '$399',
    originalPrice: '$599',
    badge: 'ON SALE',
    discount: '$200 OFF',
  },
  {
    id: 5,
    name: 'SAMSUNG Galaxy S24 Ultra',
    image: '📱',
    price: '$1,199',
    originalPrice: '$1,399',
    badge: 'HOT DEAL',
    discount: '$200 OFF',
  },
  {
    id: 6,
    name: 'Google Pixel 8 Pro',
    image: '📱',
    price: '$899',
    originalPrice: '$1,099',
    badge: 'BUNDLE BUY',
    discount: '$200 OFF',
  },
];

export default function HotDealsSection({ className }: HotDealsSectionProps) {
  return (
    <section className={`bg-white py-12 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            THIS WEEK'S HOTTEST DEALS
          </h2>
          <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
            View all hot deals &gt;
          </a>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {hotDeals.map((deal) => (
            <div key={deal.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer relative">
              {/* Wishlist Button */}
              <button className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors">
                <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
              </button>

              {/* Badge */}
              <div className="absolute top-2 left-2">
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  deal.badge === 'ON SALE' ? 'bg-red-500 text-white' :
                  deal.badge === 'HOT DEAL' ? 'bg-orange-500 text-white' :
                  'bg-green-500 text-white'
                }`}>
                  {deal.badge}
                </span>
              </div>

              {/* Product Image */}
              <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-4xl">
                {deal.image}
              </div>

              {/* Product Info */}
              <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                {deal.name}
              </h3>
              
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 line-through text-xs">
                    {deal.originalPrice}
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    {deal.price}
                  </span>
                </div>
                <div className="text-red-600 font-semibold text-xs">
                  {deal.discount}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
