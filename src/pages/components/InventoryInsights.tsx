import React, { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import { useGetWastageDataQuery } from "../../services/inventoryInsightsApi";
import appConfig from "../../config/appConfig";

// Types
interface MetricData {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  description?: string;
  iconBg: string;
  iconColor: string;
}

interface StockItem {
  name: string;
  status: string;
  daysLeft: number;
  weight: string;
  percentage: string;
  type: "critical" | "low" | "good" | "excellent";
}

interface ActivityItem {
  type: string;
  time: string;
  description: string;
  iconType: "delivery" | "waste" | "alert";
}

// Chart options
const getChartOptions = (config?: any) => ({
  responsive: true,
  maintainAspectRatio: false,
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
      ...config?.tooltip,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#6B7280", font: { size: 11 } },
      ...config?.x,
    },
    y: {
      ticks: { color: "#6B7280", font: { size: 11 } },
      grid: { color: "#E5E7EB", lineWidth: 1 },
      ...config?.y,
    },
  },
});

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
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {actions}
    </div>
    <div className={height}>{children}</div>
  </div>
);

const SearchInput = ({
  placeholder = "Search materials...",
  width = "w-48",
}: {
  placeholder?: string;
  width?: string;
}) => (
  <div className="relative">
    <input
      type="text"
      placeholder={placeholder}
      className={`px-4 py-2 pl-10 border border-gray-300 rounded-lg text-sm bg-white ${width}`}
    />
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
    >
      <path
        d="M13.0008 6.5004C13.0008 7.93486 12.5351 9.25994 11.7507 10.335L15.7072 14.2946C16.0979 14.6853 16.0979 15.3197 15.7072 15.7103C15.3166 16.101 14.6821 16.101 14.2915 15.7103L10.335 11.7507C9.25994 12.5383 7.93486 13.0008 6.5004 13.0008C2.90955 13.0008 0 10.0912 0 6.5004C0 2.90955 2.90955 0 6.5004 0C10.0912 0 13.0008 2.90955 13.0008 6.5004ZM6.5004 11.0007C7.09138 11.0007 7.67658 10.8843 8.22258 10.6581C8.76858 10.4319 9.26468 10.1005 9.68257 9.68257C10.1005 9.26468 10.4319 8.76858 10.6581 8.22258C10.8843 7.67658 11.0007 7.09138 11.0007 6.5004C11.0007 5.90941 10.8843 5.32421 10.6581 4.77822C10.4319 4.23222 10.1005 3.73611 9.68257 3.31822C9.26468 2.90033 8.76858 2.56885 8.22258 2.34269C7.67658 2.11653 7.09138 2.00012 6.5004 2.00012C5.90941 2.00012 5.32421 2.11653 4.77822 2.34269C4.23222 2.56885 3.73611 2.90033 3.31822 3.31822C2.90033 3.73611 2.56884 4.23222 2.34268 4.77822C2.11652 5.32421 2.00012 5.90941 2.00012 6.5004C2.00012 7.09138 2.11652 7.67658 2.34268 8.22258C2.56884 8.76858 2.90033 9.26468 3.31822 9.68257C3.73611 10.1005 4.23222 10.4319 4.77822 10.6581C5.32421 10.8843 5.90941 11.0007 6.5004 11.0007Z"
        fill="#9CA3AF"
      />
    </svg>
  </div>
);

const TrendIcon = ({ type }: { type: "positive" | "negative" | "neutral" }) => {
  const paths = {
    positive: "M4.5 1L8 6H1L4.5 1Z",
    negative: "M4.5 13L8 8H1L4.5 13Z",
    neutral: "M1 7h6",
  };
  const colors = {
    positive: "#16A34A",
    negative: "#DC2626",
    neutral: "#6B7280",
  };

  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
      <path d={paths[type]} fill={colors[type]} />
    </svg>
  );
};

