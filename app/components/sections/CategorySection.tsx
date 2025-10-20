interface CategorySectionProps {
  className?: string;
}

const categories = [
  { name: 'New at JB!', icon: '🆕', color: 'bg-blue-500' },
  { name: 'Mobile Phones', icon: '📱', color: 'bg-gray-500' },
  { name: 'Computers & Tablets', icon: '💻', color: 'bg-gray-600' },
  { name: 'TVs & Home Theatre', icon: '📺', color: 'bg-gray-700' },
  { name: 'Headphones, Speakers & Audio', icon: '🎧', color: 'bg-gray-800' },
  { name: 'Home Appliances', icon: '🏠', color: 'bg-gray-900' },
  { name: 'Fitness, Health & Beauty', icon: '💍', color: 'bg-pink-500' },
  { name: 'Smart Home', icon: '🏡', color: 'bg-green-500' },
  { name: 'Home Security', icon: '📹', color: 'bg-red-500' },
  { name: 'Gaming', icon: '🎮', color: 'bg-purple-500' },
];

export default function CategorySection({ className }: CategorySectionProps) {
  return (
    <section className={`bg-white py-12 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center space-x-8 overflow-x-auto pb-4">
          {categories.map((category, index) => (
            <div key={index} className="flex flex-col items-center min-w-0 flex-shrink-0">
              <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center text-white text-2xl mb-2 hover:scale-110 transition-transform cursor-pointer`}>
                {category.icon}
              </div>
              <span className="text-xs text-center text-gray-700 font-medium">
                {category.name}
              </span>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
            <span className="text-gray-600">‹</span>
          </button>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
          <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
            <span className="text-gray-600">›</span>
          </button>
        </div>
      </div>
    </section>
  );
}
