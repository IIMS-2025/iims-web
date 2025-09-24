import React from 'react';
import type { OrderFiltersState } from '../../utils/orderPageHelpers';
import { formatOrderType, clearFilterByType, clearAllFilters } from '../../utils/orderPageHelpers';

interface ActiveFiltersProps {
  filters: OrderFiltersState;
  onFiltersChange: (filters: OrderFiltersState) => void;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const handleRemoveFilter = (filterType: keyof OrderFiltersState) => {
    onFiltersChange(clearFilterByType(filters, filterType));
  };

  const handleClearAll = () => {
    onFiltersChange(clearAllFilters());
  };

  return (
    <div className="bg-white rounded-xl p-4 mb-6 border border-gray-100">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium text-gray-700">Active Filters:</span>
        
        {filters.status && (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
            Status: {filters.status}
            <button 
              onClick={() => handleRemoveFilter('status')}
              className="ml-2 text-blue-500 hover:text-blue-700"
            >
              ×
            </button>
          </span>
        )}
        
        {filters.orderType && (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
            Type: {formatOrderType(filters.orderType)}
            <button 
              onClick={() => handleRemoveFilter('orderType')}
              className="ml-2 text-green-500 hover:text-green-700"
            >
              ×
            </button>
          </span>
        )}
        
        {filters.paymentStatus && (
          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
            Payment: {filters.paymentStatus}
            <button 
              onClick={() => handleRemoveFilter('paymentStatus')}
              className="ml-2 text-purple-500 hover:text-purple-700"
            >
              ×
            </button>
          </span>
        )}
        
        <button 
          onClick={handleClearAll}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Clear all
        </button>
      </div>
    </div>
  );
};
