import React, { useMemo } from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  useGetSalesDataQuery,
  useGetWastageDataQuery,
  useGetsalesByRangeQuery,
  useGetSalesCostDataGraphQuery,
  useGetSalesByCategoryQuery,
  useGetSalesCostDataAnomalyGraphQuery,
  useGetSalesCostForecastQuery,
} from "../../services/inventoryInsightsApi";
import appConfig from "../../config/appConfig";
import {
  getMetricCardClasses,
  getIconContainerClasses,
  getTrendTextClasses,
  getLabelTextClasses,
  CSS_CLASSES,
} from "../../utils/dashboardHelpers";
import {
  DollarIcon,
  ChartIcon,
  ClockIcon,
  AIIcon,
} from "../../assets/icons/index";

// ===== TYPES =====
interface MetricData {
  type: "revenue" | "orders" | "hours" | "categories";
  label: string;
  value: string;
  description?: string;
  trend?: {
    text: string;
    positive: boolean;
  };
  icon: React.ReactNode;
  isLoading?: boolean;
}

interface ChartDataPoint {
  label: string;
  profit?: number;
  cost?: number;
  percentage?: number;
  color?: string;
}

// ===== CONSTANTS =====
const CHART_COLORS = {
  primary: "#5F63F2",
  primaryBg: "rgba(95, 99, 242, 0.1)",
  secondary: "#E5E7EB",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  purple: "#7C3AED",
  purpleBg: "rgba(124, 58, 237, 0.1)",
  blue: "#3B82F6",
} as const;

const CATEGORIES_DATA = [
  { label: "Pizza", percentage: 32, color: CHART_COLORS.primary },
  { label: "Pasta", percentage: 24, color: CHART_COLORS.success },
  { label: "Salads", percentage: 18, color: CHART_COLORS.warning },
  { label: "Drinks", percentage: 15, color: CHART_COLORS.danger },
  { label: "Desserts", percentage: 11, color: CHART_COLORS.blue },
] as const;

const ANOMALY_DATA = {
  labels: [
    "1. Jan",
    "2. Jan",
    "3. Jan",
    "4. Jan",
    "5. Jan",
    "6. Jan",
    "7. Jan",
    "8. Jan",
    "9. Jan",
    "10. Jan",
    "11. Jan",
    "12. Jan",
    "13. Jan",
    "14. Jan",
  ],
  revenue: [
    8200, 8500, 7800, 9200, 8800, 8300, 9500, 7200, 8600, 8900, 8100, 10800,
    8400, 7600,
  ],
  anomalies: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    7200,
    null,
    null,
    null,
    10800,
    null,
    null,
  ] as (number | null)[],
};

// ===== UTILITY FUNCTIONS =====
const formatCurrency = (value: number): string => {
  const symbol = appConfig.tenant.currency === "INR" ? "₹" : "$";
  return `${symbol}${value.toLocaleString()}`;
};

const formatDate = (dateString: string): string => {
  // Handle both ISO format (2025-09-18T00:00:00) and simple format (2025-09-18)
  // Extract just the date part to avoid timezone issues
  const datePart = dateString.includes("T")
    ? dateString.split("T")[0]
    : dateString;
  const date = new Date(datePart + "T00:00:00"); // Force local timezone
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const generateFutureDates = (lastDate: Date, count: number): string[] => {
  return Array.from({ length: count }, (_, i) => {
    const futureDate = new Date(lastDate);
    futureDate.setDate(lastDate.getDate() + i + 1);
    // Convert to YYYY-MM-DD format to match backend
    const year = futureDate.getFullYear();
    const month = String(futureDate.getMonth() + 1).padStart(2, "0");
    const day = String(futureDate.getDate()).padStart(2, "0");
    return formatDate(`${year}-${month}-${day}`);
  });
};

// ===== CHART CONFIGURATION =====
/**
 * Base chart styling configuration
 */
const CHART_BASE_CONFIG = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: "index" as const,
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#FFFFFF",
      titleColor: "#111827",
      bodyColor: "#6B7280",
      borderColor: "#E5E7EB",
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#6B7280", font: { size: 11 } },
    },
    y: {
      ticks: { color: "#6B7280", font: { size: 11 } },
      grid: { color: "#E5E7EB", lineWidth: 1 },
    },
  },
  layout: {
    padding: { top: 5, right: 5, bottom: 5, left: 5 },
  },
} as const;

