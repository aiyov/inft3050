import { useGenres } from "@/app/hooks/useGenres";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationProps {
  className?: string;
}


export default function Navigation({ className }: NavigationProps) {
  const { data: genres } = useGenres();
  const pathname = usePathname();
  
  return (
    <nav className={`bg-black ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-8 py-4">
          {genres?.list.map(({Name, GenreID}) => {
            const isActive = pathname === `/genres/${GenreID}`;
            return (
              <Link 
                className={`transition-colors font-medium text-sm whitespace-nowrap px-3 py-2 rounded-md ${
                  isActive 
                    ? 'bg-yellow-400 text-black font-semibold' 
                    : 'text-white hover:text-yellow-400 hover:bg-gray-800'
                }`} 
                href={`/genres/${GenreID}`} 
                key={GenreID}
              >
                {Name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
