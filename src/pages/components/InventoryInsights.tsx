import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { useGetWastageDataQuery } from '../../services/inventoryInsightsApi';
import appConfig from '../../config/appConfig';

// Types
interface MetricData {
    title: string;
    value: string;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
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
    type: 'critical' | 'low' | 'good' | 'excellent';
}

interface ActivityItem {
    type: string;
    time: string;
    description: string;
    iconType: 'delivery' | 'waste' | 'alert';
}

// Chart options
const getChartOptions = (config?: any) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: '#FFFFFF',
            titleColor: '#111827',
            bodyColor: '#6B7280',
            borderColor: '#E5E7EB',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            ...config?.tooltip
        }
    },
    scales: {
        x: {
            grid: { display: false },
            ticks: { color: '#6B7280', font: { size: 11 } },
            ...config?.x
        },
        y: {
            ticks: { color: '#6B7280', font: { size: 11 } },
            grid: { color: '#E5E7EB', lineWidth: 1 },
            ...config?.y
        }
    }
});

const ChartContainer = ({ title, children, actions, height = "h-80" }: { title: string, children: React.ReactNode, actions?: React.ReactNode, height?: string }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {actions}
        </div>
        <div className={height}>
            {children}
        </div>
    </div>
);

const SearchInput = ({ placeholder = "Search materials...", width = "w-48" }: { placeholder?: string, width?: string }) => (
    <div className="relative">
        <input
            type="text"
            placeholder={placeholder}
            className={`px-4 py-2 pl-10 border border-gray-300 rounded-lg text-sm bg-white ${width}`}
        />
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <path d="M13.0008 6.5004C13.0008 7.93486 12.5351 9.25994 11.7507 10.335L15.7072 14.2946C16.0979 14.6853 16.0979 15.3197 15.7072 15.7103C15.3166 16.101 14.6821 16.101 14.2915 15.7103L10.335 11.7507C9.25994 12.5383 7.93486 13.0008 6.5004 13.0008C2.90955 13.0008 0 10.0912 0 6.5004C0 2.90955 2.90955 0 6.5004 0C10.0912 0 13.0008 2.90955 13.0008 6.5004ZM6.5004 11.0007C7.09138 11.0007 7.67658 10.8843 8.22258 10.6581C8.76858 10.4319 9.26468 10.1005 9.68257 9.68257C10.1005 9.26468 10.4319 8.76858 10.6581 8.22258C10.8843 7.67658 11.0007 7.09138 11.0007 6.5004C11.0007 5.90941 10.8843 5.32421 10.6581 4.77822C10.4319 4.23222 10.1005 3.73611 9.68257 3.31822C9.26468 2.90033 8.76858 2.56885 8.22258 2.34269C7.67658 2.11653 7.09138 2.00012 6.5004 2.00012C5.90941 2.00012 5.32421 2.11653 4.77822 2.34269C4.23222 2.56885 3.73611 2.90033 3.31822 3.31822C2.90033 3.73611 2.56884 4.23222 2.34268 4.77822C2.11652 5.32421 2.00012 5.90941 2.00012 6.5004C2.00012 7.09138 2.11652 7.67658 2.34268 8.22258C2.56884 8.76858 2.90033 9.26468 3.31822 9.68257C3.73611 10.1005 4.23222 10.4319 4.77822 10.6581C5.32421 10.8843 5.90941 11.0007 6.5004 11.0007Z" fill="#9CA3AF" />
        </svg>
    </div>
);