const SimpleIcon = ({ color = "#16A34A" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect width="20" height="20" fill={color} />
  </svg>
);

const MetricCard = (metric: MetricData) => {
  const changeColor = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-gray-500",
  }[metric.changeType || "neutral"];

  return (
    <div className="bg-white rounded-xl p-5 pb-4 shadow-sm border border-gray-100 h-[140px] flex flex-row overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-1">
      <div className="flex-1 flex flex-col justify-start min-h-0 overflow-hidden">
        <div className="text-sm font-medium text-gray-600 mb-2 leading-tight line-clamp-2">
          {metric.title}
        </div>
        <div className="text-[35px] font-bold text-gray-900 mb-1.5 leading-tight flex-shrink-0">
          {metric.value}
        </div>
        {metric.description && (
          <div className="text-xs text-gray-500 leading-tight line-clamp-2 flex-1">
            {metric.description}
          </div>
        )}
      </div>
      <div className="flex flex-col justify-between items-start mb-3.5 mr-[-10px]">
        {metric.change && metric.changeType && (
          <div className="flex flex-row items-center w-full gap-1">
            <div className={`text-sm font-medium ${changeColor} text-right w-full`}>
              {metric.change}
            </div>
            <div className="w-4 h-4 justify-center items-center">
              <TrendIcon type={metric.changeType} />
            </div>
          </div>
        )}
        <div
          className="ml-[30px] p-2 mr-[10px]"
          style={{ background: metric.iconBg }}
        >
          <SimpleIcon color={metric.iconColor} />
        </div>
      </div>
    </div>
  );
};

const StockItemCard = ({ item }: { item: StockItem }) => {
  const bgColors = {
    critical: "bg-red-50 border-red-200",
    low: "bg-yellow-50 border-yellow-200",
    good: "bg-green-50 border-green-200",
    excellent: "bg-green-50 border-green-200",
  };

  const dotColors = {
    critical: "bg-red-500",
    low: "bg-yellow-500",
    good: "bg-green-500",
    excellent: "bg-green-500",
  };

  const textColors = {
    critical: "text-red-600",
    low: "text-yellow-600",
    good: "text-green-600",
    excellent: "text-green-600",
  };

  return (
    <div className={`${bgColors[item.type]} border rounded-lg p-4`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 ${dotColors[item.type]} rounded-full`}></div>
          <div>
            <h4 className="text-base font-medium text-gray-900">{item.name}</h4>
            <p className="text-sm text-gray-600">
              {item.status} - {item.daysLeft} days left
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-base font-semibold text-gray-900">{item.weight}</p>
          <p className={`text-sm font-medium ${textColors[item.type]}`}>
            {item.percentage} remaining
          </p>
        </div>
      </div>
    </div>
  );
};

const ActivityItemCard = ({ item }: { item: ActivityItem }) => {
  const iconBg = {
    delivery: "bg-green-100",
    waste: "bg-red-100",
    alert: "bg-yellow-100",
  };

  const icons = {
    delivery: (
      <path
        d="M1 8L19 8M12 1L19 8L12 15"
        stroke="#16A34A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    waste: (
      <>
        <path
          d="M1 4H13L12 14H2L1 4Z"
          stroke="#DC2626"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.5 7.5V10.5M6.5 7.5V10.5M8.5 7.5V10.5"
          stroke="#DC2626"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </>
    ),
    alert: (
      <>
        <path
          d="M8 1L15 15H1L8 1Z"
          stroke="#CA8A04"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 6V9M8 12H8.01"
          stroke="#CA8A04"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  };

  return (
    <div className="flex items-start gap-4">
      <div
        className={`w-12 h-12 ${
          iconBg[item.iconType]
        } rounded-lg flex items-center justify-center flex-shrink-0`}
      >
        <svg
          width={
            item.iconType === "delivery"
              ? "20"
              : item.iconType === "waste"
              ? "14"
              : "16"
          }
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          {icons[item.iconType]}
        </svg>
      </div>
      <div>
        <h4 className="text-base font-medium text-gray-900 mb-1">
          {item.type}
        </h4>
        <p className="text-sm text-gray-500">
          {item.time} - {item.description}
        </p>
      </div>
    </div>
  );
};

const StockAnomalyDetection = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 w-auto ${
        expanded ? "h-auto" : "h-[120px]"
      }`}
    >
      <div className="flex items-center justify-between mb-6 cursor-pointer">
        <h3 className="text-lg font-semibold text-gray-900">
          Stock Anomaly Detection
        </h3>
        <div className="bg-red-100 px-3 py-1 rounded-full">
          <span className="text-xs font-medium text-red-800">3 Anomalies</span>
        </div>
      </div>
      {expanded ? (
        <div className="space-y-4">
          {/* Unusual Consumption Spike */}
          <div className="border-l-4 border-red-500 bg-red-50 pl-4 pr-4 py-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="mt-1 flex-shrink-0"
              >
                <path d="M8 1L15 8L8 15L1 8L8 1Z" fill="#DC2626" />
              </svg>
              <div>
                <h4 className="text-base font-medium text-red-900 mb-1">
                  Unusual Consumption Spike
                </h4>
                <p className="text-sm text-red-700 mb-2">
                  Salmon usage increased 340% yesterday vs normal consumption.
                  Check for preparation errors or theft.
                </p>
                <p className="text-xs text-red-600">Detected 2 hours ago</p>
              </div>
            </div>
          </div>

          {/* Irregular Stock Pattern */}
          <div className="border-l-4 border-yellow-500 bg-yellow-50 pl-4 pr-4 py-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="mt-1 flex-shrink-0"
              >
                <path d="M2 8L8 2L14 8L8 14L2 8Z" fill="#CA8A04" />
              </svg>
              <div>
                <h4 className="text-base font-medium text-yellow-900 mb-1">
                  Irregular Stock Pattern
                </h4>
                <p className="text-sm text-yellow-700 mb-2">
                  Tomato inventory dropping faster than forecasted. Possible
                  supplier quality issues.
                </p>
                <p className="text-xs text-yellow-600">Detected 5 hours ago</p>
              </div>
            </div>
          </div>

          {/* Expiry Date Anomaly */}
          <div className="border-l-4 border-orange-500 bg-orange-50 pl-4 pr-4 py-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="mt-1 flex-shrink-0"
              >
                <circle cx="8" cy="8" r="6" fill="#EA580C" />
                <path
                  d="M8 4V8L11 11"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <h4 className="text-base font-medium text-orange-900 mb-1">
                  Expiry Date Anomaly
                </h4>
                <p className="text-sm text-orange-700 mb-2">
                  Multiple dairy products expiring sooner than expected. Review
                  storage conditions.
                </p>
                <p className="text-xs text-orange-600">Detected 1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500 cursor-pointer">
          Click to show all 3 anomalies
        </div>
      )}
    </div>
  );
};

