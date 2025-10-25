'use client';

import { X, LogIn, User } from 'lucide-react';
import Link from 'next/link';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginRequiredModal({ isOpen, onClose }: LoginRequiredModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <User className="w-6 h-6 text-yellow-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Login Required</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-yellow-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              Please Login to Continue
            </h4>
            <p className="text-gray-600">
              You need to be logged in to proceed with checkout and place orders.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/login?redirect=/cart"
              className="block w-full px-6 py-3 bg-yellow-400 text-black rounded-md hover:bg-yellow-500 transition-colors font-medium text-center"
              onClick={onClose}
            >
              Login Now
            </Link>
            <button
              onClick={onClose}
              className="block w-full px-6 py-3 text-gray-500 hover:text-gray-700 transition-colors font-medium"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
