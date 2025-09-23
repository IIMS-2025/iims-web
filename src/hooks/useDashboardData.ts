import { useState, useEffect, useCallback } from 'react';
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
    OverallRating
} from '../types/dashboardData';
import { DashboardService } from '../services/dashboardService';

// Generic hook for API data fetching
function useApiData<T>(
    fetchFunction: () => Promise<T>,
    dependencies: any[] = [],
    initialData?: T
) {
    const [data, setData] = useState<T | undefined>(initialData);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchFunction();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('API Error:', err);
        } finally {
            setLoading(false);
        }
    }, dependencies);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refetch = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch };
}

// Specific hooks for different dashboard sections

// Insights hooks
export function useOrdersInsightsMetrics() {
    return useApiData<OrdersInsightsMetrics>(
        DashboardService.getOrdersInsightsMetrics
    );
}

export function useSalesVsForecastData() {
    return useApiData<SalesVsForecastData>(
        DashboardService.getSalesVsForecastData
    );
}

export function useCategoryDistribution() {
    return useApiData<CategoryDistributionData>(
        DashboardService.getCategoryDistribution
    );
}

export function useCostProfitData() {
    return useApiData<CostProfitItem[]>(
        DashboardService.getCostProfitData
    );
}

export function useInventoryForecast() {
    return useApiData<ForecastData>(
        DashboardService.getInventoryForecast
    );
}

// Home page hooks
export function useHomeMetrics() {
    return useApiData<HomeMetricsData>(
        DashboardService.getHomeMetrics
    );
}

export function useRevenueByCategory() {
    return useApiData<RevenueByCategory>(
        DashboardService.getRevenueByCategory
    );
}

export function useRevenueTrend() {
    return useApiData<RevenueTrend>(
        DashboardService.getRevenueTrend
    );
}

export function useTopOrders() {
    return useApiData<TopOrder[]>(
        DashboardService.getTopOrders
    );
}

export function useStockAlerts() {
    return useApiData<StockAlert[]>(
        DashboardService.getStockAlerts
    );
}

export function useAIForecasts() {
    return useApiData<AIForecast[]>(
        DashboardService.getAIForecasts
    );
}

export function useRecommendations() {
    return useApiData<Recommendation[]>(
        DashboardService.getRecommendations
    );
}

export function usePendingReviews() {
    return useApiData<PendingReview[]>(
        DashboardService.getPendingReviews
    );
}

export function useOverallRating() {
    return useApiData<OverallRating>(
        DashboardService.getOverallRating
    );
}

// Composite hook for all dashboard data
export function useAllDashboardData() {
    return useApiData<DashboardData>(
        DashboardService.getAllDashboardData
    );
}

// Real-time data hook with WebSocket
export function useRealtimeDashboard() {
    const [data, setData] = useState<Partial<DashboardData>>({});
    const [connected, setConnected] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const ws = DashboardService.createWebSocketConnection((newData) => {
            setData(prevData => ({ ...prevData, ...newData }));
        });

        ws.onopen = () => {
            setConnected(true);
            setError(null);
        };

        ws.onclose = () => {
            setConnected(false);
        };

        ws.onerror = () => {
            setError('WebSocket connection failed');
            setConnected(false);
        };

        return () => {
            ws.close();
        };
    }, []);

    return { data, connected, error };
}

// Hook with auto-refresh functionality
export function useDashboardWithRefresh<T>(
    fetchFunction: () => Promise<T>,
    refreshIntervalMs: number = 30000 // 30 seconds default
) {
    const { data, loading, error, refetch } = useApiData(fetchFunction);
    const [isAutoRefreshing, setIsAutoRefreshing] = useState<boolean>(true);

    useEffect(() => {
        if (!isAutoRefreshing || refreshIntervalMs <= 0) return;

        const interval = setInterval(() => {
            if (!loading) {
                refetch();
            }
        }, refreshIntervalMs);

        return () => clearInterval(interval);
    }, [loading, refetch, isAutoRefreshing, refreshIntervalMs]);

    const toggleAutoRefresh = useCallback(() => {
        setIsAutoRefreshing(prev => !prev);
    }, []);

    return {
        data,
        loading,
        error,
        refetch,
        isAutoRefreshing,
        toggleAutoRefresh
    };
}

// Combined hook for Insights page
export function useOrdersInsightsData() {
    const metrics = useOrdersInsightsMetrics();
    const salesForecast = useSalesVsForecastData();
    const categoryDistribution = useCategoryDistribution();
    const costProfit = useCostProfitData();
    const inventoryForecast = useInventoryForecast();

    const loading = metrics.loading || salesForecast.loading ||
        categoryDistribution.loading || costProfit.loading ||
        inventoryForecast.loading;

    const error = metrics.error || salesForecast.error ||
        categoryDistribution.error || costProfit.error ||
        inventoryForecast.error;

    const refetchAll = useCallback(() => {
        metrics.refetch();
        salesForecast.refetch();
        categoryDistribution.refetch();
        costProfit.refetch();
        inventoryForecast.refetch();
    }, [metrics, salesForecast, categoryDistribution, costProfit, inventoryForecast]);

    return {
        data: {
            metrics: metrics.data,
            salesForecast: salesForecast.data,
            categoryDistribution: categoryDistribution.data,
            costProfit: costProfit.data,
            inventoryForecast: inventoryForecast.data
        },
        loading,
        error,
        refetch: refetchAll
    };
}

// Combined hook for Home page
export function useHomeData() {
    const metrics = useHomeMetrics();
    const revenueByCategory = useRevenueByCategory();
    const revenueTrend = useRevenueTrend();
    const topOrders = useTopOrders();
    const stockAlerts = useStockAlerts();
    const aiForecasts = useAIForecasts();
    const recommendations = useRecommendations();
    const pendingReviews = usePendingReviews();
    const overallRating = useOverallRating();

    const loading = metrics.loading || revenueByCategory.loading ||
        revenueTrend.loading || topOrders.loading ||
        stockAlerts.loading || aiForecasts.loading ||
        recommendations.loading || pendingReviews.loading ||
        overallRating.loading;

    const error = metrics.error || revenueByCategory.error ||
        revenueTrend.error || topOrders.error ||
        stockAlerts.error || aiForecasts.error ||
        recommendations.error || pendingReviews.error ||
        overallRating.error;

    const refetchAll = useCallback(() => {
        metrics.refetch();
        revenueByCategory.refetch();
        revenueTrend.refetch();
        topOrders.refetch();
        stockAlerts.refetch();
        aiForecasts.refetch();
        recommendations.refetch();
        pendingReviews.refetch();
        overallRating.refetch();
    }, [metrics, revenueByCategory, revenueTrend, topOrders, stockAlerts,
        aiForecasts, recommendations, pendingReviews, overallRating]);

    return {
        data: {
            metrics: metrics.data,
            revenueByCategory: revenueByCategory.data,
            revenueTrend: revenueTrend.data,
            topOrders: topOrders.data,
            stockAlerts: stockAlerts.data,
            aiForecasts: aiForecasts.data,
            recommendations: recommendations.data,
            pendingReviews: pendingReviews.data,
            overallRating: overallRating.data
        },
        loading,
        error,
        refetch: refetchAll
    };
}
