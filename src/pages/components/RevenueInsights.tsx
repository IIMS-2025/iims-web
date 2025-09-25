import React, { useMemo } from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  useGetSalesDataQuery,
  useGetWastageDataQuery,
  useGetsalesByRangeQuery,
  useGetSalesCostDataGraphQuery,
  useGetSalesByCategoryQuery,
  useGetSalesCostDataAnomalyGraphQuery,
} from "../../services/inventoryInsightsApi";
import appConfig from "../../config/appConfig";

// ===== TYPES =====
interface MetricData {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  description?: string;
  iconBg: string;
  iconColor: string;
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
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const generateFutureDates = (lastDate: Date, count: number): string[] => {
  return Array.from({ length: count }, (_, i) => {
    const futureDate = new Date(lastDate);
    futureDate.setDate(lastDate.getDate() + i + 1);
    return formatDate(futureDate.toISOString());
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

const MetricCard = ({
  title,
  value,
  change,
  changeType,
  description,
  iconBg,
  iconColor,
}: MetricData) => {
  const changeColor = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-gray-500",
  }[changeType || "neutral"];

  return (
    <div className="bg-white rounded-xl p-5 pb-4 shadow-sm border border-gray-100 h-[180px] flex flex-col overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-1">
      <div className="flex justify-between items-start mb-3.5 flex-shrink-0">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: iconBg }}
        >
          <SimpleIcon color={iconColor} />
        </div>
        {change && changeType && (
          <div className="flex items-center gap-1">
            <TrendIcon type={changeType} />
            <span className={`text-sm font-medium ${changeColor}`}>
              {change}
            </span>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-start min-h-0 overflow-hidden">
        <div className="text-sm font-medium text-gray-600 mb-2 leading-tight line-clamp-2">
          {title}
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1.5 leading-tight flex-shrink-0">
          {value}
        </div>
        {description && (
          <div className="text-xs text-gray-500 leading-tight line-clamp-2 flex-1">
            {description}
          </div>
        )}
      </div>
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
const processSalesData = (data: any[]) => {
  // Process historical data
  const historicalLabels = data.map((item: any) => formatDate(item.date));
  const actualSales = data.map((item: any) => item.sales);

  // Generate future dates
  const lastDate = new Date(data[data.length - 1].date);
  const futureLabels = generateFutureDates(lastDate, 2);

  // Combine labels and data
  const allLabels = [...historicalLabels, ...futureLabels];
  const actual = [...actualSales, ...Array(2).fill(null)];

  // Generate forecast
  const historicalForecast = actualSales.map((val: number) => val * 1.05);
  const avgSales =
    actualSales.reduce((sum: number, val: number) => sum + val, 0) /
    actualSales.length;
  const futureForecast = [avgSales * 1.1, avgSales * 1.15];
  const forecast = [...historicalForecast, ...futureForecast];

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
const useProcessedSalesData = (salesCostData: any) => {
  return useProcessedSalesCostData(salesCostData, processSalesData, {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    actual: [],
    forecast: [],
  });
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
  salesByRangeData: any
) => {
  const todaysSales = useMemo(() => {
    if (!salesData?.length) return "₹0";
    return formatCurrency(salesData[0].total_sales);
  }, [salesData]);

  const wastageCost = useMemo(() => {
    if (!wastageData) return "₹34";
    return formatCurrency(wastageData.total_cost_loss);
  }, [wastageData]);

  const weeklyRevenue = useMemo(() => {
    if (!salesByRangeData?.length) return "₹0";
    return formatCurrency(salesByRangeData[0].total_sales);
  }, [salesByRangeData]);

  return [
    {
      title: "Today's Sales",
      value: todaysSales,
      iconBg: "#DCFCE7",
      iconColor: CHART_COLORS.success,
    },
    {
      title: "Waste on Sales",
      value: wastageCost,
      iconBg: "#FEE2E2",
      iconColor: CHART_COLORS.danger,
    },
    {
      title: "Weekly Revenue",
      value: weeklyRevenue,
      iconBg: "rgba(124, 58, 237, 0.1)",
      iconColor: CHART_COLORS.purple,
    },
    {
      title: "AI Forecast Accuracy",
      value: "94.2%",
      description: "Last 30 days average",
      iconBg: "#DBEAFE",
      iconColor: "#2563EB",
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
        label: (context: any) =>
          `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`,
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
            data: data.actual,
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
            data: data.forecast,
            borderColor: CHART_COLORS.secondary,
            borderDash: [5, 5],
            fill: false,
            spanGaps: true,
            borderWidth: 2,
            pointRadius: 4,
            tension: 0.3,
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
                label: "Total Cost",
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
          { color: CHART_COLORS.warning, label: "Total Cost" },
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
    const { data: anomalyData, error: anomalyError } =
      useGetSalesCostDataAnomalyGraphQuery({});
    const {
      data: categoryData,
      error: categoryError,
      isLoading: categoryLoading,
    } = useGetSalesByCategoryQuery({});

    // Handle errors silently - they're logged by RTK Query automatically

    // Processed data
    const metricsData = useMetricsData(
      salesData,
      wastageData,
      salesByRangeData
    );
    const processedSalesData = useProcessedSalesData(salesCostData);
    const processedCostData = useProcessedCostData(salesCostData);
    const processedCategoryData = useProcessedCategoryData(categoryData);
    const processedAnomalyData = useProcessedAnomalyData(anomalyData);

    // Determine loading states
    const isLoading = salesLoading || categoryLoading;
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
            <ChartContainer title="Revenue vs Forecast" height="h-[400px]">
              <SalesChart data={processedSalesData} />
            </ChartContainer>
          </div>

          <div className="user-guide-revenue-insights-ai">
            <ChartContainer title="AI Revenue Insights" height="h-[400px]">
              <div className="flex flex-col gap-5 flex-1 justify-between">
                <InsightCard
                  title="Peak Hour Optimization"
                  description="Lunch rush (12-2 PM) shows 15% higher revenue potential. Consider increasing staff during these hours."
                  bgColor="#F0FDF4"
                  borderColor="#BBF7D0"
                  titleColor="#166534"
                  textColor="#15803D"
                  iconColor={CHART_COLORS.success}
                />
                <InsightCard
                  title="Menu Item Alert"
                  description="Seafood pasta showing declining sales trend. Consider promotional pricing or recipe adjustment."
                  bgColor="#FEFCE8"
                  borderColor="#FEF08A"
                  titleColor="#854D0E"
                  textColor="#A16207"
                  iconColor="#CA8A04"
                />
                <InsightCard
                  title="Revenue Forecast"
                  description="Next week projected revenue: ₹58,200 (+10.1% vs this week). Weather forecast favorable."
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