/**
 * Create chart options with deep merge support
 */
const createChartOptions = (customConfig?: any) => {
  return {
    ...CHART_BASE_CONFIG,
    scales: {
      ...CHART_BASE_CONFIG.scales,
      ...customConfig?.scales,
    },
    plugins: {
      ...CHART_BASE_CONFIG.plugins,
      tooltip: {
        ...CHART_BASE_CONFIG.plugins.tooltip,
        ...customConfig?.tooltip,
      },
    },
    layout: {
      ...CHART_BASE_CONFIG.layout,
      ...customConfig?.layout,
    },
  };
};

/**
 * Specialized chart configurations
 */
const CHART_CONFIGS = {
  doughnut: {
    ...CHART_BASE_CONFIG,
    cutout: "50%",
    scales: {}, // Remove scales for doughnut charts
  },
  currency: (customConfig?: any) =>
    createChartOptions({
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`,
        },
      },
      ...customConfig,
    }),
  percentage: (customConfig?: any) =>
    createChartOptions({
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `${context.label}: ${context.parsed.toFixed(1)}%`,
        },
      },
      ...customConfig,
    }),
} as const;

// ===== REUSABLE COMPONENTS =====
const ChartContainer = ({
  title,
  children,
  actions,
  height = "h-80",
}: {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  height?: string;
}) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {actions}
    </div>
    <div className={height}>{children}</div>
  </div>
);

const TrendIcon = ({ type }: { type: "positive" | "negative" | "neutral" }) => {
  const paths = {
    positive: "M4.5 1L8 6H1L4.5 1Z",
    negative: "M4.5 13L8 8H1L4.5 13Z",
    neutral: "M1 7h6",
  };
  const colors = {
    positive: CHART_COLORS.success,
    negative: CHART_COLORS.danger,
    neutral: "#6B7280",
  };

  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
      <path d={paths[type]} fill={colors[type]} />
    </svg>
  );
};

const SimpleIcon = ({ color = CHART_COLORS.success }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect width="20" height="20" fill={color} />
  </svg>
);

const MetricCard: React.FC<MetricData> = ({
  type,
  label,
  value,
  description,
  trend,
  icon,
  isLoading = false,
}) => {
  return (
    <div className={getMetricCardClasses(type)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className={getLabelTextClasses(type)}>{label}</p>
          <h3
            className={
              type === "hours" || type === "categories"
                ? CSS_CLASSES.METRIC_VALUE_SMALL
                : CSS_CLASSES.METRIC_VALUE
            }
          >
            {isLoading && value === "..." ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                <span className="text-gray-400">Loading...</span>
              </div>
            ) : (
              value
            )}
          </h3>
        </div>
        <div className={getIconContainerClasses(type)}>{icon}</div>
      </div>
      {trend && !isLoading && (
        <div className={getTrendTextClasses(type)}>
          <TrendIcon type={trend.positive ? "positive" : "negative"} />
          <span>{trend.text}</span>
        </div>
      )}
      {description && !isLoading && (
        <p
          className={getTrendTextClasses(type).replace(
            "flex items-center gap-1",
            ""
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
};

const InsightCard = ({
  title,
  description,
  bgColor,
  borderColor,
  titleColor,
  textColor,
  iconColor,
}: any) => (
  <div
    className="rounded-lg p-3.5 border"
    style={{ background: bgColor, borderColor }}
  >
    <div className="flex items-start gap-3">
      <div
        className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5"
        style={{ background: iconColor }}
      />
      <div>
        <h4 className="text-sm font-medium mb-1" style={{ color: titleColor }}>
          {title}
        </h4>
        <p className="text-xs leading-relaxed m-0" style={{ color: textColor }}>
          {description}
        </p>
      </div>
    </div>
  </div>
);

const Legend = ({
  items,
}: {
  items: Array<{ color: string; label: string }>;
}) => (
  <div className="flex justify-center gap-5 mt-4 flex-shrink-0">
    {items.map(({ color, label }) => (
      <div key={label} className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-sm"
          style={{ backgroundColor: color }}
        />
        <span className="text-xs text-gray-900">{label}</span>
      </div>
    ))}
  </div>
);

// ===== SKELETON COMPONENTS =====
const SkeletonMetricCard = () => (
  <div className="bg-white rounded-xl p-5 pb-4 shadow-sm border border-gray-100 h-[180px] animate-pulse">
    <div className="flex justify-between items-start mb-3.5">
      <div className="w-9 h-9 rounded-lg bg-gray-200"></div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 bg-gray-200 rounded"></div>
        <div className="w-8 h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
      <div className="w-1/2 h-8 bg-gray-200 rounded"></div>
      <div className="w-full h-3 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const SkeletonChart = ({ height = "h-80" }: { height?: string }) => (
  <div className={`bg-gray-200 rounded-lg animate-pulse ${height}`}></div>
);

const SkeletonChartContainer = ({
  title,
  height = "h-80",
}: {
  title: string;
  height?: string;
}) => (
  <div className="user-guide-revenue-insights-forecast-graph bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    <SkeletonChart height={height} />
  </div>
);

const SkeletonInsightCard = () => (
  <div className="rounded-lg p-3.5 border border-gray-200 bg-gray-50 animate-pulse">
    <div className="flex items-start gap-3">
      <div className="w-4 h-4 rounded-full bg-gray-200 flex-shrink-0 mt-0.5"></div>
      <div className="flex-1 space-y-2">
        <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
        <div className="w-full h-3 bg-gray-200 rounded"></div>
        <div className="w-5/6 h-3 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

// ===== DATA PROCESSING UTILITIES =====
/**
 * Generic hook for processing sales/cost data with fallback
 */
const useProcessedSalesCostData = (
  data: any,
  processor: (data: any[]) => any,
  fallback: any
) => {
  return useMemo(() => {
    if (!data?.data?.length) return fallback;
    return processor(data.data);
  }, [data, processor, fallback]);
};

/**
 * Process sales data for charts
 */
const processSalesData = (data: any[], forecastData?: any[]) => {
  // Process historical data
  const historicalLabels = data.map((item: any) => formatDate(item.date));
  const actualSales = data.map((item: any) => item.sales);

  // Generate future dates
  const lastDate = new Date(data[data.length - 1].date);
  const futureLabels = generateFutureDates(lastDate, 2);

  // Combine labels and data
  const allLabels = [...historicalLabels, ...futureLabels];
  const actual = [...actualSales, ...Array(2).fill(null)];

  let forecast: number[];

  if (forecastData && forecastData.length > 0) {
    // Use real forecast data from API - create date-based mapping for accurate alignment
    const forecastMap = new Map();
    forecastData.forEach((item: any) => {
      // Normalize date to avoid timezone issues
      const datePart = item.date.includes("T")
        ? item.date.split("T")[0]
        : item.date;
      const normalizedDate = new Date(datePart + "T00:00:00");
      const dateKey = normalizedDate.toDateString();
      forecastMap.set(dateKey, parseFloat(item.sales));
    });

    // Map historical forecast data to match exact dates
    const historicalForecast = data.map((item: any) => {
      const datePart = item.date.includes("T")
        ? item.date.split("T")[0]
        : item.date;
      const normalizedDate = new Date(datePart + "T00:00:00");
      const dateKey = normalizedDate.toDateString();
      return forecastMap.get(dateKey) || item.sales * 1.05; // Fallback to calculated forecast
    });

    // Generate future forecast for next 2 days
    const lastDataDate = data[data.length - 1].date;
    const lastDatePart = lastDataDate.includes("T")
      ? lastDataDate.split("T")[0]
      : lastDataDate;
    const lastDate = new Date(lastDatePart + "T00:00:00");

    const futureForecast = [];
    for (let i = 1; i <= 2; i++) {
      const futureDate = new Date(lastDate);
      futureDate.setDate(lastDate.getDate() + i);
      const dateKey = futureDate.toDateString();
      const forecastValue = forecastMap.get(dateKey);

      if (forecastValue) {
        futureForecast.push(forecastValue);
      } else {
        // Fallback calculation for missing future data
        const avgSales =
          actualSales.reduce((sum: number, val: number) => sum + val, 0) /
          actualSales.length;
        futureForecast.push(avgSales * (1.1 + i * 0.05));
      }
    }

    forecast = [...historicalForecast, ...futureForecast];
  } else {
    // Fallback to dummy forecast generation
    const historicalForecast = actualSales.map((val: number) => val * 1.05);
    const avgSales =
      actualSales.reduce((sum: number, val: number) => sum + val, 0) /
      actualSales.length;
    const futureForecast = [avgSales * 1.1, avgSales * 1.15];
    forecast = [...historicalForecast, ...futureForecast];
  }

  return { labels: allLabels, actual, forecast };
};

/**
 * Process cost data for bar charts
 */
const processCostData = (data: any[]) => {
  return data.map((item: any) => ({
    label: formatDate(item.date),
    profit: parseFloat(item.sales.toString()) / 1000, // Total sales in thousands
    cost: parseFloat(item.cost.toString()) / 1000, // Total cost in thousands
  }));
};

// ===== CUSTOM HOOKS =====
const useProcessedSalesData = (salesCostData: any, forecastData?: any) => {
  return useMemo(() => {
    if (!salesCostData?.data?.length) {
      return {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        actual: [],
        forecast: [],
      };
    }
    return processSalesData(salesCostData.data, forecastData?.data);
  }, [salesCostData, forecastData]);
};

const useProcessedCostData = (salesCostData: any) => {
  return useProcessedSalesCostData(salesCostData, processCostData, [
    { label: "No Data", profit: 0, cost: 0 },
  ]);
};

/**
 * Extract categories from various API response structures
 */
const extractCategoriesFromResponse = (categoryData: any): any[] => {
  if (!categoryData) return [];

  // Try to extract categories from different possible response structures
  if (
    categoryData?.data?.length &&
    categoryData.data[0]?.daily_breakdowns?.length
  ) {
    return categoryData.data[0].daily_breakdowns[0].categories;
  } else if (categoryData?.data?.length && categoryData.data[0]?.categories) {
    return categoryData.data[0].categories;
  } else if (categoryData?.categories) {
    return categoryData.categories;
  } else if (Array.isArray(categoryData?.data)) {
    return categoryData.data;
  } else if (Array.isArray(categoryData)) {
    return categoryData;
  }
  return [];
};

/**
 * Process category data for pie charts
 */
const processCategoryData = (categoryData: any) => {
  const categories = extractCategoriesFromResponse(categoryData);

  if (!categories || categories.length === 0) {
    return CATEGORIES_DATA.map((cat) => ({
      label: cat.label,
      percentage: cat.percentage,
      color: cat.color,
    }));
  }

  // Sort categories by revenue and take top 5 (create a copy first to avoid mutating read-only array)
  const sortedCategories = [...categories]
    .sort((a: any, b: any) => {
      const revenueA = parseFloat(a.total_revenue || a.revenue || 0);
      const revenueB = parseFloat(b.total_revenue || b.revenue || 0);
      return revenueB - revenueA;
    })
    .slice(0, 5);

  // Assign colors to categories
  const colors = [
    CHART_COLORS.primary,
    CHART_COLORS.success,
    CHART_COLORS.warning,
    CHART_COLORS.danger,
    CHART_COLORS.blue,
  ];

  return sortedCategories.map((cat: any, index: number) => ({
    label: cat.category || cat.name || `Category ${index + 1}`,
    percentage: parseFloat(
      cat.percentage_of_total || cat.percentage || 20 - index * 2
    ), // Fallback percentages
    color: colors[index] || CHART_COLORS.primary,
  }));
};

/**
 * Process anomaly data with detection algorithm
 */
const processAnomalyData = (data: any[]) => {
  // Process real sales data for anomaly detection
  const salesValues = data.map((item: any) => parseFloat(item.sales || 0));
  const labels = data.map((item: any) => formatDate(item.date));

  // Simple anomaly detection: values that are significantly below/above average
  const average =
    salesValues.reduce((sum: number, val: number) => sum + val, 0) /
    salesValues.length;
  const threshold = average * 0.3; // 30% deviation threshold

  const anomalies = salesValues.map((value: number) => {
    const deviation = Math.abs(value - average);
    return deviation > threshold ? value : null;
  });

  return { labels, revenue: salesValues, anomalies };
};

const useProcessedCategoryData = (categoryData: any) => {
  return useMemo(() => processCategoryData(categoryData), [categoryData]);
};

const useProcessedAnomalyData = (anomalyData: any) => {
  return useProcessedSalesCostData(anomalyData, processAnomalyData, {
    labels: ANOMALY_DATA.labels,
    revenue: ANOMALY_DATA.revenue,
    anomalies: ANOMALY_DATA.anomalies,
  });
};

const useMetricsData = (
  salesData: any,
  wastageData: any,
  salesByRangeData: any,
  isLoading: boolean = false
): MetricData[] => {
  const todaysSales = useMemo(() => {
    if (!salesData?.length) return "₹0";
    return formatCurrency(salesData[0].total_sales);
  }, [salesData]);

  const wastageCost = useMemo(() => {
    if (!wastageData) return "₹0";
    return formatCurrency(wastageData.total_cost_loss);
  }, [wastageData]);

  const weeklyRevenue = useMemo(() => {
    if (!salesByRangeData?.length) return "₹0";
    return formatCurrency(salesByRangeData[0].total_sales);
  }, [salesByRangeData]);

  return [
    {
      type: "orders",
      label: "Today's Sales",
      value: todaysSales,
      trend: { text: "Live tracking", positive: true },
      icon: <ChartIcon className="text-green-600 w-5 h-5" />,
      isLoading,
    },
    {
      type: "revenue",
      label: "Waste on Sales",
      value: wastageCost,
      description: "Today's Estimate",
      icon: <DollarIcon className="text-amber-600 w-5 h-5" />,
      isLoading,
    },
    {
      type: "categories",
      label: "Weekly Revenue",
      value: weeklyRevenue,
      description: "Last 7 days",
      icon: <ClockIcon className="text-purple-600 w-5 h-5" />,
      isLoading,
    },
    {
      type: "hours",
      label: "AI Forecast Accuracy",
      value: "94.2%",
      description: "Last 30 days average",
      icon: <AIIcon className="text-blue-600 w-5 h-5" />,
      isLoading,
    },
  ];
};

// ===== CHART COMPONENTS =====
const SalesChart = ({ data }: { data: any }) => {
  const actualFiltered = data.actual.filter((val: any) => val !== null);
  const forecastFiltered = data.forecast.filter((val: any) => val !== null);
  const hasData = actualFiltered.length > 0 && forecastFiltered.length > 0;

  let yMin, yMax;
  if (hasData) {
    const maxValue = Math.max(...actualFiltered, ...forecastFiltered);
    const minValue = Math.min(...actualFiltered, ...forecastFiltered);
    const range = maxValue - minValue;
    yMin = Math.max(0, minValue - range * 0.1);
    yMax = maxValue + range * 0.1;
  }

  // Create separate datasets for actual and forecasted periods
  const actualData = [...data.actual.slice(0, -2), ...Array(2).fill(null)]; // Keep blue area same as original (last 2 points null)
  const forecastData = data.forecast; // Show complete forecast line for all data points

  const chartOptions = createChartOptions({
    scales: {
      y: {
        min: hasData ? yMin : undefined,
        max: hasData ? yMax : undefined,
        beginAtZero: !hasData,
        ticks: {
          callback: (value: any, index: any, ticks: any) => {
            if (index === ticks.length - 1) return "";
            return formatCurrency(value);
          },
        },
      },
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const label = context.dataset.label;
          const value = formatCurrency(context.parsed.y);
          if (label === "Forecast Region") return null; // Hide tooltip for shading
          if (label === "Forecast") return `Forecasted Sales: ${value}`;
          return `${label}: ${value}`;
        },
      },
    },
    plugins: {
      ...CHART_BASE_CONFIG.plugins,
      legend: {
        display: true,
        position: "top" as const,
        align: "end" as const,
        labels: {
          usePointStyle: true,
          boxHeight: 6,
        },
      },
      // Custom plugin to add vertical dotted lines and "Forecasted Sales" text
      afterDraw: (chart: any) => {
        const ctx = chart.ctx;
        const chartArea = chart.chartArea;

        // Find the forecasted region boundaries (third last and last data points)
        const forecastStartIndex = data.labels.length - 3;
        const forecastEndIndex = data.labels.length - 1;

        if (forecastStartIndex < 0) return;

        // Get x positions for the forecast region boundaries
        const xScale = chart.scales.x;

        const startX = xScale.getPixelForValue(forecastStartIndex);
        const endX = xScale.getPixelForValue(forecastEndIndex);
        const centerX = (startX + endX) / 2;

        ctx.save();

        // Draw two vertical dotted lines
        ctx.strokeStyle = "#DC2626"; // Red color
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]); // Dotted line pattern
        ctx.lineCap = "round";

        // First vertical line (start of forecast region)
        ctx.beginPath();
        ctx.moveTo(startX, chartArea.top + 10);
        ctx.lineTo(startX, chartArea.bottom - 10);
        ctx.stroke();

        // Second vertical line (end of forecast region)
        ctx.beginPath();
        ctx.moveTo(endX, chartArea.top + 10);
        ctx.lineTo(endX, chartArea.bottom - 10);
        ctx.stroke();

        // Reset line dash for text
        ctx.setLineDash([]);

        // Get y position for text (middle of the chart area)
        const centerY =
          chartArea.top + (chartArea.bottom - chartArea.top) * 0.3;

        // Draw the "Forecasted Sales" text between the two lines
        ctx.fillStyle = "#DC2626"; // Red color
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Add semi-transparent background for better readability
        const textWidth = ctx.measureText("Forecasted Sales").width;
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillRect(
          centerX - textWidth / 2 - 4,
          centerY - 8,
          textWidth + 8,
          16
        );

        // Draw the text
        ctx.fillStyle = "#DC2626";
        ctx.fillText("Forecasted Sales", centerX, centerY);

        ctx.restore();
      },
    },
  });

  return (
    <Line
      data={{
        labels: data.labels,
        datasets: [
          {
            label: "Actual Sales",
            data: actualData,
            borderColor: CHART_COLORS.primary,
            backgroundColor: CHART_COLORS.primaryBg,
            fill: true,
            spanGaps: false,
            borderWidth: 2,
            pointRadius: 4,
            tension: 0.3,
          },
          {
            label: "Forecast",
            data: forecastData,
            borderColor: CHART_COLORS.danger, // Red color for forecast line
            borderDash: [5, 5],
            fill: false,
            spanGaps: true,
            borderWidth: 2,
            pointRadius: 4,
            tension: 0.3,
            pointBackgroundColor: CHART_COLORS.danger,
            pointBorderColor: CHART_COLORS.danger,
          },
        ],
      }}
      options={chartOptions}
    />
  );
};

const BarChart = ({ data }: { data: ChartDataPoint[] }) => {
  const chartOptions = createChartOptions({
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => {
            if (Math.abs(value) >= 1) {
              return "₹" + value.toFixed(1) + "k";
            }
            return "₹" + (value * 1000).toFixed(0);
          },
        },
      },
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const value = context.parsed.y;
          const formattedValue =
            Math.abs(value) >= 1
              ? "₹" + (value * 1000).toLocaleString()
              : "₹" + (value * 1000).toFixed(0);
          return `${context.dataset.label}: ${formattedValue}`;
        },
      },
    },
    layout: {
      padding: { top: 10, right: 10, bottom: 10, left: 10 },
    },
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <Bar
          data={{
            labels: data.map((item) => item.label),
            datasets: [
              {
                label: "Total Sales",
                data: data.map((item) => item.profit || 0),
                backgroundColor: CHART_COLORS.success,
              },
              {
                label: "Cogs",
                data: data.map((item) => item.cost || 0),
                backgroundColor: CHART_COLORS.warning,
              },
            ],
          }}
          options={chartOptions}
        />
      </div>
      <Legend
        items={[
          { color: CHART_COLORS.success, label: "Total Sales" },
          { color: CHART_COLORS.warning, label: "Cogs" },
        ]}
      />
    </div>
  );
};

const PieChart = ({
  data,
}: {
  data: Array<{ label: string; percentage: number; color: string }>;
}) => (
  <div className="w-full h-64 flex items-center justify-center relative">
    <div className="absolute left-0 top-0 w-[250px] h-64">
      <Doughnut
        data={{
          labels: data.map((cat) => cat.label),
          datasets: [
            {
              data: data.map((cat) => cat.percentage),
              backgroundColor: data.map((cat) => cat.color),
              borderColor: "#FFFFFF",
              borderWidth: 2,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          cutout: "50%",
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#FFFFFF",
              titleColor: "#111827",
              bodyColor: "#6B7280",
              borderColor: "#E5E7EB",
              borderWidth: 1,
              cornerRadius: 8,
              displayColors: true,
              callbacks: {
                label: (context: any) =>
                  `${context.label}: ${context.parsed.toFixed(1)}%`,
              },
            },
          },
          // Remove scales entirely for doughnut chart
          scales: {},
        }}
      />
    </div>
    <div className="absolute right-0 bottom-0 w-[78px] space-y-4">
      {data.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ background: item.color }}
          />
          <span className="text-xs text-gray-900 leading-[15px]">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const AnomalyChart = ({ data }: { data: any }) => {
  // Calculate dynamic Y-axis range based on actual data
  const revenueValues = data.revenue.filter(
    (val: number) => val !== null && val !== undefined
  );
  const hasData = revenueValues.length > 0;

  let yMin, yMax;
  if (hasData) {
    const maxValue = Math.max(...revenueValues);
    const minValue = Math.min(...revenueValues);
    const range = maxValue - minValue;
    yMin = Math.max(0, minValue - range * 0.1);
    yMax = maxValue + range * 0.1;
  }

  const chartOptions = createChartOptions({
    scales: {
      y: {
        min: hasData ? yMin : 6000,
        max: hasData ? yMax : 13000,
        ticks: {
          callback: (value: any) => "₹" + (value / 1000).toFixed(1) + "k",
        },
      },
    },
    tooltip: {
      callbacks: {
        label: (context: any) =>
          context.datasetIndex === 1 && context.raw !== null
            ? `Anomaly Detected: ${formatCurrency(context.raw)}`
            : `${context.dataset.label}: ${formatCurrency(context.raw)}`,
      },
    },
  });

  return (
    <Line
      data={{
        labels: data.labels,
        datasets: [
          {
            label: "Revenue",
            data: data.revenue,
            borderColor: CHART_COLORS.purple,
            backgroundColor: CHART_COLORS.purpleBg,
            fill: true,
            borderWidth: 2,
            pointRadius: 4,
            tension: 0.3,
          },
          {
            label: "Anomalies",
            data: data.anomalies,
            borderColor: CHART_COLORS.danger,
            backgroundColor: CHART_COLORS.danger,
            pointRadius: 6,
            showLine: false,
          },
        ],
      }}
      options={chartOptions}
    />
  );
};

// ===== MAIN COMPONENT =====
function RevenueInsights() {
  try {
    // API hooks with error handling
    const {
      data: salesData,
      error: salesError,
      isLoading: salesLoading,
    } = useGetSalesDataQuery({});
    const { data: wastageData, error: wastageError } = useGetWastageDataQuery(
      {}
    );
    const { data: salesByRangeData, error: rangeError } =
      useGetsalesByRangeQuery({});
    const { data: salesCostData, error: costError } =
      useGetSalesCostDataGraphQuery({});
    const { data: forecastData, error: forecastError } =
      useGetSalesCostForecastQuery({});
    const { data: anomalyData, error: anomalyError } =
      useGetSalesCostDataAnomalyGraphQuery({});
    const {
      data: categoryData,
      error: categoryError,
      isLoading: categoryLoading,
    } = useGetSalesByCategoryQuery({});

    // Handle errors silently - they're logged by RTK Query automatically

    // Determine loading states
    const isLoading = salesLoading || categoryLoading;

    // Processed data
    const metricsData = useMetricsData(
      salesData,
      wastageData,
      salesByRangeData,
      isLoading
    );
    const processedSalesData = useProcessedSalesData(
      salesCostData,
      forecastData
    );
    const processedCostData = useProcessedCostData(salesCostData);
    const processedCategoryData = useProcessedCategoryData(categoryData);
    const processedAnomalyData = useProcessedAnomalyData(anomalyData);
    const hasMinimalData = salesData || categoryData;

    // Show skeleton loading for initial load
    if (isLoading && !hasMinimalData) {
      return (
        <>
          {/* Skeleton Revenue Metrics Cards */}
          <div className="user-guide-revenue-insights-overview grid grid-cols-4 gap-6 mb-10">
            {Array.from({ length: 4 }, (_, i) => (
              <SkeletonMetricCard key={i} />
            ))}
          </div>

          {/* Skeleton Main Charts Section */}
          <div className="grid grid-cols-[2fr_1fr] gap-6 mb-10">
            <SkeletonChartContainer
              title="Revenue   vs Forecast"
              height="h-[400px]"
            />
            <div className="user-guide-revenue-insights-ai bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  AI Revenue Insights
                </h3>
              </div>
              <div className="flex flex-col gap-5 h-[400px] justify-between">
                <SkeletonInsightCard />
                <SkeletonInsightCard />
                <SkeletonInsightCard />
              </div>
            </div>
          </div>

          {/* Skeleton Bottom Charts Section */}
          <div className="grid grid-cols-[2fr_1fr] gap-6 mb-10">
            <SkeletonChartContainer title="Revenue vs Cost Analysis" />
            <SkeletonChartContainer title="Top Selling Categories" />
          </div>

          {/* Skeleton Revenue Anomaly Detection */}
          <SkeletonChartContainer
            title="Revenue Anomaly Detection"
            height="h-[400px]"
          />
        </>
      );
    }

    return (
      <>
        {/* Revenue Metrics Cards */}
        <div className="grid grid-cols-4 gap-6 mb-10 user-guide-revenue-insights-overview">
          {metricsData.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-[2fr_1fr] gap-6 mb-10">
          <div className="user-guide-revenue-insights-forecast-graph">
            <ChartContainer title="Sales vs Forecast" height="h-[400px]">
            <SalesChart data={processedSalesData} />
          </ChartContainer>
          </div>

          <div className="user-guide-revenue-insights-ai">
          <ChartContainer title="AI Revenue Insights" height="h-[400px]">
            <div className="flex flex-col gap-5 flex-1 justify-between">
              <InsightCard
                title="Peak Hour Optimization"
                description="Lunch rush (12-2 PM) shows 15% higher revenue potential. Consider increasing production during these hours."
                bgColor="#F0FDF4"
                borderColor="#BBF7D0"
                titleColor="#166534"
                textColor="#15803D"
                iconColor={CHART_COLORS.success}
              />
              <InsightCard
                title="Menu Item Alert"
                description="Mojitos shows declining sales trend. Consider promotional pricing or recipe adjustment."
                bgColor="#FEFCE8"
                borderColor="#FEF08A"
                titleColor="#854D0E"
                textColor="#A16207"
                iconColor="#CA8A04"
              />
              <InsightCard
                title="Revenue Forecast"
                description="The difference in Cogs vs Sales Price for Classic Chicken Burger can be slighly increased to improve the profit margin."
                bgColor="#EFF6FF"
                borderColor="#BFDBFE"
                titleColor="#1E40AF"
                textColor="#1D4ED8"
                iconColor="#2563EB"
              />
            </div>
          </ChartContainer>
          </div>
        </div>

        {/* Bottom Charts Section */}
        <div className="grid grid-cols-[2fr_1fr] gap-6 mb-10">
          <ChartContainer title="Sales vs Cogs Analysis">
            <BarChart data={processedCostData} />
          </ChartContainer>

          <ChartContainer
            title="Top Selling Categories"
            actions={
              <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white text-black">
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
              </select>
            }
          >
            <PieChart data={processedCategoryData} />
          </ChartContainer>
        </div>

        {/* Revenue Anomaly Detection */}
        <ChartContainer title="Revenue Anomaly Detection" height="h-[400px]">
          <div className="bg-red-50 rounded-full px-3 py-1 inline-block text-xs font-medium text-red-800 mb-6">
            {
              processedAnomalyData.anomalies.filter((a: any) => a !== null)
                .length
            }{" "}
            Anomalies Detected
          </div>
          <AnomalyChart data={processedAnomalyData} />
        </ChartContainer>
      </>
    );
  } catch (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Error Loading Revenue Insights
          </h3>
          <p className="text-sm">Please refresh the page to try again.</p>
        </div>
      </div>
    );
  }
}

export default RevenueInsights;
