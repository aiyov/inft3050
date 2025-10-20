'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/app/components/admin/layout/AdminLayout';
import { mockProducts } from '@/app/lib/mock-data';
import { simulateApiDelay } from '@/app/lib/mock-data';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

export default function ProductsPage() {
  const { authState } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    sku: '',
    stock: '',
    imageUrl: '',
    isActive: true,
  });

  useEffect(() => {
    if (!authState.isAuthenticated || !authState.user) {
      router.push('/admin/login');
      return;
    }

    // Only admin and employee can access this page
    if (!['admin', 'employee'].includes(authState.user.role)) {
      router.push('/admin/my-orders');
      return;
    }
  }, [authState, router]);

  const isAdmin = authState.user?.role === 'admin';

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await simulateApiDelay(1000);
      
      const newProduct = {
        id: (products.length + 1).toString(),
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setProducts(prev => [...prev, newProduct]);
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await simulateApiDelay(1000);
      
      const updatedProduct = {
        ...editingProduct,
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        updatedAt: new Date().toISOString(),
      };

      setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
      setEditingProduct(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setLoading(true);
    try {
      await simulateApiDelay(1000);
      
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Failed to delete product:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      brand: '',
      sku: '',
      stock: '',
      imageUrl: '',
      isActive: true,
    });
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      brand: product.brand,
      sku: product.sku,
      stock: product.stock.toString(),
      imageUrl: product.imageUrl || '',
      isActive: product.isActive,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (!authState.isAuthenticated || !authState.user || !['admin', 'employee'].includes(authState.user.role)) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">Manage your product inventory</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </button>
          )}
        </div>

        {/* Products Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            {product.imageUrl ? (
                              <img className="h-12 w-12 rounded-lg object-cover" src={product.imageUrl} alt={product.name} />
                            ) : (
                              <Package className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.brand}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Modal */}
        {(showCreateModal || editingProduct) && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => {
                setShowCreateModal(false);
                setEditingProduct(null);
                resetForm();
              }}></div>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="w-full">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                          {editingProduct ? 'Edit Product' : 'Create New Product'}
                        </h3>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Product Name
                              </label>
                              <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                              />
                            </div>

                            <div>
                              <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                                Brand
                              </label>
                              <input
                                type="text"
                                id="brand"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                              Description
                            </label>
                            <textarea
                              id="description"
                              name="description"
                              value={formData.description}
                              onChange={handleChange}
                              required
                              rows={3}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                Price
                              </label>
                              <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                              />
                            </div>

                            <div>
                              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                                Stock
                              </label>
                              <input
                                type="number"
                                id="stock"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                                min="0"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                              />
                            </div>

                            <div>
                              <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                                SKU
                              </label>
                              <input
                                type="text"
                                id="sku"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                              Category
                            </label>
                            <select
                              id="category"
                              name="category"
                              value={formData.category}
                              onChange={handleChange}
                              required
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                            >
                              <option value="">Select Category</option>
                              <option value="Mobile Phones">Mobile Phones</option>
                              <option value="Computers & Tablets">Computers & Tablets</option>
                              <option value="TVs & Home Theatre">TVs & Home Theatre</option>
                              <option value="Headphones, Speakers & Audio">Headphones, Speakers & Audio</option>
                              <option value="Home Appliances">Home Appliances</option>
                              <option value="Gaming">Gaming</option>
                            </select>
                          </div>

                          <div>
                            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                              Image URL
                            </label>
                            <input
                              type="url"
                              id="imageUrl"
                              name="imageUrl"
                              value={formData.imageUrl}
                              onChange={handleChange}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                            />
                          </div>

                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="isActive"
                              name="isActive"
                              checked={formData.isActive}
                              onChange={handleChange}
                              className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                              Active
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateModal(false);
                        setEditingProduct(null);
                        resetForm();
                      }}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
