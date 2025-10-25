'use client';

import { useState } from 'react';
import useOrders from '@/app/hooks/useOrders';
import useDeleteOrder from '@/app/hooks/useDeleteOrders';
import { useTo } from '@/app/hooks/useTo';
import { useStocktake } from '@/app/hooks/useStocktake';
import { Trash2, Eye, Package, MapPin, CreditCard, User } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '@/app/components/backstage-common/layout/AdminLayout';

// StocktakeItem component for displaying individual products
function StocktakeItem({ itemId, sourceId, index }: { itemId: number; sourceId: number; index: number }) {
  const { data: stocktakeDetail, isLoading } = useStocktake(itemId);

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!stocktakeDetail) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <p className="text-gray-500">Failed to load product details</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                #{index + 1}
              </span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">
                {stocktakeDetail.Product.Name}
              </h4>
              <p className="text-sm text-gray-500">
                Product ID: {stocktakeDetail.Product.ID} | Item ID: {itemId} | Source ID: {sourceId}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-6 text-sm">
          <div className="text-center">
            <span className="text-gray-500">Quantity</span>
            <p className="font-medium text-gray-900">{stocktakeDetail.Quantity}</p>
          </div>
          <div className="text-center">
            <span className="text-gray-500">Price</span>
            <p className="font-medium text-gray-900">${stocktakeDetail.Price.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <span className="text-gray-500">Total</span>
            <p className="font-semibold text-gray-900">
              ${(stocktakeDetail.Quantity * stocktakeDetail.Price).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  
  // 获取订单列表
  const { 
    data: orders, 
    pageInfo, 
    currentPage, 
    getNextPage, 
    getPrevPage, 
    isLoading 
  } = useOrders({
    limit: 25,
  });

  // 获取选中订单的TO详情
  const selectedOrderData = orders.find(order => order.OrderID === selectedOrder);
  const toCustomerId = selectedOrderData?.TO?.CustomerID;
  const { data: toDetail } = useTo(toCustomerId || 0);
  
  // 获取选中订单的Stocktake列表
  const stocktakeItems = selectedOrderData?.["Stocktake List"] || [];
  
  // 删除订单
  const deleteOrder = useDeleteOrder();

  const handleViewOrder = (orderId: number) => {
    setSelectedOrder(orderId);
    setShowOrderDetail(true);
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (!confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      await deleteOrder.mutateAsync(orderId);
      toast.success('Order deleted successfully!');
    } catch (error) {
      console.error('Failed to delete order:', error);
      toast.error('Failed to delete order. Please try again.');
    }
  };

  const handleCloseDetail = () => {
    setShowOrderDetail(false);
    setSelectedOrder(null);
  };

  return (
    <AdminLayout>
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Package className="w-8 h-8 mr-3" />
            My Orders
          </h1>
          <p className="text-gray-600 mt-2">View and manage your orders</p>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Order History</h2>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">You haven&apos;t placed any orders yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {orders.map((order) => (
                <div key={order.OrderID} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-500">Order ID:</span>
                          <span className="ml-2 text-lg font-semibold text-gray-900">#{order.OrderID}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">
                            {order.StreetAddress}, {order.PostCode} {order.State}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Items:</span> {order["Stocktake List"].length} items
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewOrder(order.OrderID)}
                        className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.OrderID)}
                        className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {orders.length > 0 && pageInfo && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={getPrevPage}
                disabled={pageInfo.isFirstPage}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={getNextPage}
                disabled={pageInfo.isLastPage}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{Math.ceil(pageInfo.totalRows / 25)}</span>
                  {' '}(<span className="font-medium">{pageInfo.totalRows}</span> total orders)
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={getPrevPage}
                    disabled={pageInfo.isFirstPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={getNextPage}
                    disabled={pageInfo.isLastPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Order Detail Modal */}
        {showOrderDetail && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order #{selectedOrder} Details
                  </h2>
                  <button
                    onClick={handleCloseDetail}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Customer Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Customer Information
                    </h3>
                    {toDetail ? (
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Email:</span>
                          <p className="text-gray-900">{toDetail.Email}</p>
                        </div>
                        {toDetail.PhoneNumber && (
                          <div>
                            <span className="text-sm font-medium text-gray-500">Phone:</span>
                            <p className="text-gray-900">{toDetail.PhoneNumber}</p>
                          </div>
                        )}
                        <div>
                          <span className="text-sm font-medium text-gray-500">Address:</span>
                          <p className="text-gray-900">
                            {toDetail.StreetAddress || 'N/A'}, {toDetail.PostCode || 'N/A'}, {toDetail.State || 'N/A'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">Loading customer details...</p>
                    )}
                  </div>

                  {/* Payment Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Payment Information
                    </h3>
                    {toDetail ? (
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Card Owner:</span>
                          <p className="text-gray-900">{toDetail.CardOwner}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Card Number:</span>
                          <p className="text-gray-900">****{toDetail.CardNumber.slice(-4)}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">Loading payment details...</p>
                    )}
                  </div>
                </div>

                {/* Products List */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Products in Order ({stocktakeItems.length} items)
                  </h3>
                  
                  {stocktakeItems.length > 0 ? (
                    <div className="space-y-4">
                      {stocktakeItems.map((item, index) => (
                        <StocktakeItem 
                          key={item.ItemId} 
                          itemId={item.ItemId} 
                          sourceId={item.SourceId}
                          index={index}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No products in this order.</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={handleCloseDetail}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(selectedOrder)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </AdminLayout>
  );
}
