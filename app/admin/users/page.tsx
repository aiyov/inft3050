'use client';

import { useState } from 'react';
import AdminLayout from '@/app/components/backstage-common/layout/AdminLayout';
import { usePatrons, Patron } from '@/app/hooks/usePatrons';
import { useCreatePatron } from '@/app/hooks/useCreatePatron';
import { useUpdatePatron } from '@/app/hooks/useUpdatePatron';
import { useDeletePatron } from '@/app/hooks/useDeletePatron';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '@/app/hooks/useAuth';

export default function UsersPage() {
  const { role } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPatron, setEditingPatron] = useState<Patron | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const isEmployee = role === 'employee';
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    password: '',
  });

  async function sha256(message: string) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }
  const generateSalt = () => {
    const salt = window.crypto.randomUUID().replaceAll("-", "");
    return salt;
  }

  // 使用patron hooks
  const { 
    data: patrons, 
    pageInfo, 
    currentPage, 
    getNextPage, 
    getPrevPage, 
    isLoading 
  } = usePatrons({
    limit: 25,
  });

  const createPatron = useCreatePatron();
  const updatePatron = useUpdatePatron();
  const deletePatron = useDeletePatron();

  const handleCreatePatron = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPatron.mutateAsync({
        Name: formData.Name,
        Email: formData.Email,
        Salt: generateSalt(),
        HashPW: await sha256(formData.password + generateSalt())
      });
      toast.success('Patron created successfully!');
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create patron:', error);
      toast.error('Failed to create patron. Please try again.');
    }
  };

  const handleUpdatePatron = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatron) return;
    
    try {
      await updatePatron.mutateAsync({ 
        patronId: editingPatron.UserID.toString(), 
        data: {
          Name: formData.Name,
          Email: formData.Email,
          Salt: generateSalt(),
          HashPW: await sha256(formData.password + generateSalt())
        }
      });
      toast.success('Patron updated successfully!');
      setEditingPatron(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update patron:', error);
      toast.error('Failed to update patron. Please try again.');
    }
  };

  const handleDeletePatron = async (patronId: string) => {
    if (!confirm('Are you sure you want to delete this patron?')) {
      return;
    }

    try {
      await deletePatron.mutateAsync(patronId);
      toast.success('Patron deleted successfully!');
    } catch (error) {
      console.error('Failed to delete patron:', error);
      toast.error('Failed to delete patron. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      Name: '',
      Email: '',
      password: '',
    });
  };

  const handleEditPatron = (patron: Patron) => {
    setEditingPatron(patron);
    setFormData({
      Name: patron.Name || '',
      Email: patron.Email || '',
      password: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  

  return (
    <AdminLayout>
      <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Patrons</h1>
              <p className="text-gray-600">
                {isEmployee ? 'View patron accounts' : 'Manage patron accounts'}
              </p>
            </div>
            {!isEmployee && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Patron
              </button>
            )}
          </div>

        {/* Patrons Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      Loading patrons...
                    </td>
                  </tr>
                ) : patrons.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      No patrons found
                    </td>
                  </tr>
                ) : (
                  patrons.map((patron) => (
                    <tr key={patron.UserID}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patron.UserID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patron.Name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patron.Email}
                      </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {!isEmployee ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditPatron(patron)}
                                className="text-yellow-600 hover:text-yellow-900"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePatron(patron.UserID.toString())}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">View Only</span>
                          )}
                        </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pageInfo && (
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
                    Showing <span className="font-medium">{((currentPage - 1) * 25) + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(currentPage * 25, pageInfo.totalRows)}</span> of{' '}
                    <span className="font-medium">{pageInfo.totalRows}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={getPrevPage}
                      disabled={pageInfo.isFirstPage}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={getNextPage}
                      disabled={pageInfo.isLastPage}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Create Modal */}
        {showCreateModal && !isEmployee && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Patron</h3>
                <form onSubmit={handleCreatePatron} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="Name"
                      value={formData.Name}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="Email"
                      value={formData.Email}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateModal(false);
                        resetForm();
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createPatron.isPending}
                      className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md disabled:opacity-50"
                    >
                      {createPatron.isPending ? 'Creating...' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingPatron && !isEmployee && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Patron</h3>
                <form onSubmit={handleUpdatePatron} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="Name"
                      value={formData.Name}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="Email"
                      value={formData.Email}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPatron(null);
                        resetForm();
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updatePatron.isPending}
                      className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md disabled:opacity-50"
                    >
                      {updatePatron.isPending ? 'Updating...' : 'Update'}
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