const SmartNotifications = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 w-auto ${
        expanded ? "h-auto" : "h-[120px]"
      }`}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Smart Notifications
      </h3>
      {expanded ? (
        <div className="space-y-4">
          {/* Reorder Suggestion */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M7 1V13M1 7H13"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-medium text-blue-900 mb-1">
                  Reorder Suggestion
                </h4>
                <p className="text-sm text-blue-700">
                  Order 25kg salmon by tomorrow to avoid stockout
                </p>
              </div>
            </div>
          </div>

          {/* Cost Optimization */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1L13 7L7 13L1 7L7 1Z" fill="white" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-medium text-green-900 mb-1">
                  Cost Optimization
                </h4>
                <p className="text-sm text-green-700">
                  Beef prices 12% lower this week - good time to stock up
                </p>
              </div>
            </div>
          </div>

          {/* Menu Optimization */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M1 7H13M7 1V13"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-medium text-purple-900 mb-1">
                  Menu Optimization
                </h4>
                <p className="text-sm text-purple-700">
                  Feature pasta dishes this week - high stock, low waste
                </p>
              </div>
            </div>
          </div>

          {/* Expiry Alert */}
          <div className="bg-yellow-50 border border-yellow-400 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect
                    x="2"
                    y="3"
                    width="10"
                    height="8"
                    rx="1"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <path
                    d="M5 1V5M9 1V5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-medium text-yellow-900 mb-1">
                  Expiry Alert
                </h4>
                <p className="text-sm text-yellow-700">
                  8 items expire within 3 days - plan special menu
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500 cursor-pointer">
          Click to show all notifications
        </div>
      )}
    </div>
  );
};

export default function InventoryInsights() {
  const { data: wastageData } = useGetWastageDataQuery({});

  // Calculate wastage cost from API data
  const wastageCost = useMemo(() => {
    if (!wastageData) return "₹1,247";
    const currencySymbol = appConfig.tenant.currency === "INR" ? "₹" : "$";
    return `${currencySymbol}${wastageData.total_cost_loss.toLocaleString()}`;
  }, [wastageData]);

  // Get top waste category from API data
  const topWasteCategory = useMemo(() => {
    if (!wastageData || !wastageData.by_reason) return "Vegetables";
    const reasons = Object.entries(wastageData.by_reason);
    if (reasons.length === 0) return "N/A";

    const topReason = reasons.reduce((prev, curr) =>
      curr[1].cost_loss > prev[1].cost_loss ? curr : prev
    );
    return topReason[0].charAt(0).toUpperCase() + topReason[0].slice(1);
  }, [wastageData]);

  const METRICS_DATA = [
    {
      title: "Wastage Cost",
      value: wastageCost,
      change: "+5.2%",
      changeType: "negative" as const,
      description: "This week total",
      iconBg: "#FEE2E2",
      iconColor: "#DC2626",
    },
    {
      title: "Inventory Value",
      value: "₹18,642",
      change: "+2.8%",
      changeType: "positive" as const,
      description: "Current stock value",
      iconBg: "#DCFCE7",
      iconColor: "#16A34A",
    },
    {
      title: "Stock Alerts",
      value: "5 Items",
      change: "Alerts",
      changeType: "neutral" as const,
      description: "Low Stock + Dead Stock",
      iconBg: "#FEF3C7",
      iconColor: "#CA8A04",
    },
  ];

  const STOCK_ITEMS: StockItem[] = [
    {
      name: "Fresh Salmon",
      status: "Critical",
      daysLeft: 2,
      weight: "8.2 kg",
      percentage: "15%",
      type: "critical",
    },
    {
      name: "Organic Tomatoes",
      status: "Low",
      daysLeft: 5,
      weight: "15.7 kg",
      percentage: "28%",
      type: "low",
    },
    {
      name: "Chicken Breast",
      status: "Good",
      daysLeft: 12,
      weight: "42.3 kg",
      percentage: "78%",
      type: "good",
    },
    {
      name: "Prime Beef",
      status: "Excellent",
      daysLeft: 18,
      weight: "28.9 kg",
      percentage: "92%",
      type: "excellent",
    },
  ];

  const ACTIVITY_ITEMS: ActivityItem[] = [
    {
      type: "New delivery received",
      time: "Today at 8:30 AM",
      description: "Fresh vegetables and dairy products",
      iconType: "delivery",
    },
    {
      type: "Waste recorded",
      time: "Today at 6:15 AM",
      description: "2.3kg vegetables, expired bread",
      iconType: "waste",
    },
    {
      type: "Low stock alert triggered",
      time: "Yesterday at 11:45 PM",
      description: "Salmon below minimum threshold",
      iconType: "alert",
    },
  ];

  const CHART_DATA = {
    stock: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      actual: [45, 38, 32, 28, 22, 18, 15],
      forecast: [40, 35, 30, 25, 20, 16, 12],
      anomalies: [null, 38, null, null, 22, null, null],
    },
    rawMaterial: {
      labels: [
        "1. Jan",
        "2. Jan",
        "3. Jan",
        "4. Jan",
        "5. Jan",
        "6. Jan",
        "7. Jan",
      ],
      prices: [24.5, 25.2, 24.9, 26.1, 25.9, 27.4, 26.8],
      averagePrice: 25.8,
    },
  };

  const createLineChart = (data: any, options: any) => {
    const chartData = {
      labels: data.labels,
      datasets: data.datasets.map((dataset: any) => ({
        ...dataset,
        borderWidth: dataset.borderWidth || 2,
        pointRadius: dataset.pointRadius || 4,
        tension: dataset.tension || 0.3,
      })),
    };
    return <Line data={chartData} options={getChartOptions(options)} />;
  };

  const StockConsumptionChart = () =>
    createLineChart(
      {
        labels: CHART_DATA.stock.labels,
        datasets: [
          {
            label: "Stock Level",
            data: CHART_DATA.stock.actual,
            borderColor: "#8B5CF6",
            borderWidth: 3,
          },
          {
            label: "Forecast Usage",
            data: CHART_DATA.stock.forecast,
            borderColor: "#9CA3AF",
            borderDash: [8, 4],
            pointStyle: "rectRot",
          },
          {
            label: "Anomalies",
            data: CHART_DATA.stock.anomalies,
            borderColor: "transparent",
            backgroundColor: "#EF4444",
            pointRadius: 6,
            showLine: false,
          },
        ],
      },
      {
        y: {
          min: 10,
          max: 50,
          ticks: { stepSize: 10 },
          title: {
            display: true,
            text: "Stock (kg)",
            color: "#6B7280",
            font: { size: 12 },
          },
        },
      }
    );

  const RawMaterialCostChart = () =>
    createLineChart(
      {
        labels: CHART_DATA.rawMaterial.labels,
        datasets: [
          {
            label: "Current Price",
            data: CHART_DATA.rawMaterial.prices,
            borderColor: "#8B5CF6",
            borderWidth: 3,
          },
          {
            label: "Average Price",
            data: new Array(CHART_DATA.rawMaterial.labels.length).fill(
              CHART_DATA.rawMaterial.averagePrice
            ),
            borderColor: "#9CA3AF",
            borderDash: [8, 4],
            pointRadius: 0,
          },
        ],
      },
      {
        y: {
          min: 24,
          max: 29,
          ticks: { stepSize: 1 },
          title: {
            display: true,
            text: "Price per Unit (₹)",
            color: "#6B7280",
            font: { size: 12 },
          },
        },
        tooltip: {
          callbacks: { label: (context: any) => `₹${context.parsed.y}` },
        },
      }
    );

  return (
    <div className="inventory-insights-container w-full">
      {/* Inventory Metrics Cards */}
      <section className="mb-8 user-guide-inventory-insights-overview">
        <div className="grid grid-cols-3 gap-6">
          {METRICS_DATA.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </section>

      {/* Anomaly Detection and Smart Notifications Section */}
      <section className="mb-8 user-guide-inventory-insights-smart-notifications">
        <div className="grid grid-cols-2 gap-6">
          {/* Stock Anomaly Detection */}
          <StockAnomalyDetection />

          {/* Smart Notifications */}
          <SmartNotifications />
        </div>
      </section>

      {/* Charts Section */}
      <section className="mb-8">
        <div className="grid grid-cols-2 gap-6 user-guide-inventory-insights-forecast-graph">
          <ChartContainer
            title="Stock vs Forecast Usage"
            actions={<SearchInput width="w-64" />}
          >
            <StockConsumptionChart />
          </ChartContainer>

          <ChartContainer
            title="Raw Material Cost Fluctuation"
            actions={<SearchInput />}
          >
            <RawMaterialCostChart />
          </ChartContainer>
        </div>
      </section>

      {/* Bottom Grid */}
      <section>
        <div className="grid grid-cols-2 gap-6">
          <ChartContainer
            title="Stock Availability"
            actions={<SearchInput />}
            height="auto"
          >
            <div className="space-y-4">
              {STOCK_ITEMS.map((item, index) => (
                <StockItemCard key={index} item={item} />
              ))}
            </div>
          </ChartContainer>

          <ChartContainer title="Recent Inventory Activity" height="auto">
            <div className="space-y-6">
              {ACTIVITY_ITEMS.map((item, index) => (
                <ActivityItemCard key={index} item={item} />
              ))}
            </div>
          </ChartContainer>
        </div>
      </section>
    </div>
  );
}
