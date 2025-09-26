import type { Order } from './orderData';
import type { OrderItem, OrdersResponse } from '../types';

/**
 * Transform API orders response to match Order interface
 */
export const transformApiOrders = (ordersData: OrdersResponse | undefined): Order[] => {
  if (!ordersData?.data) return [];
  
  return ordersData.data.map((apiOrder, index): Order => ({
    id: apiOrder.pos_order_id,
    orderNumber: apiOrder.pos_order_id,
    customer: {
      id: `customer-${index + 1}`,
      name: `Customer ${index + 1}`,
      phone: '',
      address: {
        street: '',
        city: '',
        postalCode: ''
      }
    },
    items: apiOrder.menu_items.map(item => ({
      id: item.menu_item_id,
      name: item.menu_item_name,
      quantity: parseInt(item.qty) || 1,
      price: parseFloat(apiOrder.total_amount) / apiOrder.menu_items.length,
      customizations: []
    })),
    status: 'delivered' as const,
    orderType: 'dine-in' as const,
    paymentStatus: 'paid' as const,
    paymentMethod: 'card' as const,
    subtotal: parseFloat(apiOrder.total_amount),
    tax: 0,
    deliveryFee: 0,
    total: parseFloat(apiOrder.total_amount),
    estimatedTime: 30,
    orderTime: apiOrder.timestamp || new Date().toISOString(),
    notes: ''
  }));
};

/**
 * Calculate sync statistics from API response
 */
export const calculateSyncStats = (result: any) => {
  const totalSynced = result.data?.length || 0;
  const totalAmount = result.data?.reduce((total: number, order: any) => total + order.total_amount, 0) || 0;
  
  // Calculate total quantities from synced data
  const totalQuantities = result.data?.reduce((total: number, order: any) => {
    const orderQuantities = order.menu_items?.reduce((orderTotal: number, item: any) => {
      return orderTotal + (parseInt(item.qty) || 1);
    }, 0) || 0;
    return total + orderQuantities;
  }, 0) || 0;
  
  return {
    totalSynced,
    totalAmount: totalAmount.toFixed(2),
    totalQuantities
  };
};

/**
 * Generate date range for API queries (now returns last 5 minutes range for display)
 */
export const getDefaultDateRange = (daysBack: number = 10) => {
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  
  // Format for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  const startDate = formatTime(fiveMinutesAgo);
  const endDate = formatTime(now);
  
  return { startDate, endDate };
};

/**
 * Check if any filters are active
 */
export const hasActiveFilters = (filters: Record<string, any>): boolean => {
  return Object.values(filters).some(value => value !== undefined && value !== null && value !== '');
};

/**
 * Format filter display text
 */
export const formatFilterText = (key: string, value: string): string => {
  switch (key) {
    case 'orderType':
      return value.replace('-', ' ');
    default:
      return value;
  }
};

/**
 * Create sync status message
 */
export const createSyncStatusMessage = (success: boolean, totalSynced: number, totalAmount: string, totalQuantities?: number): string => {
  if (success) {
    const quantityText = totalQuantities ? `, ${totalQuantities} items` : '';
    return `Successfully synced`;
  }
  return 'Failed to sync orders. Please try again.';
};

/**
 * Calculate total quantities from orders
 */
export const calculateTotalQuantities = (orders: Order[]): number => {
  return orders.reduce((total, order) => {
    return total + order.items.reduce((orderTotal, item) => orderTotal + item.quantity, 0);
  }, 0);
};

/**
 * Get status indicator classes
 */
export const getStatusClasses = (success: boolean) => ({
  container: success 
    ? 'bg-green-50 border-green-200 text-green-800' 
    : 'bg-red-50 border-red-200 text-red-800',
  indicator: success ? 'bg-green-500' : 'bg-red-500',
  title: success ? 'Sync Successful' : 'Sync Failed'
});

/**
 * Calculate peak hours from orders data
 */
export const calculatePeakHours = (orders: Order[]): string => {
  if (!orders || orders.length === 0) return '12-2 PM';

  // Count orders by hour
  const hourCounts: Record<number, number> = {};
  
  orders.forEach(order => {
    try {
      const orderDate = new Date(order.orderTime);
      if (!isNaN(orderDate.getTime())) {
        const hour = orderDate.getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      }
    } catch (error) {
      // Skip invalid dates
    }
  });

  // Find the hour with most orders
  let peakHour = 12; // Default to 12 PM
  let maxOrders = 0;
  
  Object.entries(hourCounts).forEach(([hour, count]) => {
    if (count > maxOrders) {
      maxOrders = count;
      peakHour = parseInt(hour);
    }
  });

  // Format hour range (peak hour + next hour)
  const formatHour = (hour: number): string => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  const startHour = formatHour(peakHour);
  const endHour = formatHour(peakHour + 1);
  
  return `${startHour.split(' ')[0]}-${endHour}`;
};
