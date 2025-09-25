// External libraries
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Shared components
import {
  MetricCard,
  SmartRecommendations,
  NotificationsSection,
  ChartsSection,
} from "../components/dashboard";

// Local utilities and data
import { metricsData, createSalesMetricsData } from "../utils/homeData";
import { CSS_CLASSES } from "../utils/dashboardHelpers";
import {
  ChartBarsIcon,
  DollarIcon,
  ChartIcon,
  ClockIcon,
  PizzaIcon,
} from "../assets/icons/index";

// API hooks
import { useGetSalesMetricsQuery } from "../services/salesApi";

// Components
import { Loader } from "../components/Loader";

// Styles
import "../styles/home.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function HomePage() {
  const {
    data: salesMetrics,
    error: salesError,
    isLoading: salesLoading,
  } = useGetSalesMetricsQuery();

  // Create dynamic metrics data based on API response
  const dynamicMetricsData = createSalesMetricsData(
    salesMetrics,
    salesLoading,
    !!salesError
  );

  return (  
    <div className={CSS_CLASSES.DASHBOARD_CONTAINER}>
      <div className={CSS_CLASSES.MAIN_CONTENT}>
        {/* Header Section */}
        <div className={CSS_CLASSES.SECTION_SPACING}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <ChartBarsIcon className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className={CSS_CLASSES.TITLE_PRIMARY}>
                  Performance Overview
                </h1>
                <p className={CSS_CLASSES.SUBTITLE}>
                  AI-powered insights for smarter decisions
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100">
              {salesLoading ? (
                <Loader size="sm" />
              ) : (
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              )}
              <span className="text-sm font-medium text-indigo-700">
                {salesLoading ? "Loading..." : "Live AI Analysis"}
              </span>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div
          className={`user-guide-home-overview ${CSS_CLASSES.GRID_4_COLS} ${CSS_CLASSES.SECTION_SPACING}`}
        >
          <MetricCard
            type="revenue"
            label={dynamicMetricsData.totalSales.label}
            value={dynamicMetricsData.totalSales.value}
            trend={dynamicMetricsData.totalSales.trend}
            description={dynamicMetricsData.totalSales.description}
            icon={<DollarIcon className="text-amber-600 w-5 h-5" />}
            isLoading={salesLoading}
          />
          <MetricCard
            type="orders"
            label={dynamicMetricsData.todaysSales.label}
            value={dynamicMetricsData.todaysSales.value}
            trend={dynamicMetricsData.todaysSales.trend}
            icon={<ChartIcon className="text-green-600 w-5 h-5" />}
            isLoading={salesLoading}
          />
          <MetricCard
            type="hours"
            label={dynamicMetricsData.cogs.label}
            value={dynamicMetricsData.cogs.value}
            description={dynamicMetricsData.cogs.description}
            icon={<ClockIcon className="text-blue-600 w-5 h-5" />}
            isLoading={salesLoading}
          />
          <MetricCard
            type="categories"
            label={dynamicMetricsData.profitMargin.label}
            value={dynamicMetricsData.profitMargin.value}
            description={dynamicMetricsData.profitMargin.description}
            icon={<PizzaIcon className="text-purple-600 w-5 h-5" />}
            isLoading={salesLoading}
          />
        </div>

        {/* Smart Recommendations */}
        <div className="user-guide-home-ai-recommendations">
          <SmartRecommendations />
        </div>

        {/* Notifications & AI Forecast */}
        <div className="user-guide-home-ai-summary">
          <NotificationsSection />
        </div>

        {/* Charts & Stock Alerts */}
        <ChartsSection />
      </div>
    </div>
  );
}
