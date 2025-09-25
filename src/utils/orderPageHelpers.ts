import type { Order } from './orderData';
import { filterOrdersByStatus, filterOrdersByType, sortOrdersByTime } from './orderData';

// Type definitions
export interface OrderFiltersState {
  status?: Order['status'];
  orderType?: Order['orderType'];
  paymentStatus?: Order['paymentStatus'];
}

// Filter and search logic
export const filterAndSearchOrders = (
  orders: Order[],
  filters: OrderFiltersState,
  searchTerm: string
): Order[] => {
  let result = [...orders];

  // Apply status filter
  if (filters.status) {
    result = filterOrdersByStatus(result, filters.status);
  }

  // Apply order type filter
  if (filters.orderType) {
    result = filterOrdersByType(result, filters.orderType);
  }

  // Apply payment status filter
  if (filters.paymentStatus) {
    result = result.filter(order => order.paymentStatus === filters.paymentStatus);
  }

  // Apply search term
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter(order => 
      order.customer.name.toLowerCase().includes(term) ||
      order.orderNumber.toLowerCase().includes(term) ||
      order.customer.phone.includes(term) ||
      order.items.some(item => item.name.toLowerCase().includes(term))
    );
  }

  // Sort by order time (most recent first)
  return sortOrdersByTime(result, 'desc');
};

// Sync simulation helper
export const simulateOrderSync = (): Promise<void> => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000); // 2 second delay to simulate API call
  });
};

// Order type formatting helper
export const formatOrderType = (orderType: Order['orderType']): string => {
  return orderType.replace('-', ' ');
};

// Filter management helpers
export const clearFilterByType = (
  filters: OrderFiltersState, 
  filterType: keyof OrderFiltersState
): OrderFiltersState => {
  return { ...filters, [filterType]: undefined };
};

export const clearAllFilters = (): OrderFiltersState => {
  return {};
};

// Check if any filters are active
export const hasActiveFilters = (filters: OrderFiltersState): boolean => {
  return !!(filters.status || filters.orderType || filters.paymentStatus);
};