const TrendIcon = ({ type }: { type: 'positive' | 'negative' | 'neutral' }) => {
    const paths = {
        positive: "M4.5 1L8 6H1L4.5 1Z",
        negative: "M4.5 13L8 8H1L4.5 13Z",
        neutral: "M1 7h6"
    };
    const colors = { positive: '#16A34A', negative: '#DC2626', neutral: '#6B7280' };

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
        positive: 'text-green-600',
        negative: 'text-red-600',
        neutral: 'text-gray-500'
    }[metric.changeType || 'neutral'];

    return (
        <div className="bg-white rounded-xl p-5 pb-4 shadow-sm border border-gray-100 h-[180px] flex flex-col overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-1">
            <div className="flex justify-between items-start mb-3.5 flex-shrink-0">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: metric.iconBg }}>
                    <SimpleIcon color={metric.iconColor} />
                </div>
                {metric.change && metric.changeType && (
                    <div className="flex items-center gap-1">
                        <TrendIcon type={metric.changeType} />
                        <span className={`text-sm font-medium ${changeColor}`}>{metric.change}</span>
                    </div>
                )}
            </div>
            <div className="flex-1 flex flex-col justify-start min-h-0 overflow-hidden">
                <div className="text-sm font-medium text-gray-600 mb-2 leading-tight line-clamp-2">{metric.title}</div>
                <div className="text-2xl font-bold text-gray-900 mb-1.5 leading-tight flex-shrink-0">{metric.value}</div>
                {metric.description && (
                    <div className="text-xs text-gray-500 leading-tight line-clamp-2 flex-1">{metric.description}</div>
                )}
            </div>
        </div>
    );
};

