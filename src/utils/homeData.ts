export interface MetricTrend {
  icon: string;
  text: string;
  positive: boolean;
}

export interface MetricData {
  label: string;
  value: string;
  trend?: MetricTrend;
  description?: string;
}

export interface MetricsData {
  ordersServed: MetricData;
  peakHours: MetricData;
  topCategories: MetricData;
  revenueImpact: MetricData;
}

export interface CategoryData {
  label: string;
  percentage: number;
  amount: number;
  color: string;
}

export interface RevenueByCategory {
  total: number;
  categories: CategoryData[];
}

export interface RevenueTrend {
  labels: string[];
  data: number[];
}

export interface TopOrder {
  name: string;
  value: number;
  colorClass: string;
}

export interface StockAlert {
  title: string;
  description: string;
  severity: 'critical' | 'warning';
}

export interface AIForecast {
  type: 'purple' | 'green' | 'orange';
  text: string;
}

export interface Recommendation {
  title: string;
  text: string;
}

export interface PendingReview {
  name: string;
  text: string;
  time: string;
  type: 'critical' | 'warning' | 'positive';
}

export interface OverallRating {
  percentage: number;
  change: string;
}

// Data constants - fallback values when API is not available
export const metricsData: MetricsData = {
  ordersServed: {
    label: "ORDERS SERVED",
    value: "127",
    trend: {
      icon: "↗",
      text: "+15% vs yesterday",
      positive: true
    }
  },
  peakHours: {
    label: "PEAK HOURS",
    value: "12-2PM | 7-9PM",
    description: "85% of daily orders"
  },
  topCategories: {
    label: "TOP CATEGORIES",
    value: "Pizza & Pasta",
    description: "56% of total revenue"
  },
  revenueImpact: {
    label: "REVENUE IMPACT",
    value: "₹2,847",
    trend: {
      icon: "↗",
      text: "+12.5% growth",
      positive: true
    }
  }
};

// Sales metrics data structure (used when API is available)
export interface SalesMetricsData {
  totalSales: MetricData;
  todaysSales: MetricData;
  cogs: MetricData;
  profitMargin: MetricData;
}

// Currency formatting utility
export const formatCurrency = (amount: number, currency: string = "INR"): string => {
  if (currency === "INR") {
    return `₹${amount.toFixed(2)}`;
  }
  return `$${amount.toFixed(2)}`;
};

// Helper function to create sales metrics from API data
export const createSalesMetricsData = (
  salesMetrics: any,
  isLoading: boolean,
  hasError: boolean
): SalesMetricsData => {
  const loading = "...";  // Placeholder for loader component
  const error = "Error";
  
  return {
    totalSales: {
      label: "TOTAL SALES (7 DAYS)",
      value: isLoading ? loading : hasError ? error : formatCurrency(salesMetrics?.totalSales || 0),
    },
    todaysSales: {
      label: "TODAY'S SALES",
      value: isLoading ? loading : hasError ? error : formatCurrency(salesMetrics?.todaySales || 0),
      trend: {
        icon: "📈",
        text: "Live tracking",
        positive: true
      }
    },
    cogs: {
      label: "COST OF GOODS SOLD",
      value: isLoading ? loading : hasError ? error : formatCurrency(salesMetrics?.cogs || 0),
      description: "7-day period"
    },
    profitMargin: {
      label: "GROSS PROFIT MARGIN",
      value: isLoading ? loading : hasError ? error : `${salesMetrics?.profitMargin?.toFixed(1) || "0.0"}%`,
      description: `Profit: ${formatCurrency(salesMetrics?.grossProfit || 0)}`
    }
  };
};

export const revenueByCategory: RevenueByCategory = {
  total: 7000,
  categories: [
    { label: 'Pizza', percentage: 40, amount: 2800, color: '#5F63F2' },
    { label: 'Burgers', percentage: 31, amount: 2200, color: '#10B981' },
    { label: 'Drinks', percentage: 17, amount: 1200, color: '#F59E0B' },
    { label: 'Salads', percentage: 11, amount: 800, color: '#EF4444' }
  ]
};

export const revenueTrend: RevenueTrend = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  data: [2400, 2800, 2200, 3200, 3600, 4200, 3800]
};

export const topOrdersToday: TopOrder[] = [
  { name: 'Margherita Pizza', value: 312, colorClass: 'red' },
  { name: 'Pasta Carbonara', value: 234, colorClass: 'yellow' },
  { name: 'Caesar Salad', value: 180, colorClass: 'green' }
];

export const stockAlerts: StockAlert[] = [
  {
    title: 'Mozzarella Cheese',
    description: 'Only 2.5kg remaining',
    severity: 'critical' as const
  },
  {
    title: 'Tomato Sauce',
    description: '5.2L remaining',
    severity: 'warning' as const
  },
  {
    title: 'Fresh Basil',
    description: '0.8kg remaining',
    severity: 'warning' as const
  }
];

export const aiForecasts: AIForecast[] = [
  {
    type: 'purple' as const,
    text: 'Weekend Rush Prediction: Expect 40% increase in orders this Saturday. Recommend stocking extra pizza ingredients.'
  },
  {
    type: 'green' as const,
    text: 'Trending Item: Pasta Carbonara orders increased 25% this week. Consider featuring it as today\'s special.'
  },
  {
    type: 'orange' as const,
    text: 'Waste Reduction: Lettuce usage down 15%. Promote salads to reduce potential waste.'
  }
];

export const recommendations: Recommendation[] = [
  {
    title: 'Inventory Alert',
    text: 'Increase pasta inventory by 30% for tomorrow\'s lunch rush based on current demand trends.'
  },
  {
    title: 'Revenue Opportunity',
    text: 'Pizza sales peak at 7PM. Consider promoting premium toppings during this window.'
  }
];

export const pendingReviews: PendingReview[] = [
  {
    name: 'Sarah Johnson',
    text: '"Pizza was cold when delivered..."',
    time: '2 hours ago',
    type: 'critical' as const
  },
  {
    name: 'Mike Chen',
    text: '"Good food but slow service..."',
    time: '5 hours ago',
    type: 'warning' as const
  },
  {
    name: 'Emma Davis',
    text: '"Great pasta! Would love more..."',
    time: '1 day ago',
    type: 'positive' as const
  }
];

export const overallRating: OverallRating = {
  percentage: 92,
  change: '+5% this week'
};
