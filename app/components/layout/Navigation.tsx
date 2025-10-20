import { useGenres } from "@/app/hooks/useGenres";

interface NavigationProps {
  className?: string;
}

const navigationItems = [
  'Products',
  'Brands',
  'Deals & Catalogues',
  'Clearance',
  'Services',
  'Gift Cards',
  'Join JB Perks',
  'News & Reviews',
];

export default function Navigation({ className }: NavigationProps) {
  const { data: genres } = useGenres();
  return (
    <nav className={`bg-black ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-8 py-4">
          {navigationItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className="text-white hover:text-yellow-400 transition-colors font-medium text-sm whitespace-nowrap"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
