'use client';

import { useState } from 'react';
import useAuth from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminLayout from '@/app/components/backstage-common/layout/AdminLayout';
import { mockOrders } from '@/app/lib/mock-data';
import { simulateApiDelay } from '@/app/lib/mock-data';
import { Edit, Trash2, X } from 'lucide-react';

export default function MyOrdersPage() {
  const { user, isAuthenticated, role } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState(() => [] as typeof mockOrders);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  

  const handleUpdateOrder = async (orderId: string, newStatus: string) => {
    setLoading(true);
    try {
      await simulateApiDelay(1000);
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus as any, updatedAt: new Date().toISOString() }
          : order
      ));
      // Persist in mock store so navigation keeps the change
      const idx = mockOrders.findIndex(o => o.id === orderId);
      if (idx !== -1) {
        mockOrders[idx] = { ...mockOrders[idx], status: newStatus as any, updatedAt: new Date().toISOString() };
      }
    } catch (error) {
      console.error('Failed to update order:', error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (order: (typeof orders)[number]) => {
    setEditingOrderId(order.id);
    setEditForm({
      firstName: order.shippingAddress.firstName,
      lastName: order.shippingAddress.lastName,
      address: order.shippingAddress.address,
      city: order.shippingAddress.city,
      state: order.shippingAddress.state,
      zipCode: order.shippingAddress.zipCode,
      country: order.shippingAddress.country,
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingOrderId(null);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrderId) return;
    setLoading(true);
    try {
      await simulateApiDelay(800);
      // update local state
      setOrders(prev => prev.map(o =>
        o.id === editingOrderId
          ? {
              ...o,
              shippingAddress: { ...o.shippingAddress, ...editForm },
              updatedAt: new Date().toISOString(),
            }
          : o
      ));
      // persist to mock store
      const idx = mockOrders.findIndex(o => o.id === editingOrderId);
      if (idx !== -1) {
        mockOrders[idx] = {
          ...mockOrders[idx],
          shippingAddress: { ...mockOrders[idx].shippingAddress, ...editForm },
          updatedAt: new Date().toISOString(),
        };
      }
      closeEditModal();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) {
      return;
    }

    setLoading(true);
    try {
      await simulateApiDelay(1000);
      
      setOrders(prev => prev.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Failed to delete order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !user || role !== 'customer') {
    return null;
  }

  // no status display

  // No status concept restriction: allow customer to edit anytime

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600">Manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-500">You have no orders yet.</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    {/* no status column */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id}
                      </td>
                      {/* no status cell */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${order.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => openEditModal(order)}
                          disabled={loading}
                          className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          disabled={loading || order.status === 'delivered'}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {showEditModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={closeEditModal} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900">Edit Order</h3>
                <button onClick={closeEditModal} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSaveEdit} className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="firstName">First Name</label>
                    <input id="firstName" name="firstName" value={editForm.firstName} onChange={handleEditChange} required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="lastName">Last Name</label>
                    <input id="lastName" name="lastName" value={editForm.lastName} onChange={handleEditChange} required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="address">Address</label>
                  <input id="address" name="address" value={editForm.address} onChange={handleEditChange} required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="city">City</label>
                    <input id="city" name="city" value={editForm.city} onChange={handleEditChange} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="state">State</label>
                    <input id="state" name="state" value={editForm.state} onChange={handleEditChange} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="zipCode">ZIP</label>
                    <input id="zipCode" name="zipCode" value={editForm.zipCode} onChange={handleEditChange} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="country">Country</label>
                  <input id="country" name="country" value={editForm.country} onChange={handleEditChange} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={closeEditModal} className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={loading} className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
