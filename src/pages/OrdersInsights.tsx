import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { colors } from '../styles/colors';

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

export default function OrdersInsights() {
    const [activeTab, setActiveTab] = useState('Revenue');
    const navigate = useNavigate();

    // Data variables for backend integration
    const metricsData = {
        lastDaySales: {
            title: "Last Day Sales",
            value: "$8,247",
            change: "+12.5%",
            changeType: "positive" as const,
            description: "vs $7,330 yesterday",
            iconBg: "#DCFCE7",
            iconColor: "#16A34A"
        },
        wasteOnSales: {
            title: "Waste on Sales",
            value: "$324",
            change: "-2.1%",
            changeType: "negative" as const,
            description: "3.9% of total sales",
            iconBg: "#FEE2E2",
            iconColor: "#DC2626"
        },
        weeklyRevenue: {
            title: "Weekly Revenue",
            value: "$52,840",
            change: "+8.2%",
            changeType: "positive" as const,
            description: "Target: $55,000",
            iconBg: "rgba(124, 58, 237, 0.1)",
            iconColor: "#7C3AED"
        },
        aiForecastAccuracy: {
            title: "AI Forecast Accuracy",
            value: "94.2%",
            change: "+1.8%",
            changeType: "positive" as const,
            description: "Last 30 days average",
            iconBg: "#DBEAFE",
            iconColor: "#2563EB"
        }
    };

    const inventoryMetrics = {
        lastPurchaseCost: {
            title: "Last Raw Material Purchase Cost (7 weeks)",
            value: "$12,450.80",
            change: "+8.3%",
            changeType: "negative" as const,
            description: "higher than last period",
            iconBg: "#FEE2E2",
            iconColor: "#DC2626"
        },
        topCostlyItem: {
            title: "Top Costly Item",
            value: "Premium Beef",
            change: "0%",
            changeType: "neutral" as const,
            description: "$45.50 per kg",
            iconBg: "#FEF3C7",
            iconColor: "#CA8A04"
        },
        totalWastage: {
            title: "Total Wastage",
            value: "125.3 units",
            change: "-12%",
            changeType: "positive" as const,
            description: "less than last week",
            iconBg: "#DCFCE7",
            iconColor: "#16A34A"
        }
    };

    const salesVsForecastData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        actual: [1200, 1350, 1180, 1450, 1600, 1750, 1520],
        forecast: [1100, 1250, 1300, 1400, 1500, 1650, 1600]
    };

    const categoryDistributionData = {
        categories: [
            { label: 'Pizza', percentage: 32, color: '#5F63F2' },
            { label: 'Pasta', percentage: 24, color: '#10B981' },
            { label: 'Salads', percentage: 18, color: '#F59E0B' },
            { label: 'Drinks', percentage: 15, color: '#EF4444' },
            { label: 'Desserts', percentage: 11, color: '#3B82F6' }
        ]
    };

    const costProfitData = [
        { label: 'Margherita', profit: 8, cost: 5 },
        { label: 'Pepperoni', profit: 12, cost: 7 },
        { label: 'Carbonara', profit: 10, cost: 6 },
        { label: 'Caesar Salad', profit: 6, cost: 4 }
    ];

    const anomalyDetectionData = {
        labels: ['1. Jan', '2. Jan', '3. Jan', '4. Jan', '5. Jan', '6. Jan', '7. Jan', '8. Jan', '9. Jan', '10. Jan', '11. Jan', '12. Jan', '13. Jan', '14. Jan'],
        revenue: [8200, 8500, 7800, 9200, 8800, 8300, 9500, 7200, 8600, 8900, 8100, 10800, 8400, 7600],
        anomalies: [null, null, null, null, null, null, null, 7200, null, null, null, 10800, null, null]
    };

    const stockConsumptionData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
        actual: [850, 820, 780, 740, 695, 650, 600],
        forecast: [580, 540, 500, 460, 420, 380, 340]
    };

    const wastageBreakdown = {
        kg: { value: 45.2, unit: "KG", color: "#EF4444" },
        liters: { value: 22.8, unit: "L", color: "#F59E0B" },
        count: { value: 57, unit: "items", color: "#8B5CF6" }
    };

    const tabs = ['Revenue', 'Inventory', "Chef's Space", 'Prediction Engine'];

    // Icon components
    const TrendIcon = ({ type }: { type: 'positive' | 'negative' | 'neutral' }) => (
        <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
            <path
                d={type === 'positive' ? "M4.5 1L8 6H1L4.5 1Z" :
                    type === 'negative' ? "M4.5 13L8 8H1L4.5 13Z" :
                        "M1 7h6"}
                fill={type === 'positive' ? '#16A34A' :
                    type === 'negative' ? '#DC2626' : '#6B7280'}
            />
        </svg>
    );

    const SalesIcon = () => (
        <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
            <path d="M0.56 0h11.31v20H0.56V0z" fill="#16A34A" />
        </svg>
    );

    const WasteIcon = () => (
        <svg width="17" height="20" viewBox="0 0 17 20" fill="none">
            <path d="M0 0h17v20H0V0z" fill="#DC2626" />
        </svg>
    );

    const RevenueIcon = () => (
        <svg width="20" height="17" viewBox="0 0 20 17" fill="none">
            <path d="M0 1.25h20v15H0v-15z" fill="#7C3AED" />
        </svg>
    );

    const AIIcon = () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M0 0h20v20H0V0z" fill="#2563EB" />
        </svg>
    );

    // Helper functions
    const getIcon = (iconType: 'sales' | 'waste' | 'revenue' | 'ai') => {
        switch (iconType) {
            case 'sales': return <SalesIcon />;
            case 'waste': return <WasteIcon />;
            case 'revenue': return <RevenueIcon />;
            case 'ai': return <AIIcon />;
            default: return <SalesIcon />;
        }
    };

    // Component definitions
    const MetricCard = ({
        title,
        value,
        change,
        changeType,
        description,
        iconBg,
        iconType
    }: {
        title: string;
        value: string;
        change: string;
        changeType: 'positive' | 'negative' | 'neutral';
        description: string;
        iconBg: string;
        iconType: 'sales' | 'waste' | 'revenue' | 'ai';
    }) => {
        const changeColor = changeType === 'positive' ? 'text-green-600' :
            changeType === 'negative' ? 'text-red-600' : 'text-gray-500';

        return (
            <div className="bg-white rounded-xl p-5 pb-4 shadow-sm border border-gray-100 h-[180px] flex flex-col overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                <div className="flex justify-between items-start mb-3.5 flex-shrink-0">
                    <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ background: iconBg }}
                    >
                        {getIcon(iconType)}
                    </div>
                    <div className="flex items-center gap-1">
                        <TrendIcon type={changeType} />
                        <span className={`text-sm font-medium ${changeColor}`}>
                            {change}
                        </span>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-start min-h-0 overflow-hidden">
                    <div className="text-sm font-medium text-gray-600 mb-2 leading-tight line-clamp-2">
                        {title}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1.5 leading-tight flex-shrink-0">
                        {value}
                    </div>
                    <div className="text-xs text-gray-500 leading-tight line-clamp-2 flex-1">
                        {description}
                    </div>
                </div>
            </div>
        );
    };

    const WastageCard = ({
        type,
        value,
        unit,
        color
    }: {
        type: string;
        value: number;
        unit: string;
        color: string;
    }) => (
        <div
            className="bg-white rounded-xl p-6 text-center h-[140px] flex flex-col justify-center items-center border-2"
            style={{ borderColor: `${color}20` }}
        >
            <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
                style={{ background: `${color}20` }}
            >
                <div
                    className="w-5 h-5 rounded-full"
                    style={{ background: color }}
                />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2 leading-none">
                {value}
            </div>
            <div className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                {unit}
            </div>
        </div>
    );

    const InsightCard = ({
        title,
        description,
        bgColor,
        borderColor,
        titleColor,
        textColor,
        iconColor
    }: {
        title: string;
        description: string;
        bgColor: string;
        borderColor: string;
        titleColor: string;
        textColor: string;
        iconColor: string;
    }) => (
        <div
            className="rounded-lg p-3.5 border"
            style={{
                background: bgColor,
                borderColor: borderColor
            }}
        >
            <div className="flex items-start gap-3">
                <div
                    className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5"
                    style={{ background: iconColor }}
                />
                <div>
                    <h4
                        className="text-sm font-medium mb-1"
                        style={{ color: titleColor }}
                    >
                        {title}
                    </h4>
                    <p
                        className="text-xs leading-relaxed m-0"
                        style={{ color: textColor }}
                    >
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );

    // Chart components
    const SalesChart = () => {
        const salesData = {
            labels: salesVsForecastData.labels,
            datasets: [
                {
                    label: 'Actual Sales',
                    data: salesVsForecastData.actual,
                    borderColor: '#5F63F2',
                    backgroundColor: 'rgba(95, 99, 242, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0,
                    pointBackgroundColor: '#5F63F2',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 2,
                    pointRadius: 4
                },
                {
                    label: 'Forecast',
                    data: salesVsForecastData.forecast,
                    borderColor: '#E5E7EB',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.3,
                    pointBackgroundColor: '#E5E7EB',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }
            ]
        };

        const options = {
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
                    callbacks: {
                        label: function (context: any) {
                            return `${context.dataset.label}: $${context.parsed.y}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        color: '#6B7280',
                        font: { family: 'Lexend', size: 11 }
                    },
                    border: { display: false }
                },
                y: {
                    min: 1000,
                    max: 2000,
                    ticks: {
                        stepSize: 250,
                        color: '#6B7280',
                        font: { family: 'Lexend', size: 11 },
                        callback: function (value: any) {
                            return '$' + value;
                        }
                    },
                    grid: { color: '#E5E7EB', lineWidth: 1 },
                    border: { display: false }
                }
            }
        };

        return (
            <div className="h-[364px] w-full relative">
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
                    <h3 className="text-lg font-bold text-gray-900">
                        Sales vs Forecast
                    </h3>
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-[#5F63F2]" />
                                <span className="text-xs text-gray-600">Actual Sales</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-gray-300" />
                                <span className="text-xs text-gray-600">Forecast</span>
                            </div>
                        </div>
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button className="bg-white border-none rounded-md px-3 py-1 text-sm font-semibold text-[#5F63F2] cursor-pointer shadow-sm">
                                Weekly
                            </button>
                            <button className="bg-transparent border-none rounded-md px-3 py-1 text-sm text-gray-500 cursor-pointer">
                                Monthly
                            </button>
                        </div>
                    </div>
                </div>
                <div className="absolute top-[100px] left-6 right-6 bottom-6">
                    <Line data={salesData} options={options} />
                </div>
            </div>
        );
    };

    const PieChart = () => {
        const chartData = {
            labels: categoryDistributionData.categories.map(cat => cat.label),
            datasets: [
                {
                    data: categoryDistributionData.categories.map(cat => cat.percentage),
                    backgroundColor: categoryDistributionData.categories.map(cat => cat.color),
                    borderColor: '#FFFFFF',
                    borderWidth: 2,
                    cutout: '50%'
                }
            ]
        };

        const options = {
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
                    callbacks: {
                        label: function (context: any) {
                            return `${context.label}: ${context.parsed}%`;
                        }
                    }
                }
            }
        };

        return (
            <div className="w-full h-64 flex items-center justify-center relative">
                <div className="absolute left-0 top-0 w-[250px] h-64">
                    <Doughnut data={chartData} options={options} />
                </div>
                <div className="absolute right-0 bottom-0 w-[78px] space-y-4">
                    {categoryDistributionData.categories.map((item) => (
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
    };

    const BarChart = ({ data }: { data: Array<{ label: string; profit: number; cost: number }> }) => {
        const chartData = {
            labels: data.map(item => item.label),
            datasets: [
                {
                    label: 'Profit',
                    data: data.map(item => item.profit),
                    backgroundColor: '#10B981',
                    borderRadius: 2,
                },
                {
                    label: 'Material Cost',
                    data: data.map(item => item.cost),
                    backgroundColor: '#F59E0B',
                    borderRadius: 2,
                }
            ]
        };

        const options = {
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
                    callbacks: {
                        label: function (context: any) {
                            return `${context.dataset.label}: $${context.parsed.y}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#6B7280', font: { size: 11 } },
                    border: { display: false }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#6B7280',
                        font: { size: 11 },
                        callback: function (value: any) {
                            return '$' + value;
                        }
                    },
                    grid: { color: '#E5E7EB', lineWidth: 1 },
                    border: { display: false }
                }
            }
        };

        return (
            <div className="h-80 py-5">
                <div className="h-[220px] mb-5">
                    <Bar data={chartData} options={options} />
                </div>
                <div className="flex justify-center gap-5 mt-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
                        <span className="text-xs text-gray-900">Profit</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-amber-500 rounded-sm" />
                        <span className="text-xs text-gray-900">Material Cost</span>
                    </div>
                </div>
            </div>
        );
    };

    const AnomalyChart = () => {
        const chartData = {
            labels: anomalyDetectionData.labels,
            datasets: [
                {
                    label: 'Revenue',
                    data: anomalyDetectionData.revenue,
                    borderColor: '#7C3AED',
                    backgroundColor: 'rgba(124, 58, 237, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.1,
                    pointBackgroundColor: '#7C3AED',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 2,
                    pointRadius: 4
                },
                {
                    label: 'Anomalies',
                    data: anomalyDetectionData.anomalies,
                    borderColor: '#EF4444',
                    backgroundColor: '#EF4444',
                    borderWidth: 0,
                    fill: false,
                    pointBackgroundColor: '#EF4444',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 3,
                    pointRadius: 6,
                    showLine: false
                }
            ]
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#1F2937',
                    bodyColor: '#6B7280',
                    borderColor: '#E5E7EB',
                    borderWidth: 1,
                    borderRadius: 8,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: (context: any) => {
                            if (context.datasetIndex === 1 && context.raw !== null) {
                                return `Anomaly Detected: $${context.raw.toLocaleString()}`;
                            }
                            return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(156, 163, 175, 0.2)', borderDash: [2, 4] },
                    border: { display: false },
                    ticks: { color: '#9CA3AF', font: { size: 11 } }
                },
                y: {
                    beginAtZero: false,
                    min: 6000,
                    max: 13000,
                    grid: { color: 'rgba(156, 163, 175, 0.2)', borderDash: [2, 4] },
                    border: { display: false },
                    ticks: {
                        color: '#9CA3AF',
                        font: { size: 11 },
                        callback: function (value: any) {
                            return '$' + (value / 1000) + 'k';
                        }
                    }
                }
            }
        };

        return <Line data={chartData} options={options} />;
    };

    const StockConsumptionChart = () => {
        const chartData = {
            labels: stockConsumptionData.labels,
            datasets: [
                {
                    label: 'Actual Consumption',
                    data: stockConsumptionData.actual,
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#EF4444',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 2,
                    pointRadius: 5
                },
                {
                    label: 'Forecast Trend',
                    data: stockConsumptionData.forecast,
                    borderColor: '#F59E0B',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#F59E0B',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }
            ]
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top' as const,
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    backgroundColor: '#FFFFFF',
                    titleColor: '#111827',
                    bodyColor: '#6B7280',
                    borderColor: '#E5E7EB',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#6B7280', font: { size: 11 } }
                },
                y: {
                    beginAtZero: false,
                    min: 300,
                    ticks: {
                        color: '#6B7280',
                        font: { size: 11 },
                        callback: function (value: any) {
                            return value + ' units';
                        }
                    },
                    grid: { color: '#E5E7EB', lineWidth: 1 }
                }
            }
        };

        return <Line data={chartData} options={options} />;
    };

    const ChartCard = ({
        title,
        children,
        actions,
        className = ""
    }: {
        title: string;
        children: React.ReactNode;
        actions?: React.ReactNode;
        className?: string;
    }) => (
        <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-200 h-full ${className}`}>
            {title && (
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900 m-0">
                        {title}
                    </h3>
                    {actions}
                </div>
            )}
            {children}
        </div>
    );

    return (
        <div className="orders-insights-page w-full h-full">
            <section className="w-full flex flex-col min-h-fit">
                <div className="px-6 py-8 pb-16 bg-gray-50 w-full min-h-fit">
                    {/* Navigation Tabs */}
                    <div className="flex gap-2 mb-8 border-b border-gray-200 pb-2">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 border-none rounded-md text-sm font-semibold cursor-pointer transition-colors duration-200 ${activeTab === tab
                                    ? 'text-white'
                                    : 'bg-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                style={{
                                    background: activeTab === tab ? colors.primary : 'transparent',
                                    borderBottom: activeTab === tab ? `2px solid ${colors.primary}` : 'none'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Content based on active tab */}
                    {activeTab === 'Revenue' && (
                        <>
                            {/* Revenue Metrics Cards */}
                            <div className="grid grid-cols-4 gap-6 mb-10">
                                <MetricCard
                                    {...metricsData.lastDaySales}
                                    iconType="sales"
                                />
                                <MetricCard
                                    {...metricsData.wasteOnSales}
                                    iconType="waste"
                                />
                                <MetricCard
                                    {...metricsData.weeklyRevenue}
                                    iconType="revenue"
                                />
                                <MetricCard
                                    {...metricsData.aiForecastAccuracy}
                                    iconType="ai"
                                />
                            </div>

                            {/* Main Charts Section */}
                            <div className="grid grid-cols-[2fr_1fr] gap-6 mb-10">
                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm h-[400px]">
                                    <SalesChart />
                                </div>

                                {/* AI Revenue Insights */}
                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-[400px] flex flex-col">
                                    <div className="flex justify-between items-center mb-5">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            AI Revenue Insights
                                        </h3>
                                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                                            <AIIcon />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-5 flex-1 justify-between">
                                        <InsightCard
                                            title="Peak Hour Optimization"
                                            description="Lunch rush (12-2 PM) shows 15% higher revenue potential. Consider increasing staff during these hours."
                                            bgColor="#F0FDF4"
                                            borderColor="#BBF7D0"
                                            titleColor="#166534"
                                            textColor="#15803D"
                                            iconColor="#16A34A"
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
                                            description="Next week projected revenue: $58,200 (+10.1% vs this week). Weather forecast favorable."
                                            bgColor="#EFF6FF"
                                            borderColor="#BFDBFE"
                                            titleColor="#1E40AF"
                                            textColor="#1D4ED8"
                                            iconColor="#2563EB"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Charts Section */}
                            <div className="grid grid-cols-[2fr_1fr] gap-6 mb-10">
                                <ChartCard title="Cost vs Food Cost Analysis">
                                    <div className="flex justify-center gap-6 mb-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500" />
                                            <span className="text-sm text-gray-600">Total Cost</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-orange-600" />
                                            <span className="text-sm text-gray-600">Food Cost</span>
                                        </div>
                                    </div>
                                    <div className="h-80">
                                        <BarChart data={costProfitData} />
                                    </div>
                                </ChartCard>

                                <ChartCard
                                    title="Top Selling Categories"
                                    actions={
                                        <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white text-black">
                                            <option>This Week</option>
                                            <option>This Month</option>
                                            <option>This Quarter</option>
                                        </select>
                                    }
                                >
                                    <div className="h-80">
                                        <PieChart />
                                    </div>
                                </ChartCard>
                            </div>

                            {/* Revenue Anomaly Detection */}
                            <div className="mb-10">
                                <ChartCard title="">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex flex-col gap-2">
                                            <h3 className="text-lg font-semibold text-gray-900 m-0">
                                                Revenue Anomaly Detection
                                            </h3>
                                            <div className="bg-red-50 rounded-full px-3 py-1 inline-block text-xs font-medium text-red-800">
                                                2 Anomalies Detected
                                            </div>
                                        </div>
                                        <div className="flex gap-6 items-center">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-purple-600" />
                                                <span className="text-sm text-gray-600">Revenue</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                                <span className="text-sm text-gray-600">Anomalies</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-[400px]">
                                        <AnomalyChart />
                                    </div>
                                </ChartCard>
                            </div>
                        </>
                    )}

                    {activeTab === 'Inventory' && (
                        <>
                            <div className="mb-10 py-6">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Inventory Analytics
                                </h1>
                                <p className="text-base text-gray-600">
                                    Track your inventory costs, wastage, and consumption patterns
                                </p>
                            </div>

                            {/* Inventory Metrics Cards */}
                            <div className="grid grid-cols-3 gap-6 mb-10">
                                <MetricCard
                                    {...inventoryMetrics.lastPurchaseCost}
                                    iconType="waste"
                                />
                                <MetricCard
                                    {...inventoryMetrics.topCostlyItem}
                                    iconType="revenue"
                                />
                                <MetricCard
                                    {...inventoryMetrics.totalWastage}
                                    iconType="sales"
                                />
                            </div>

                            {/* Wastage Breakdown */}
                            <ChartCard title="Wastage Breakdown (All Types)" className="mb-10">
                                <div className="grid grid-cols-3 gap-5">
                                    <WastageCard
                                        type="Weight"
                                        value={wastageBreakdown.kg.value}
                                        unit={wastageBreakdown.kg.unit}
                                        color={wastageBreakdown.kg.color}
                                    />
                                    <WastageCard
                                        type="Volume"
                                        value={wastageBreakdown.liters.value}
                                        unit={wastageBreakdown.liters.unit}
                                        color={wastageBreakdown.liters.color}
                                    />
                                    <WastageCard
                                        type="Count"
                                        value={wastageBreakdown.count.value}
                                        unit={wastageBreakdown.count.unit}
                                        color={wastageBreakdown.count.color}
                                    />
                                </div>
                            </ChartCard>

                            {/* Main Charts Section */}
                            <div className="grid grid-cols-[2fr_1fr] gap-6 mb-10">
                                <ChartCard title="Stock Consumption Trend & Forecast">
                                    <div className="h-80">
                                        <StockConsumptionChart />
                                    </div>
                                </ChartCard>

                                <ChartCard title="Stock Availability Status">
                                    <div className="h-80">
                                        <div className="flex items-center justify-center h-full text-gray-500">
                                            Stock Availability Chart
                                        </div>
                                    </div>
                                </ChartCard>
                            </div>
                        </>
                    )}

                    {activeTab === "Chef's Space" && (
                        <div className="flex items-center justify-center h-64 text-gray-500">
                            Chef's Space content coming soon...
                        </div>
                    )}

                    {activeTab === 'Prediction Engine' && (
                        <div className="flex items-center justify-center h-64 text-gray-500">
                            Prediction Engine content coming soon...
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
