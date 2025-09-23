import axios from 'axios';
import appConfig from '../config/appConfig';
import type {
    DashboardData,
    OrdersInsightsMetrics,
    SalesVsForecastData,
    CategoryDistributionData,
    CostProfitItem,
    ForecastData,
    HomeMetricsData,
    RevenueByCategory,
    RevenueTrend,
    TopOrder,
    StockAlert,
    AIForecast,
    Recommendation,
    PendingReview,
    OverallRating,
    ApiResponse
} from '../types/dashboardData';

const API_BASE_URL = appConfig.api.baseUrl;

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for auth tokens if needed
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

// Individual API service functions
export class DashboardService {
    // Orders & Insights APIs
    static async getOrdersInsightsMetrics(): Promise<OrdersInsightsMetrics> {
        const response = await api.get<ApiResponse<OrdersInsightsMetrics>>('/api/dashboard/insights');
        return response.data.data;
    }

    static async getSalesVsForecastData(): Promise<SalesVsForecastData> {
        const response = await api.get<ApiResponse<SalesVsForecastData>>('/api/dashboard/sales-forecast');
        return response.data.data;
    }

    static async getCategoryDistribution(): Promise<CategoryDistributionData> {
        const response = await api.get<ApiResponse<CategoryDistributionData>>('/api/dashboard/category-distribution');
        return response.data.data;
    }

    static async getCostProfitData(): Promise<CostProfitItem[]> {
        const response = await api.get<ApiResponse<CostProfitItem[]>>('/api/dashboard/cost-profit');
        return response.data.data;
    }

    static async getInventoryForecast(): Promise<ForecastData> {
        const response = await api.get<ApiResponse<ForecastData>>('/api/dashboard/inventory-forecast');
        return response.data.data;
    }

    // Home Page APIs
    static async getHomeMetrics(): Promise<HomeMetricsData> {
        const response = await api.get<ApiResponse<HomeMetricsData>>('/api/dashboard/home-metrics');
        return response.data.data;
    }

    static async getRevenueByCategory(): Promise<RevenueByCategory> {
        const response = await api.get<ApiResponse<RevenueByCategory>>('/api/dashboard/revenue-category');
        return response.data.data;
    }

    static async getRevenueTrend(): Promise<RevenueTrend> {
        const response = await api.get<ApiResponse<RevenueTrend>>('/api/dashboard/revenue-trend');
        return response.data.data;
    }

    static async getTopOrders(): Promise<TopOrder[]> {
        const response = await api.get<ApiResponse<TopOrder[]>>('/api/dashboard/top-orders');
        return response.data.data;
    }

    static async getStockAlerts(): Promise<StockAlert[]> {
        const response = await api.get<ApiResponse<StockAlert[]>>('/api/dashboard/stock-alerts');
        return response.data.data;
    }

    static async getAIForecasts(): Promise<AIForecast[]> {
        const response = await api.get<ApiResponse<AIForecast[]>>('/api/dashboard/ai-forecasts');
        return response.data.data;
    }

    static async getRecommendations(): Promise<Recommendation[]> {
        const response = await api.get<ApiResponse<Recommendation[]>>('/api/dashboard/recommendations');
        return response.data.data;
    }

    static async getPendingReviews(): Promise<PendingReview[]> {
        const response = await api.get<ApiResponse<PendingReview[]>>('/api/dashboard/reviews');
        return response.data.data;
    }

    static async getOverallRating(): Promise<OverallRating> {
        const response = await api.get<ApiResponse<OverallRating>>('/api/dashboard/rating');
        return response.data.data;
    }

    // Composite API to get all dashboard data at once
    static async getAllDashboardData(): Promise<DashboardData> {
        const response = await api.get<ApiResponse<DashboardData>>('/api/dashboard/all');
        return response.data.data;
    }

    // Real-time data with WebSocket (optional)
    static createWebSocketConnection(onMessage: (data: Partial<DashboardData>) => void) {
        const wsUrl = API_BASE_URL.replace('http', 'ws') + '/ws/dashboard';
        const ws = new WebSocket(wsUrl);

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onMessage(data);
            } catch (error) {
                console.error('WebSocket message parsing error:', error);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return ws;
    }
}

// Hook-style functions for React components (to be used with React Query or SWR)
export const dashboardQueries = {
    ordersInsights: () => ({
        queryKey: ['dashboard', 'orders-insights'],
        queryFn: DashboardService.getOrdersInsightsMetrics,
        staleTime: 5 * 60 * 1000, // 5 minutes
    }),

    salesForecast: () => ({
        queryKey: ['dashboard', 'sales-forecast'],
        queryFn: DashboardService.getSalesVsForecastData,
        staleTime: 5 * 60 * 1000,
    }),

    categoryDistribution: () => ({
        queryKey: ['dashboard', 'category-distribution'],
        queryFn: DashboardService.getCategoryDistribution,
        staleTime: 10 * 60 * 1000, // 10 minutes
    }),

    homeMetrics: () => ({
        queryKey: ['dashboard', 'home-metrics'],
        queryFn: DashboardService.getHomeMetrics,
        staleTime: 2 * 60 * 1000, // 2 minutes
    }),

    revenueTrend: () => ({
        queryKey: ['dashboard', 'revenue-trend'],
        queryFn: DashboardService.getRevenueTrend,
        staleTime: 5 * 60 * 1000,
    }),

    // Add more queries as needed...
};

export default DashboardService;
