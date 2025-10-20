'use client';

import { useProducts } from '@/app/hooks/useProducts';
import { useParams } from 'next/navigation';
import Header from '@/app/components/layout/Header';
import Navigation from '@/app/components/layout/Navigation';
import ProductItem from '../../components/sections/Product';

export default function GenrePage() {
  const params = useParams();
  const genreId = params?.id as string;
  
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
    where: `(SubGenre,eq,${genreId})`,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Navigation */}
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading products...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading products</p>
            </div>
          )}

          {/* No Results */}
          {!isLoading && !error && products.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No products found for this genre.</p>
            </div>
          )}

          {/* Products List */}
          {!isLoading && !error && products.length > 0 && (
            <>
              {/* Results Count */}
              <div className="mb-4 text-gray-600">
                {pageInfo && (
                  <p>
                    Showing {((currentPage - 1) * 25) + 1} to {Math.min(currentPage * 25, pageInfo.totalRows)} of {pageInfo.totalRows} products
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
      </div>
    </div>
  );
}
