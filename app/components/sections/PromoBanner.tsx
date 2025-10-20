interface PromoBannerProps {
  className?: string;
}

export default function PromoBanner({ className }: PromoBannerProps) {
  return (
    <section className={`bg-yellow-400 py-8 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Main Promo Title */}
        <div className="bg-red-600 text-white px-6 py-4 rounded-lg mb-8 flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold">
            PRICES SMASHED ON COMPUTERS!
          </h2>
          <button className="bg-white text-red-600 px-6 py-2 rounded font-medium hover:bg-gray-100 transition-colors">
            View all
          </button>
        </div>

        {/* Product Carousel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Product Card 1 */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
              41% OFF
            </div>
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-gray-500">HP Laptop Image</span>
            </div>
            <h3 className="font-semibold text-sm mb-2">
              HP OmniBook 5 NG AI 16" 2K Laptop (Ryzen AI 7)[512GB]
            </h3>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-gray-500 line-through text-sm">$2,399</span>
              <span className="text-2xl font-bold text-green-600">$1,399</span>
            </div>
            <div className="text-red-600 font-semibold text-sm mb-2">
              $1,000 OFF
            </div>
            <div className="text-xs text-gray-600">
              Ends: 22 October 2025
            </div>
          </div>

          {/* Product Card 2 */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
              $330 OFF
            </div>
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-gray-500">Laptop Image</span>
            </div>
            <h3 className="font-semibold text-sm mb-2">
              Gaming Laptop with RTX Graphics
            </h3>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-gray-500 line-through text-sm">$1,899</span>
              <span className="text-2xl font-bold text-green-600">$1,569</span>
            </div>
            <div className="text-red-600 font-semibold text-sm mb-2">
              $330 OFF
            </div>
            <div className="text-xs text-gray-600">
              Ends: 25 October 2025
            </div>
          </div>

          {/* Product Card 3 */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
              $160 OFF
            </div>
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-gray-500">Laptop Image</span>
            </div>
            <h3 className="font-semibold text-sm mb-2">
              Ultrabook Pro 14" Lightweight Laptop
            </h3>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-gray-500 line-through text-sm">$1,299</span>
              <span className="text-2xl font-bold text-green-600">$1,139</span>
            </div>
            <div className="text-red-600 font-semibold text-sm mb-2">
              $160 OFF
            </div>
            <div className="text-xs text-gray-600">
              Ends: 28 October 2025
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
            <span className="text-black">‹</span>
          </button>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
          <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
            <span className="text-black">›</span>
          </button>
        </div>
      </div>
    </section>
  );
}
