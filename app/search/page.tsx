'use client';

import { useEffect, useState } from 'react';
import { useProducts } from '@/app/hooks/useProducts';
import { useSearchParams } from 'next/navigation';
import Header from '@/app/components/layout/Header';
import Navigation from '@/app/components/layout/Navigation';
import ProductItem from '../components/sections/Product';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');

  useEffect(() => {
    setSearchQuery(searchParams?.get('q') || '');
  }, [searchParams]);

  
  const { 
    data: products, 
    pageInfo, 
    currentPage, 
    getNextPage, 
    getPrevPage, 
    isLoading,
    error 
  } = useProducts({
    limit: 25,
    where: `Name,like,${searchQuery}~or(Author,like,${searchQuery})~or(Description,like,${searchQuery})`,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Navigation */}
      <Navigation />
      <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Search Results */}
        {searchQuery && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">
              Search Results for &ldquo;{searchQuery}&rdquo;
            </h2>
            
            {isLoading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <p className="text-red-600">Error loading search results</p>
              </div>
            )}

            {!isLoading && !error && products.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">No products found for your search.</p>
              </div>
            )}

            {!isLoading && !error && products.length > 0 && (
              <>
                {/* Results Count */}
                <div className="mb-4 text-gray-600">
                  {pageInfo && (
                    <p>
                      Showing {((currentPage - 1) * 25) + 1} to {Math.min(currentPage * 25, pageInfo.totalRows)} of {pageInfo.totalRows} results
                    </p>
                  )}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <ProductItem key={product.ID} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pageInfo && (
                  <div className="mt-8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={getPrevPage}
                        disabled={pageInfo.isFirstPage}
                        className={`px-4 py-2 rounded-lg ${
                          pageInfo.isFirstPage
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Previous
                      </button>
                      
                      <span className="px-4 py-2 text-gray-600">
                        Page {currentPage} of {Math.ceil(pageInfo.totalRows / 25)}
                      </span>
                      
                      <button
                        onClick={getNextPage}
                        disabled={pageInfo.isLastPage}
                        className={`px-4 py-2 rounded-lg ${
                          pageInfo.isLastPage
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Initial State */}
        {!searchQuery && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">
              Search Products
            </h2>
            <p className="text-gray-500">
              Enter a search term above to find products
            </p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
