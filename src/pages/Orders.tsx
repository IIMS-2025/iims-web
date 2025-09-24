// External libraries
import React, { useState, useMemo } from 'react';

// Shared components
import {
  OrderHeader,
  OrderTable,
  OrderFilters,
  SyncButton,
  ActiveFilters,
  ResultsSummary
} from '../components/orders';

// Local utilities and data
import { mockOrders, calculateOrderStats } from '../utils/orderData';
import type { Order } from '../utils/orderData';
import {
  filterAndSearchOrders,
  simulateOrderSync,
  hasActiveFilters,
  type OrderFiltersState
} from '../utils/orderPageHelpers';

// Styles
import '../styles/orders.css';

export default function OrdersPage() {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<OrderFiltersState>({});
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date(Date.now() - 5 * 60 * 1000));

  // Computed values
  const orderStats = useMemo(() => calculateOrderStats(mockOrders), []);
  const filteredOrders = useMemo(() => 
    filterAndSearchOrders(mockOrders, filters, searchTerm), 
    [filters, searchTerm]
  );

  // Event handlers
  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    console.log('Order clicked:', order);
  };

  const handleMoreClick = (order: Order) => {
    console.log('More options for order:', order);
  };

  const handleFiltersChange = (newFilters: OrderFiltersState) => {
    setFilters(newFilters);
  };

  const handleSync = async () => {
    setLastSyncTime(new Date());
    return simulateOrderSync();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="w-full">
        {/* Header */}
        <OrderHeader
          totalOrders={orderStats.totalOrders}
          todayRevenue={orderStats.revenue}
          peakHours="12-2 PM"
        />

        {/* Sync Button */}
        <SyncButton 
          onSync={handleSync}
          lastSyncTime={lastSyncTime}
        />

        {/* Active Filters Display */}
        {(filters.status || filters.orderType || filters.paymentStatus) && (
          <div className="bg-white rounded-xl p-4 mb-6 border border-gray-100">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium text-gray-700">Active Filters:</span>
              {filters.status && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                  Status: {filters.status}
                  <button 
                    onClick={() => setFilters(prev => ({ ...prev, status: undefined }))}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.orderType && (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                  Type: {filters.orderType.replace('-', ' ')}
                  <button 
                    onClick={() => setFilters(prev => ({ ...prev, orderType: undefined }))}
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
                    onClick={() => setFilters(prev => ({ ...prev, paymentStatus: undefined }))}
                    className="ml-2 text-purple-500 hover:text-purple-700"
                  >
                    ×
                  </button>
                </span>
              )}
              <button 
                onClick={() => setFilters({})}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear all
              </button>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="order-list-container">
          <OrderTable
            orders={filteredOrders}
            onOrderClick={handleOrderClick}
            onMoreClick={handleMoreClick}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onFilterClick={() => setIsFilterOpen(true)}
          />
        </div>

        {/* Results Summary */}
        {filteredOrders.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-600">
            Showing {filteredOrders.length} of {mockOrders.length} orders
          </div>
        )}

        {/* Filter Modal */}
        <OrderFilters
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      </div>
    </div>
  );
}
