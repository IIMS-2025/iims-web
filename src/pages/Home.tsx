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
  Filler
} from 'chart.js';

// Shared components
import { 
  MetricCard, 
  SmartRecommendations, 
  NotificationsSection, 
  ChartsSection 
} from '../components/dashboard';

// Local utilities and data
import { metricsData } from '../utils/homeData';
import { CSS_CLASSES } from '../utils/dashboardHelpers';
import { 
  ChartBarsIcon,
  DollarIcon,
  ChartIcon,
  ClockIcon,
  PizzaIcon
} from '../assets/icons/index';

// Styles
import '../styles/home.css';

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
                <h1 className={CSS_CLASSES.TITLE_PRIMARY}>Today's Performance Overview</h1>
                <p className={CSS_CLASSES.SUBTITLE}>AI-powered insights for smarter decisions</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-indigo-700">Live AI Analysis</span>
                  </div>
                </div>
              </div>

        {/* Metrics Cards */}
        <div className={`${CSS_CLASSES.GRID_4_COLS} ${CSS_CLASSES.SECTION_SPACING}`}>
          <MetricCard
            type="revenue"
            label={metricsData.revenueImpact.label}
            value={metricsData.revenueImpact.value}
            trend={metricsData.revenueImpact.trend}
            icon={<DollarIcon className="text-amber-600 w-5 h-5" />}
          />
          <MetricCard
            type="orders"
            label={metricsData.ordersServed.label}
            value={metricsData.ordersServed.value}
            trend={metricsData.ordersServed.trend}
            icon={<ChartIcon className="text-green-600 w-5 h-5" />}
          />
          <MetricCard
            type="hours"
            label={metricsData.peakHours.label}
            value={metricsData.peakHours.value}
            description={metricsData.peakHours.description}
            icon={<ClockIcon className="text-blue-600 w-5 h-5" />}
          />
          <MetricCard
            type="categories"
            label={metricsData.topCategories.label}
            value={metricsData.topCategories.value}
            description={metricsData.topCategories.description}
            icon={<PizzaIcon className="text-purple-600 w-5 h-5" />}
                    />
                  </div>

        {/* Smart Recommendations */}
        <SmartRecommendations />

        {/* Notifications & AI Forecast */}
        <NotificationsSection />

        {/* Charts & Stock Alerts */}
        <ChartsSection />
              </div>
            </div>
  );
}


