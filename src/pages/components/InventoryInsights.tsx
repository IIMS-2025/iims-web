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
    icon: React.ReactNode;
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

const MetricCard = (metric: MetricData) => {
    const changeColor = {
        positive: "text-green-600",
        negative: "text-red-600",
        neutral: "text-gray-500",
    }[metric.changeType || "neutral"];

    // Get card background based on metric type
    const getCardBackground = (title: string) => {
        if (title.toLowerCase().includes('wastage') || title.toLowerCase().includes('waste')) {
            return "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100";
        }
        if (title.toLowerCase().includes('inventory') || title.toLowerCase().includes('value')) {
            return "bg-gradient-to-br from-green-50 to-emerald-50 border-green-100";
        }
        if (title.toLowerCase().includes('stock') || title.toLowerCase().includes('alert')) {
            return "bg-gradient-to-br from-purple-50 to-violet-50 border-purple-100";
        }
        return "bg-white border-gray-100";
    };

    return (
        <div className={`${getCardBackground(metric.title)} rounded-xl p-5 pb-4 shadow-sm border h-[140px] flex flex-row overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-1`}>
            <div className="flex-1 flex flex-col justify-start min-h-0 overflow-hidden">
                <div className="text-sm font-medium text-gray-700 mb-2 leading-tight line-clamp-2">
                    {metric.title}
                </div>
                <div className="text-[35px] font-bold text-gray-900 mb-1.5 leading-tight flex-shrink-0">
                    {metric.value}
                </div>
                {metric.description && (
                    <div className="text-xs text-gray-600 leading-tight line-clamp-2 flex-1">
                        {metric.description}
                    </div>
                )}
            </div>
            <div className="flex flex-col justify-between items-start mb-3.5 mr-[-10px]">
                {metric.change && metric.changeType && (
                    <div className="flex flex-row items-center w-full gap-1">
                        <div
                            className={`text-sm font-medium ${changeColor} text-right w-full`}
                        >
                            {metric.change}
                        </div>
                        <div className="w-4 h-4 justify-center items-center">
                            <TrendIcon type={metric.changeType} />
                        </div>
                    </div>
                )}
                <div
                    className="ml-[30px] flex w-10 h-10 justify-center items-center mr-[10px] rounded-lg"
                    style={{ background: metric.iconBg }}
                >
                    {metric.icon}
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
                className={`w-12 h-12 ${iconBg[item.iconType]
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
    const [expanded, setExpanded] = useState(true);
    return (
        <div
            onClick={() => setExpanded(!expanded)}
            className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 w-auto ${expanded ? "h-auto" : "h-[120px]"
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
    const [expanded, setExpanded] = useState(true);
    return (
        <div
            onClick={() => setExpanded(!expanded)}
            className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 w-auto ${expanded ? "h-auto" : "h-[120px]"
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

    const wasteIcon = (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M8.33333 3.33333V2.5C8.33333 1.83696 8.59673 1.20107 9.06557 0.732233C9.5344 0.263392 10.1703 0 10.8333 0H12.5C13.163 0 13.7989 0.263392 14.2678 0.732233C14.7366 1.20107 15 1.83696 15 2.5V3.33333H18.3333C18.7754 3.33333 19.1993 3.50893 19.5118 3.82149C19.8244 4.13405 20 4.55797 20 5C20 5.44203 19.8244 5.86595 19.5118 6.17851C19.1993 6.49107 18.7754 6.66667 18.3333 6.66667H17.5V17.5C17.5 18.1630 17.2366 18.7989 16.7678 19.2678C16.2989 19.7366 15.663 20 15 20H5C4.33696 20 3.70107 19.7366 3.23223 19.2678C2.76339 18.7989 2.5 18.1630 2.5 17.5V6.66667H1.66667C1.22464 6.66667 0.800716 6.49107 0.488155 6.17851C0.175595 5.86595 0 5.44203 0 5C0 4.55797 0.175595 4.13405 0.488155 3.82149C0.800716 3.50893 1.22464 3.33333 1.66667 3.33333H5V2.5C5 1.83696 5.2634 1.20107 5.73223 0.732233C6.20107 0.263392 6.83696 0 7.5 0H9.16667C9.82971 0 10.4656 0.263392 10.9344 0.732233C11.4033 1.20107 11.6667 1.83696 11.6667 2.5V3.33333H8.33333Z"
                fill="#EA580C"
            />
            <path
                d="M7.5 10C7.5 9.55797 7.32440 9.13405 7.01184 8.82149C6.69928 8.50893 6.27536 8.33333 5.83333 8.33333C5.39131 8.33333 4.96738 8.50893 4.65482 8.82149C4.34226 9.13405 4.16667 9.55797 4.16667 10V15C4.16667 15.442 4.34226 15.866 4.65482 16.1785C4.96738 16.4911 5.39131 16.6667 5.83333 16.6667C6.27536 16.6667 6.69928 16.4911 7.01184 16.1785C7.32440 15.866 7.5 15.442 7.5 15V10Z"
                fill="#EA580C"
            />
            <path
                d="M15.8333 10C15.8333 9.55797 15.6577 9.13405 15.3452 8.82149C15.0326 8.50893 14.6087 8.33333 14.1667 8.33333C13.7246 8.33333 13.3007 8.50893 12.9882 8.82149C12.6756 9.13405 12.5 9.55797 12.5 10V15C12.5 15.442 12.6756 15.866 12.9882 16.1785C13.3007 16.4911 13.7246 16.6667 14.1667 16.6667C14.6087 16.6667 15.0326 16.4911 15.3452 16.1785C15.6577 15.866 15.8333 15.442 15.8333 15V10Z"
                fill="#EA580C"
            />
            <path
                d="M11.6667 10C11.6667 9.55797 11.4911 9.13405 11.1785 8.82149C10.866 8.50893 10.442 8.33333 10 8.33333C9.55797 8.33333 9.13405 8.50893 8.82149 8.82149C8.50893 9.13405 8.33333 9.55797 8.33333 10V15C8.33333 15.442 8.50893 15.866 8.82149 16.1785C9.13405 16.4911 9.55797 16.6667 10 16.6667C10.442 16.6667 10.866 16.4911 11.1785 16.1785C11.4911 15.866 11.6667 15.442 11.6667 15V10Z"
                fill="#EA580C"
            />
        </svg>
    );

    const stockAlertsIcon = (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M2 4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H16C16.5304 2 17.0391 2.21071 17.4142 2.58579C17.7893 2.96086 18 3.46957 18 4V16C18 16.5304 17.7893 17.0391 17.4142 17.4142C17.0391 17.7893 16.5304 18 16 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V4Z"
                fill="#16A34A"
            />
            <path
                d="M6 8V16H8V8H6ZM10 6V16H12V6H10ZM14 10V16H16V10H14Z"
                fill="white"
            />
            <path
                d="M1 6C0.734784 6 0.48043 6.10536 0.292893 6.29289C0.105357 6.48043 0 6.73478 0 7C0 7.26522 0.105357 7.51957 0.292893 7.70711C0.48043 7.89464 0.734784 8 1 8H3V6H1Z"
                fill="#16A34A"
            />
            <path
                d="M19 6V8H21C21.2652 8 21.5196 7.89464 21.7071 7.70711C21.8946 7.51957 22 7.26522 22 7C22 6.73478 21.8946 6.48043 21.7071 6.29289C21.5196 6.10536 21.2652 6 21 6H19Z"
                fill="#16A34A"
            />
            <path
                d="M7 0C6.73478 0 6.48043 0.105357 6.29289 0.292893C6.10536 0.48043 6 0.734784 6 1V3H8V1C8 0.734784 7.89464 0.48043 7.70711 0.292893C7.51957 0.105357 7.26522 0 7 0Z"
                fill="#16A34A"
            />
            <path
                d="M13 0C12.7348 0 12.4804 0.105357 12.2929 0.292893C12.1054 0.48043 12 0.734784 12 1V3H14V1C14 0.734784 13.8946 0.48043 13.7071 0.292893C13.5196 0.105357 13.2652 0 13 0Z"
                fill="#16A34A"
            />
        </svg>
    );

    const inventoryValueIcon = (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M10 1.875C10.3315 1.875 10.6495 2.0067 10.8839 2.24112C11.1183 2.47554 11.25 2.79348 11.25 3.125V4.375H13.75C14.0815 4.375 14.3995 4.5067 14.6339 4.74112C14.8683 4.97554 15 5.29348 15 5.625C15 5.95652 14.8683 6.27446 14.6339 6.50888C14.3995 6.74330 14.0815 6.875 13.75 6.875H11.25V8.125C11.25 8.45652 11.1183 8.77446 10.8839 9.00888C10.6495 9.24330 10.3315 9.375 10 9.375C9.66848 9.375 9.35054 9.24330 9.11612 9.00888C8.8817 8.77446 8.75 8.45652 8.75 8.125V6.875H6.25C5.91848 6.875 5.60054 6.74330 5.36612 6.50888C5.1317 6.27446 5 5.95652 5 5.625C5 5.29348 5.1317 4.97554 5.36612 4.74112C5.60054 4.5067 5.91848 4.375 6.25 4.375H8.75V3.125C8.75 2.79348 8.8817 2.47554 9.11612 2.24112C9.35054 2.0067 9.66848 1.875 10 1.875Z"
                fill="#7C3AED"
            />
            <path
                d="M3.125 11.25C2.79348 11.25 2.47554 11.3817 2.24112 11.6161C2.0067 11.8505 1.875 12.1685 1.875 12.5V16.25C1.875 16.9158 2.13944 17.5544 2.61162 18.0266C3.0838 18.4988 3.72246 18.7632 4.38825 18.7632C5.05404 18.7632 5.6927 18.4988 6.16488 18.0266C6.63706 17.5544 6.9015 16.9158 6.9015 16.25V13.75C6.9015 13.4185 6.7698 13.1005 6.53538 12.8661C6.30096 12.6317 5.98302 12.5 5.6515 12.5H3.125V11.25Z"
                fill="#7C3AED"
            />
            <path
                d="M16.875 11.25V12.5H14.3485C14.017 12.5 13.699 12.6317 13.4646 12.8661C13.2302 13.1005 13.0985 13.4185 13.0985 13.75V16.25C13.0985 16.9158 13.3629 17.5544 13.8351 18.0266C14.3073 18.4988 14.946 18.7632 15.6118 18.7632C16.2776 18.7632 16.9162 18.4988 17.3884 18.0266C17.8606 17.5544 18.125 16.9158 18.125 16.25V12.5C18.125 12.1685 17.9933 11.8505 17.7589 11.6161C17.5245 11.3817 17.2065 11.25 16.875 11.25Z"
                fill="#7C3AED"
            />
            <path
                d="M8.75 12.5C8.41848 12.5 8.10054 12.6317 7.86612 12.8661C7.6317 13.1005 7.5 13.4185 7.5 13.75V17.5C7.5 17.8315 7.6317 18.1495 7.86612 18.3839C8.10054 18.6183 8.41848 18.75 8.75 18.75H11.25C11.5815 18.75 11.8995 18.6183 12.1339 18.3839C12.3683 18.1495 12.5 17.8315 12.5 17.5V13.75C12.5 13.4185 12.3683 13.1005 12.1339 12.8661C11.8995 12.6317 11.5815 12.5 11.25 12.5H8.75Z"
                fill="#7C3AED"
            />
        </svg>
    );

    const METRICS_DATA = [
        {
            title: "Wastage Cost",
            value: wastageCost,
            change: "+5.2%",
            changeType: "negative" as const,
            description: "This week's total",
            iconBg: "linear-gradient(135deg, #FED7AA 0%, #FB923C 100%)",
            iconColor: "#EA580C",
            icon: wasteIcon,
        },
        {
            title: "Inventory Value",
            value: "₹18,642",
            change: "+2.8%",
            changeType: "positive" as const,
            description: "Current stock value",
            iconBg: "linear-gradient(135deg, #BBF7D0 0%, #4ADE80 100%)",
            iconColor: "#16A34A",
            icon: stockAlertsIcon,
        },
        {
            title: "Stock Alerts",
            value: "5 Items",
            change: "Alerts",
            changeType: "neutral" as const,
            description: "Low Stock + Dead Stock",
            iconBg: "linear-gradient(135deg, #DDD6FE 0%, #A78BFA 100%)",
            iconColor: "#7C3AED",
            icon: inventoryValueIcon,
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
