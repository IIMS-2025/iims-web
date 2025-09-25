// External libraries
import React, { useState, useEffect } from 'react';

// API hooks
import { useGetOrdersQuery, useSyncOrdersMutation } from '../services/ordersApi';
import { useGetSalesMetricsQuery } from '../services/salesApi';

// Shared components
import {
  OrderHeader,
  OrderTable,
  OrderFilters,
  SyncButton,
  OrderDetailModal,
  FilterTag,
  LoadingState,
  SyncStatus,
  ApiErrorStatus
} from '../components/orders';

// Utility functions and types
import type { Order } from '../utils/orderData';
import type { OrderFiltersState } from '../utils/orderPageHelpers';
import {
  useOrdersPageLogic,
  createSyncHandler,
  createFilterHandlers,
  createOrderDetailHandlers,
  hasActiveFilters,
  formatFilterText,
  getStatusClasses
} from '../utils/ordersPageLogic';

// Styles
import '../styles/orders.css';

export default function OrdersPage() {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<OrderFiltersState>({});
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date(Date.now() - 5 * 60 * 1000));
  const [syncStatus, setSyncStatus] = useState<{ success: boolean; message?: string; refreshing?: boolean } | null>(null);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState<boolean>(false);

  // Business logic
  const {
    startDate,
    endDate,
  } = useOrdersPageLogic(null, null, filters, searchTerm);

  // API hooks - use default 5-minute window (no parameters)
  const { data: ordersData, error: ordersError, isLoading: ordersLoading, refetch: refetchOrders } = useGetOrdersQuery();
  const [syncOrders, { isLoading: isSyncing }] = useSyncOrdersMutation();
  const { data: salesMetrics, refetch: refetchSales } = useGetSalesMetricsQuery();

  // Update business logic with real data
  const finalLogic = useOrdersPageLogic(ordersData, salesMetrics, filters, searchTerm);

  // Auto-refresh every 30 seconds to keep the 5-minute window current
  useEffect(() => {
    const interval = setInterval(async () => {
      setIsAutoRefreshing(true);
      try {
        await refetchOrders();
      } finally {
        setTimeout(() => setIsAutoRefreshing(false), 1000); // Show indicator for 1 second
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [refetchOrders]);

  // Event handlers
  const handleSync = createSyncHandler(
    syncOrders,
    refetchOrders,
    refetchSales,
    setLastSyncTime,
    setSyncStatus,
    finalLogic.ordersToUse
  );

  const { handleFiltersChange, clearFilter, clearAllFilters } = createFilterHandlers(setFilters);
  const { handleOrderDetailsClick, closeOrderDetail } = createOrderDetailHandlers(
    setSelectedOrder,
    setIsOrderDetailOpen
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="w-full">
        {/* Header */}
        <OrderHeader
          totalOrders={finalLogic.orderStats.totalOrders}
          todayRevenue={salesMetrics?.todaySales || finalLogic.orderStats.revenue}
          peakHours={finalLogic.peakHours}
        />

        {/* Sync Button */}
        <SyncButton 
          onSync={handleSync}
          lastSyncTime={lastSyncTime}
          isLoading={isSyncing}
        />

        {/* Sync Status */}
        <SyncStatus syncStatus={syncStatus} getStatusClasses={getStatusClasses} />

        {/* Auto-refresh indicator */}
        {isAutoRefreshing && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-blue-700">Auto-refreshing orders...</span>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters(filters) && (
          <ActiveFiltersSection
            filters={filters}
            clearFilter={clearFilter}
            clearAllFilters={clearAllFilters}
          />
        )}

        {/* API Error Status */}
        <ApiErrorStatus hasError={!!ordersError} />

        {/* Orders Table */}
        <div className="order-list-container">
          {ordersLoading ? (
            <LoadingState startDate={finalLogic.startDate} endDate={finalLogic.endDate} />
          ) : (
            <OrderTable
              orders={finalLogic.filteredOrders}
              onMoreClick={handleOrderDetailsClick}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onFilterClick={() => setIsFilterOpen(true)}
            />
          )}
        </div>

        {/* Results Summary */}
        {!ordersLoading && finalLogic.filteredOrders.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-600">
            Showing {finalLogic.filteredOrders.length} of {finalLogic.ordersToUse.length} orders
            {ordersData && (
              <span className="ml-2 text-green-600">
                • Live data from last 5 minutes ({finalLogic.startDate} - {finalLogic.endDate})
              </span>
            )}
          </div>
        )}

        {/* Empty State Message */}
        {!ordersLoading && finalLogic.filteredOrders.length === 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            No orders found in the last 5 minutes. Click "Sync Orders" to fetch recent orders.
          </div>
        )}

        {/* Filter Modal */}
        <OrderFilters
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {/* Order Detail Modal */}
        <OrderDetailModal
          order={selectedOrder}
          isOpen={isOrderDetailOpen}
          onClose={closeOrderDetail}
        />
      </div>
    </div>
  );
}

// Active Filters Section Component
interface ActiveFiltersSectionProps {
  filters: OrderFiltersState;
  clearFilter: (filterKey: keyof OrderFiltersState) => void;
  clearAllFilters: () => void;
}

const ActiveFiltersSection: React.FC<ActiveFiltersSectionProps> = ({
  filters,
  clearFilter,
  clearAllFilters
}) => (
  <div className="bg-white rounded-xl p-4 mb-6 border border-gray-100">
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm font-medium text-gray-700">Active Filters:</span>
      
      {filters.status && (
        <FilterTag
          label={`Status: ${filters.status}`}
          onRemove={() => clearFilter('status')}
          colorClass="bg-blue-100 text-blue-700"
          buttonColorClass="text-blue-500 hover:text-blue-700"
        />
      )}
      
      {filters.orderType && (
        <FilterTag
          label={`Type: ${formatFilterText('orderType', filters.orderType)}`}
          onRemove={() => clearFilter('orderType')}
          colorClass="bg-green-100 text-green-700"
          buttonColorClass="text-green-500 hover:text-green-700"
        />
      )}
      
      {filters.paymentStatus && (
        <FilterTag
          label={`Payment: ${filters.paymentStatus}`}
          onRemove={() => clearFilter('paymentStatus')}
          colorClass="bg-purple-100 text-purple-700"
          buttonColorClass="text-purple-500 hover:text-purple-700"
        />
      )}
      
      <button 
        onClick={clearAllFilters}
        className="text-sm text-gray-500 hover:text-gray-700 underline"
      >
        Clear all
      </button>
    </div>
  </div>
);