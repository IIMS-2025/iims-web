import React from 'react';
import type { Order } from '../../utils/orderData';

interface OrderFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    status?: Order['status'];
    orderType?: Order['orderType'];
    paymentStatus?: Order['paymentStatus'];
  };
  onFiltersChange: (filters: {
    status?: Order['status'];
    orderType?: Order['orderType'];
    paymentStatus?: Order['paymentStatus'];
  }) => void;
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange
}) => {
  if (!isOpen) return null;

  const statusOptions: Order['status'][] = [
    'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'
  ];

  const orderTypeOptions: Order['orderType'][] = [
    'dine-in', 'takeaway', 'delivery'
  ];

  const paymentStatusOptions: Order['paymentStatus'][] = [
    'pending', 'paid', 'failed'
  ];

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value === 'all' ? undefined : value
    };
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Filter panel */}
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Filter Orders</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Order Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Order Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleFilterChange('status', 'all')}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    !filters.status 
                      ? 'bg-blue-50 border-blue-200 text-blue-700' 
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All Status
                </button>
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleFilterChange('status', status)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors capitalize ${
                      filters.status === status
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Order Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Order Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleFilterChange('orderType', 'all')}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    !filters.orderType 
                      ? 'bg-blue-50 border-blue-200 text-blue-700' 
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All Types
                </button>
                {orderTypeOptions.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleFilterChange('orderType', type)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors capitalize ${
                      filters.orderType === type
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {type.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleFilterChange('paymentStatus', 'all')}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    !filters.paymentStatus 
                      ? 'bg-blue-50 border-blue-200 text-blue-700' 
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All Payments
                </button>
                {paymentStatusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleFilterChange('paymentStatus', status)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors capitalize ${
                      filters.paymentStatus === status
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
