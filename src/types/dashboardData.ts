// TypeScript interfaces for dashboard data structures - for easy backend integration

// Insights Page Data Types
export interface MetricCardData {
    title: string;
    value: string;
    change: string;
    changeType: 'positive' | 'negative';
    icon: string;
    iconBg: string;
}

export interface OrdersInsightsMetrics {
    totalSales: MetricCardData;
    topCategory: MetricCardData;
    wastage: MetricCardData;
}

export interface SalesVsForecastData {
    labels: string[];
    actual: number[];
    forecast: number[];
}

export interface CategoryData {
    label: string;
    percentage: number;
    color: string;
}

export interface CategoryDistributionData {
    categories: CategoryData[];
}

export interface CostProfitItem {
    label: string;
    profit: number;
    cost: number;
}

export interface ForecastIngredient {
    name: string;
    data: number[];
    color: string;
}

export interface ForecastData {
    labels: string[];
    ingredients: ForecastIngredient[];
}

// Home Page Data Types
export interface TrendData {
    icon: string;
    text: string;
    positive: boolean;
}

export interface HomeMetricCard {
    label: string;
    value: string;
    trend?: TrendData;
    description?: string;
}

export interface HomeMetricsData {
    ordersServed: HomeMetricCard;
    peakHours: HomeMetricCard;
    topCategories: HomeMetricCard;
    revenueImpact: HomeMetricCard;
}

export interface RevenueCategory {
    label: string;
    percentage: number;
    amount: number;
    color: string;
}

export interface RevenueByCategory {
    total: number;
    categories: RevenueCategory[];
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

// Combined interface for entire dashboard data
export interface DashboardData {
    // Insights data
    ordersInsights: {
        metrics: OrdersInsightsMetrics;
        salesVsForecast: SalesVsForecastData;
        categoryDistribution: CategoryDistributionData;
        costProfit: CostProfitItem[];
        forecast: ForecastData;
    };

    // Home page data
    home: {
        metrics: HomeMetricsData;
        revenueByCategory: RevenueByCategory;
        revenueTrend: RevenueTrend;
        topOrders: TopOrder[];
        stockAlerts: StockAlert[];
        aiForecasts: AIForecast[];
        recommendations: Recommendation[];
        pendingReviews: PendingReview[];
        overallRating: OverallRating;
    };
}

// Example API response types
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    timestamp: string;
}

export interface DashboardApiResponse extends ApiResponse<DashboardData> { }

// Helper type for API endpoints
export type DashboardEndpoints = {
    '/api/dashboard/insights': OrdersInsightsMetrics;
    '/api/dashboard/sales-forecast': SalesVsForecastData;
    '/api/dashboard/category-distribution': CategoryDistributionData;
    '/api/dashboard/cost-profit': CostProfitItem[];
    '/api/dashboard/inventory-forecast': ForecastData;
    '/api/dashboard/home-metrics': HomeMetricsData;
    '/api/dashboard/revenue-category': RevenueByCategory;
    '/api/dashboard/revenue-trend': RevenueTrend;
    '/api/dashboard/top-orders': TopOrder[];
    '/api/dashboard/stock-alerts': StockAlert[];
    '/api/dashboard/ai-forecasts': AIForecast[];
    '/api/dashboard/recommendations': Recommendation[];
    '/api/dashboard/reviews': PendingReview[];
    '/api/dashboard/rating': OverallRating;
};
