import { useMemo } from 'react';
import type { Order } from './orderData';
import type { OrderFiltersState } from './orderPageHelpers';
import {
  transformApiOrders,
  calculateSyncStats,
  getDefaultDateRange,
  hasActiveFilters,
  formatFilterText,
  createSyncStatusMessage,
  getStatusClasses,
  calculatePeakHours,
  calculateTotalQuantities
} from './ordersPageUtils';
import { mockOrders, calculateOrderStats } from './orderData';
import { filterAndSearchOrders } from './orderPageHelpers';

/**
 * Custom hook for Orders page business logic
 */
export const useOrdersPageLogic = (
  ordersData: any,
  salesMetrics: any,
  filters: OrderFiltersState,
  searchTerm: string
) => {
  // Date range for API queries
  const { startDate, endDate } = getDefaultDateRange(10);

  // Data transformation and computed values
  const transformedOrders = useMemo(() => transformApiOrders(ordersData), [ordersData]);
  const ordersToUse = ordersData ? transformedOrders : mockOrders;
  const orderStats = useMemo(() => calculateOrderStats(ordersToUse), [ordersToUse]);
  const filteredOrders = useMemo(() => 
    filterAndSearchOrders(ordersToUse, filters, searchTerm), 
    [ordersToUse, filters, searchTerm]
  );
  const peakHours = useMemo(() => calculatePeakHours(ordersToUse), [ordersToUse]);

  return {
    startDate,
    endDate,
    transformedOrders,
    ordersToUse,
    orderStats,
    filteredOrders,
    peakHours
  };
};

/**
 * Sync operation business logic
 */
export const createSyncHandler = (
  syncOrders: any,
  refetchOrders: any,
  refetchSales: any,
  setLastSyncTime: (date: Date) => void,
  setSyncStatus: (status: any) => void,
  ordersToUse: Order[]
) => {
  return async () => {
    try {
      setSyncStatus(null);
      const result = await syncOrders().unwrap();
      setLastSyncTime(new Date());
      
      const { totalSynced, totalAmount, totalQuantities: syncedQuantities } = calculateSyncStats(result);
      const message = createSyncStatusMessage(true, totalSynced, totalAmount, syncedQuantities);
      
      setSyncStatus({ success: true, message });
      
      // Show refreshing status
      setSyncStatus({ 
        success: true, 
        message: `${message} - Refreshing data...`,
        refreshing: true
      });
      
      // Refresh data after successful sync
      const [updatedOrdersResult, updatedSalesResult] = await Promise.all([
        refetchOrders(),
        refetchSales()
      ]);
      
      // Calculate updated totals from refreshed data
      const updatedOrders = updatedOrdersResult.data 
        ? transformApiOrders(updatedOrdersResult.data) 
        : ordersToUse;
      const updatedStats = calculateOrderStats(updatedOrders);
      const updatedRevenue = updatedSalesResult.data?.todaySales || updatedStats.revenue;
      const totalQuantities = calculateTotalQuantities(updatedOrders);
      
      // Update status to show completion with updated totals
      setSyncStatus({ 
        success: true, 
        message: `${message} - Total: ${updatedStats.totalOrders} orders, ${totalQuantities} items, ₹${updatedRevenue.toLocaleString()} revenue` 
      });
      
      setTimeout(() => setSyncStatus(null), 5000);
    } catch (error: any) {
      console.error('Sync failed:', error);
      const message = error?.data?.message || createSyncStatusMessage(false, 0, '0');
      setSyncStatus({ success: false, message });
      setTimeout(() => setSyncStatus(null), 5000);
    }
  };
};

/**
 * Filter management utilities
 */
export const createFilterHandlers = (
  setFilters: (filters: OrderFiltersState | ((prev: OrderFiltersState) => OrderFiltersState)) => void
) => ({
  handleFiltersChange: (newFilters: OrderFiltersState) => {
    setFilters(newFilters);
  },
  
  clearFilter: (filterKey: keyof OrderFiltersState) => {
    setFilters(prev => ({ ...prev, [filterKey]: undefined }));
  },
  
  clearAllFilters: () => {
    setFilters({});
  }
});

/**
 * Order detail modal handlers
 */
export const createOrderDetailHandlers = (
  setSelectedOrder: (order: Order | null) => void,
  setIsOrderDetailOpen: (open: boolean) => void
) => ({
  handleOrderDetailsClick: (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDetailOpen(true);
  },
  
  closeOrderDetail: () => {
    setIsOrderDetailOpen(false);
    setSelectedOrder(null);
  }
});

// Re-export utilities for backward compatibility
export {
  transformApiOrders,
  calculateSyncStats,
  getDefaultDateRange,
  hasActiveFilters,
  formatFilterText,
  createSyncStatusMessage,
  getStatusClasses,
  calculatePeakHours,
  calculateTotalQuantities
};