const StockItemCard = ({ item }: { item: StockItem }) => {
    const bgColors = {
        critical: 'bg-red-50 border-red-200',
        low: 'bg-yellow-50 border-yellow-200',
        good: 'bg-green-50 border-green-200',
        excellent: 'bg-green-50 border-green-200'
    };

    const dotColors = {
        critical: 'bg-red-500',
        low: 'bg-yellow-500',
        good: 'bg-green-500',
        excellent: 'bg-green-500'
    };

    const textColors = {
        critical: 'text-red-600',
        low: 'text-yellow-600',
        good: 'text-green-600',
        excellent: 'text-green-600'
    };

    return (
        <div className={`${bgColors[item.type]} border rounded-lg p-4`}>
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 ${dotColors[item.type]} rounded-full`}></div>
                    <div>
                        <h4 className="text-base font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.status} - {item.daysLeft} days left</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-base font-semibold text-gray-900">{item.weight}</p>
                    <p className={`text-sm font-medium ${textColors[item.type]}`}>{item.percentage} remaining</p>
                </div>
            </div>
        </div>
    );
};

const ActivityItemCard = ({ item }: { item: ActivityItem }) => {
    const iconBg = {
        delivery: 'bg-green-100',
        waste: 'bg-red-100',
        alert: 'bg-yellow-100'
    };

    const icons = {
        delivery: <path d="M1 8L19 8M12 1L19 8L12 15" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
        waste: <><path d="M1 4H13L12 14H2L1 4Z" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M4.5 7.5V10.5M6.5 7.5V10.5M8.5 7.5V10.5" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" /></>,
        alert: <><path d="M8 1L15 15H1L8 1Z" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M8 6V9M8 12H8.01" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></>
    };

    return (
        <div className="flex items-start gap-4">
            <div className={`w-12 h-12 ${iconBg[item.iconType]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <svg width={item.iconType === 'delivery' ? "20" : item.iconType === 'waste' ? "14" : "16"} height="16" viewBox="0 0 16 16" fill="none">
                    {icons[item.iconType]}
                </svg>
            </div>
            <div>
                <h4 className="text-base font-medium text-gray-900 mb-1">{item.type}</h4>
                <p className="text-sm text-gray-500">{item.time} - {item.description}</p>
            </div>
        </div>
    );
};

export default function InventoryInsights() {
    const { data: wastageData } = useGetWastageDataQuery({});

    // Calculate wastage cost from API data
    const wastageCost = useMemo(() => {
        if (!wastageData) return "₹1,247";
        const currencySymbol = appConfig.tenant.currency === 'INR' ? '₹' : '$';
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
        { title: "Wastage Cost", value: wastageCost, change: "+5.2%", changeType: "negative" as const, description: "This week total", iconBg: "#FEE2E2", iconColor: "#DC2626" },
        { title: "Inventory Value", value: "₹18,642", change: "+2.8%", changeType: "positive" as const, description: "Current stock value", iconBg: "#DCFCE7", iconColor: "#16A34A" },
        { title: "Stock Alerts", value: "5 Items", change: "Alerts", changeType: "neutral" as const, description: "Low Stock + Dead Stock", iconBg: "#FEF3C7", iconColor: "#CA8A04" }
    ];

    const STOCK_ITEMS: StockItem[] = [
        { name: 'Fresh Salmon', status: 'Critical', daysLeft: 2, weight: '8.2 kg', percentage: '15%', type: 'critical' },
        { name: 'Organic Tomatoes', status: 'Low', daysLeft: 5, weight: '15.7 kg', percentage: '28%', type: 'low' },
        { name: 'Chicken Breast', status: 'Good', daysLeft: 12, weight: '42.3 kg', percentage: '78%', type: 'good' },
        { name: 'Prime Beef', status: 'Excellent', daysLeft: 18, weight: '28.9 kg', percentage: '92%', type: 'excellent' }
    ];

    const ACTIVITY_ITEMS: ActivityItem[] = [
        { type: 'New delivery received', time: 'Today at 8:30 AM', description: 'Fresh vegetables and dairy products', iconType: 'delivery' },
        { type: 'Waste recorded', time: 'Today at 6:15 AM', description: '2.3kg vegetables, expired bread', iconType: 'waste' },
        { type: 'Low stock alert triggered', time: 'Yesterday at 11:45 PM', description: 'Salmon below minimum threshold', iconType: 'alert' }
    ];

    const CHART_DATA = {
        stock: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            actual: [45, 38, 32, 28, 22, 18, 15],
            forecast: [40, 35, 30, 25, 20, 16, 12],
            anomalies: [null, 38, null, null, 22, null, null]
        },
        rawMaterial: {
            labels: ['1. Jan', '2. Jan', '3. Jan', '4. Jan', '5. Jan', '6. Jan', '7. Jan'],
            prices: [24.5, 25.2, 24.9, 26.1, 25.9, 27.4, 26.8],
            averagePrice: 25.8
        }
    };

    const createLineChart = (data: any, options: any) => {
        const chartData = {
            labels: data.labels,
            datasets: data.datasets.map((dataset: any) => ({
                ...dataset,
                borderWidth: dataset.borderWidth || 2,
                pointRadius: dataset.pointRadius || 4,
                tension: dataset.tension || 0.3
            }))
        };
        return <Line data={chartData} options={getChartOptions(options)} />;
    };

    const StockConsumptionChart = () => createLineChart({
        labels: CHART_DATA.stock.labels,
        datasets: [
            {
                label: 'Stock Level',
                data: CHART_DATA.stock.actual,
                borderColor: '#8B5CF6',
                borderWidth: 3
            },
            {
                label: 'Forecast Usage',
                data: CHART_DATA.stock.forecast,
                borderColor: '#9CA3AF',
                borderDash: [8, 4],
                pointStyle: 'rectRot'
            },
            {
                label: 'Anomalies',
                data: CHART_DATA.stock.anomalies,
                borderColor: 'transparent',
                backgroundColor: '#EF4444',
                pointRadius: 6,
                showLine: false
            }
        ]
    }, {
        y: {
            min: 10,
            max: 50,
            ticks: { stepSize: 10 },
            title: { display: true, text: 'Stock (kg)', color: '#6B7280', font: { size: 12 } }
        }
    });

    const RawMaterialCostChart = () => createLineChart({
        labels: CHART_DATA.rawMaterial.labels,
        datasets: [
            {
                label: 'Current Price',
                data: CHART_DATA.rawMaterial.prices,
                borderColor: '#8B5CF6',
                borderWidth: 3
            },
            {
                label: 'Average Price',
                data: new Array(CHART_DATA.rawMaterial.labels.length).fill(CHART_DATA.rawMaterial.averagePrice),
                borderColor: '#9CA3AF',
                borderDash: [8, 4],
                pointRadius: 0
            }
        ]
    }, {
        y: {
            min: 24,
            max: 29,
            ticks: { stepSize: 1 },
            title: { display: true, text: 'Price per Unit (₹)', color: '#6B7280', font: { size: 12 } }
        },
        tooltip: { callbacks: { label: (context: any) => `₹${context.parsed.y}` } }
    });

    return (
        <div className="inventory-insights-container w-full">
            {/* AI Inventory Intelligence Section */}
            <section className="mb-10">
                <div className="bg-[#39297B] rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 flex items-center justify-center">
                            <svg width="54" height="56" viewBox="0 0 54 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M46 0C50.4183 0 54 3.58172 54 8V48C54 52.4183 50.4183 56 46 56H8C3.58172 56 0 52.4183 0 48V8C0 3.58172 3.58172 0 8 0H46Z" fill="white" fillOpacity="0.2" />
                                <path d="M46 0C50.4183 0 54 3.58172 54 8V48C54 52.4183 50.4183 56 46 56H8C3.58172 56 0 52.4183 0 48V8C0 3.58172 3.58172 0 8 0H46Z" stroke="#E5E7EB" />
                                <path d="M42 42H12V13H42V42Z" stroke="#E5E7EB" />
                                <g clipPath="url(#clip0_147_695)">
                                    <path d="M27 15C27.8297 15 28.5 15.6703 28.5 16.5V19.5H34.125C35.9906 19.5 37.5 21.0094 37.5 22.875V35.625C37.5 37.4906 35.9906 39 34.125 39H19.875C18.0094 39 16.5 37.4906 16.5 35.625V22.875C16.5 21.0094 18.0094 19.5 19.875 19.5H25.5V16.5C25.5 15.6703 26.1703 15 27 15ZM21.75 33C21.3375 33 21 33.3375 21 33.75C21 34.1625 21.3375 34.5 21.75 34.5H23.25C23.6625 34.5 24 34.1625 24 33.75C24 33.3375 23.6625 33 23.25 33H21.75ZM26.25 33C25.8375 33 25.5 33.3375 25.5 33.75C25.5 34.1625 25.8375 34.5 26.25 34.5H27.75C28.1625 34.5 28.5 34.1625 28.5 33.75C28.5 33.3375 28.1625 33 27.75 33H26.25ZM30.75 33C30.3375 33 30 33.3375 30 33.75C30 34.1625 30.3375 34.5 30.75 34.5H32.25C32.6625 34.5 33 34.1625 33 33.75C33 33.3375 32.6625 33 32.25 33H30.75ZM24.375 27C24.375 26.5027 24.1775 26.0258 23.8258 25.6742C23.4742 25.3225 22.9973 25.125 22.5 25.125C22.0027 25.125 21.5258 25.3225 21.1742 25.6742C20.8225 26.0258 20.625 26.5027 20.625 27C20.625 27.4973 20.8225 27.9742 21.1742 28.3258C21.5258 28.6775 22.0027 28.875 22.5 28.875C22.9973 28.875 23.4742 28.6775 23.8258 28.3258C24.1775 27.9742 24.375 27.4973 24.375 27ZM31.5 28.875C31.9973 28.875 32.4742 28.6775 32.8258 28.3258C33.1775 27.9742 33.375 27.4973 33.375 27C33.375 26.5027 33.1775 26.0258 32.8258 25.6742C32.4742 25.3225 31.9973 25.125 31.5 25.125C31.0027 25.125 30.5258 25.3225 30.1742 25.6742C29.8225 26.0258 29.625 26.5027 29.625 27C29.625 27.4973 29.8225 27.9742 30.1742 28.3258C30.5258 28.6775 31.0027 28.875 31.5 28.875ZM14.25 25.5H15V34.5H14.25C13.0078 34.5 12 33.4922 12 32.25V27.75C12 26.5078 13.0078 25.5 14.25 25.5ZM39.75 25.5C40.9922 25.5 42 26.5078 42 27.75V32.25C42 33.4922 40.9922 34.5 39.75 34.5H39V25.5H39.75Z" fill="white" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_147_695">
                                        <path d="M12 15H42V39H12V15Z" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-white">AI Inventory Intelligence</h2>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        {/* Stock Status */}
                        <div className="bg-[#4b3f83] bg-opacity-10 rounded-lg p-5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 bg-teal-300 rounded-lg flex items-center justify-center">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M2 4H18V16H2V4Z" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M6 8V12" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M10 6V14" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M14 10V12" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-white">Stock Status</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-white text-opacity-80">Well-stocked items</span>
                                    <span className="text-base font-bold text-green-400">23 items</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-white text-opacity-80">Critical low stock</span>
                                    <span className="text-base font-bold text-red-400">5 items</span>
                                </div>
                                <div className="bg-red-500 bg-opacity-20 rounded px-3 py-2 mt-3">
                                    <div className="flex items-center gap-2">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <path d="M6 1L11 6L6 11L1 6L6 1Z" fill="white" />
                                        </svg>
                                        <span className="text-xs text-white">Salmon & tomatoes need restocking in 2 days</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dead Stock Alert */}
                        <div className="bg-[#4b3f83] bg-opacity-10 rounded-lg p-5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 bg-amber-600 rounded-lg flex items-center justify-center">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="2" />
                                        <path d="M8 4V8" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M8 12H8.01" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-white">Dead Stock Alert</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-white text-opacity-80">Value at risk</span>
                                    <span className="text-base font-bold text-yellow-400">{wastageCost}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-white text-opacity-80">Sitting unused</span>
                                    <span className="text-base font-bold text-yellow-400">30+ days</span>
                                </div>
                                <div className="bg-yellow-500 bg-opacity-20 rounded px-3 py-2 mt-3">
                                    <div className="flex items-center gap-2">
                                        <svg width="9" height="12" viewBox="0 0 9 12" fill="none">
                                            <path d="M0.375 0H8.625V12H0.375V0Z" fill="white" />
                                        </svg>
                                        <span className="text-xs text-white">Consider promotions for spices & oils</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Waste Insights */}
                        <div className="bg-[#4b3f83] bg-opacity-10 rounded-lg p-5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path d="M16 7L9 2L2 7V15C2 15.5 2.4 16 3 16H15C15.6 16 16 15.5 16 15V7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M7 16V9H11V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-white">Waste Insights</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-white text-opacity-80">Waste reduction</span>
                                    <span className="text-base font-bold text-green-400">-12%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-white text-opacity-80">Top waste category</span>
                                    <span className="text-base font-bold text-blue-400">{topWasteCategory}</span>
                                </div>
                                <div className="bg-blue-500 bg-opacity-20 rounded px-3 py-2 mt-3">
                                    <div className="flex items-center gap-2">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <path d="M6 1L11 6L6 11L1 6L6 1Z" fill="white" />
                                        </svg>
                                        <span className="text-xs text-white">18kg vegetables - optimize storage</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Inventory Metrics Cards */}
            <section className="mb-10 user-guide-inventory-insights-overview">
                <div className="grid grid-cols-3 gap-6">
                    {METRICS_DATA.map((metric, index) => (
                        <MetricCard key={index} {...metric} />
                    ))}
                </div>
            </section>

            {/* Anomaly Detection and Smart Notifications Section */}
            <section className="mb-10 user-guide-inventory-insights-smart-notifications">
                <div className="grid grid-cols-2 gap-6">
                    {/* Stock Anomaly Detection */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Stock Anomaly Detection</h3>
                            <div className="bg-red-100 px-3 py-1 rounded-full">
                                <span className="text-xs font-medium text-red-800">3 Anomalies</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {/* Unusual Consumption Spike */}
                            <div className="border-l-4 border-red-500 bg-red-50 pl-4 pr-4 py-4 rounded-r-lg">
                                <div className="flex items-start gap-3">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-1 flex-shrink-0">
                                        <path d="M8 1L15 8L8 15L1 8L8 1Z" fill="#DC2626" />
                                    </svg>
                                    <div>
                                        <h4 className="text-base font-medium text-red-900 mb-1">Unusual Consumption Spike</h4>
                                        <p className="text-sm text-red-700 mb-2">Salmon usage increased 340% yesterday vs normal consumption. Check for preparation errors or theft.</p>
                                        <p className="text-xs text-red-600">Detected 2 hours ago</p>
                                    </div>
                                </div>
                            </div>

                            {/* Irregular Stock Pattern */}
                            <div className="border-l-4 border-yellow-500 bg-yellow-50 pl-4 pr-4 py-4 rounded-r-lg">
                                <div className="flex items-start gap-3">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-1 flex-shrink-0">
                                        <path d="M2 8L8 2L14 8L8 14L2 8Z" fill="#CA8A04" />
                                    </svg>
                                    <div>
                                        <h4 className="text-base font-medium text-yellow-900 mb-1">Irregular Stock Pattern</h4>
                                        <p className="text-sm text-yellow-700 mb-2">Tomato inventory dropping faster than forecasted. Possible supplier quality issues.</p>
                                        <p className="text-xs text-yellow-600">Detected 5 hours ago</p>
                                    </div>
                                </div>
                            </div>

                            {/* Expiry Date Anomaly */}
                            <div className="border-l-4 border-orange-500 bg-orange-50 pl-4 pr-4 py-4 rounded-r-lg">
                                <div className="flex items-start gap-3">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-1 flex-shrink-0">
                                        <circle cx="8" cy="8" r="6" fill="#EA580C" />
                                        <path d="M8 4V8L11 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div>
                                        <h4 className="text-base font-medium text-orange-900 mb-1">Expiry Date Anomaly</h4>
                                        <p className="text-sm text-orange-700 mb-2">Multiple dairy products expiring sooner than expected. Review storage conditions.</p>
                                        <p className="text-xs text-orange-600">Detected 1 day ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Smart Notifications */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Smart Notifications</h3>
                        <div className="space-y-4">
                            {/* Reorder Suggestion */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <path d="M7 1V13M1 7H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-base font-medium text-blue-900 mb-1">Reorder Suggestion</h4>
                                        <p className="text-sm text-blue-700">Order 25kg salmon by tomorrow to avoid stockout</p>
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
                                        <h4 className="text-base font-medium text-green-900 mb-1">Cost Optimization</h4>
                                        <p className="text-sm text-green-700">Beef prices 12% lower this week - good time to stock up</p>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Optimization */}
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <path d="M1 7H13M7 1V13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-base font-medium text-purple-900 mb-1">Menu Optimization</h4>
                                        <p className="text-sm text-purple-700">Feature pasta dishes this week - high stock, low waste</p>
                                    </div>
                                </div>
                            </div>

                            {/* Expiry Alert */}
                            <div className="bg-yellow-50 border border-yellow-400 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <rect x="2" y="3" width="10" height="8" rx="1" stroke="white" strokeWidth="2" />
                                            <path d="M5 1V5M9 1V5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-base font-medium text-yellow-900 mb-1">Expiry Alert</h4>
                                        <p className="text-sm text-yellow-700">8 items expire within 3 days - plan special menu</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Charts Section */}
            <section className="mb-10">
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
