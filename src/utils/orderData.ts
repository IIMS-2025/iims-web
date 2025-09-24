// Order-related types and interfaces
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  customizations?: string[];
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  orderType: 'dine-in' | 'takeaway' | 'delivery';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: 'cash' | 'card' | 'online';
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  estimatedTime: number; // minutes
  orderTime: string;
  notes?: string;
  tableNumber?: number;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  revenue: number;
  averageOrderValue: number;
}

// Mock order data for demonstration
export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customer: {
      id: 'cust1',
      name: 'John Doe',
      phone: '+1-555-0123',
      email: 'john.doe@email.com',
      address: {
        street: '123 Main St',
        city: 'New York',
        postalCode: '10001'
      }
    },
    items: [
      {
        id: 'item1',
        name: 'Margherita Pizza',
        quantity: 2,
        price: 18.99,
        customizations: ['Extra cheese', 'Thin crust']
      },
      {
        id: 'item2',
        name: 'Caesar Salad',
        quantity: 1,
        price: 12.99
      }
    ],
    status: 'preparing',
    orderType: 'delivery',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    subtotal: 50.97,
    tax: 4.58,
    deliveryFee: 3.99,
    total: 59.54,
    estimatedTime: 25,
    orderTime: '2024-01-15T14:30:00Z',
    notes: 'Please ring the doorbell'
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customer: {
      id: 'cust2',
      name: 'Sarah Johnson',
      phone: '+1-555-0456'
    },
    items: [
      {
        id: 'item3',
        name: 'Pepperoni Pizza',
        quantity: 1,
        price: 21.99
      },
      {
        id: 'item4',
        name: 'Garlic Bread',
        quantity: 2,
        price: 6.99
      }
    ],
    status: 'ready',
    orderType: 'takeaway',
    paymentStatus: 'pending',
    paymentMethod: 'cash',
    subtotal: 35.97,
    tax: 3.24,
    deliveryFee: 0,
    total: 39.21,
    estimatedTime: 5,
    orderTime: '2024-01-15T15:15:00Z',
    tableNumber: 12
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customer: {
      id: 'cust3',
      name: 'Mike Chen',
      phone: '+1-555-0789'
    },
    items: [
      {
        id: 'item5',
        name: 'Pasta Carbonara',
        quantity: 1,
        price: 16.99
      },
      {
        id: 'item6',
        name: 'Tiramisu',
        quantity: 1,
        price: 7.99
      }
    ],
    status: 'confirmed',
    orderType: 'dine-in',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    subtotal: 24.98,
    tax: 2.25,
    deliveryFee: 0,
    total: 27.23,
    estimatedTime: 20,
    orderTime: '2024-01-15T15:45:00Z',
    tableNumber: 8
  }
];

// Helper functions
export const getOrderStatusColor = (status: Order['status']): string => {
  switch (status) {
    case 'pending':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'confirmed':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'preparing':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'ready':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'delivered':
      return 'text-gray-600 bg-gray-50 border-gray-200';
    case 'cancelled':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const getPaymentStatusColor = (status: Order['paymentStatus']): string => {
  switch (status) {
    case 'paid':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'pending':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'failed':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const getOrderTypeIcon = (type: Order['orderType']): string => {
  switch (type) {
    case 'dine-in':
      return '🍽️';
    case 'takeaway':
      return '🥡';
    case 'delivery':
      return '🚚';
    default:
      return '📋';
  }
};

export const formatOrderTime = (orderTime: string): string => {
  const date = new Date(orderTime);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

export const calculateOrderStats = (orders: Order[]): OrderStats => {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => 
    ['pending', 'confirmed', 'preparing'].includes(order.status)
  ).length;
  const completedOrders = orders.filter(order => 
    order.status === 'delivered'
  ).length;
  const revenue = orders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = totalOrders > 0 ? revenue / totalOrders : 0;

  return {
    totalOrders,
    pendingOrders,
    completedOrders,
    revenue,
    averageOrderValue
  };
};

export const filterOrdersByStatus = (orders: Order[], status?: Order['status']): Order[] => {
  if (!status) return orders;
  return orders.filter(order => order.status === status);
};

export const filterOrdersByType = (orders: Order[], type?: Order['orderType']): Order[] => {
  if (!type) return orders;
  return orders.filter(order => order.orderType === type);
};

export const sortOrdersByTime = (orders: Order[], direction: 'asc' | 'desc' = 'desc'): Order[] => {
  return [...orders].sort((a, b) => {
    const timeA = new Date(a.orderTime).getTime();
    const timeB = new Date(b.orderTime).getTime();
    return direction === 'desc' ? timeB - timeA : timeA - timeB;
  });
};
