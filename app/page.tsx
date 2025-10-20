'use client';
import Header from '@/app/components/layout/Header';
import Navigation from '@/app/components/layout/Navigation';
import PromoBanner from '@/app/components/sections/PromoBanner';
import CategorySection from '@/app/components/sections/CategorySection';
import HotDealsSection from '@/app/components/sections/HotDealsSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Promo Banner */}
      <PromoBanner />
      
      {/* Category Section */}
      <CategorySection />
      
      {/* Hot Deals Section */}
      <HotDealsSection />
    </div>
  );
}
