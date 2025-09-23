import React, { useState } from 'react';
import { colors } from '../styles/colors';
import { useNavigate } from 'react-router-dom';
// Layout provides Header and Sidebar
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

    const tabs = ['Revenue', 'Inventory', "Chef's Space", 'Prediction Engine'];

    // Data variables for backend integration
    const metricsData = {
        totalSales: {
            title: "Total Sales (Last 24h)",
            value: "$1,280.50",
            change: "5.2% vs yesterday",
            changeType: "positive" as const,
            icon: "💰",
            iconBg: "#DCFCE7"
        },
        topCategory: {
            title: "Top Seller Category",
            value: "Pizza",
            change: "32% of total sales",
            changeType: "positive" as const,
            icon: "🍕",
            iconBg: "#F3E8FF"
        },
        wastage: {
            title: "Loss on Wastage",
            value: "$45.12",
            change: "2.1% higher than average",
            changeType: "negative" as const,
            icon: "⚠️",
            iconBg: "#FEE2E2"
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

    const forecastData = {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
        ingredients: [
            { name: 'Dough', data: [75, 82, 68, 90, 85, 78, 92], color: colors.primary },
            { name: 'Tomatoes', data: [65, 72, 58, 80, 75, 68, 82], color: '#EF4444' },
            { name: 'Cheese', data: [50, 58, 45, 65, 60, 53, 68], color: '#F59E0B' }
        ]
    };

    // Inventory Insights Data
    const inventoryMetrics = {
        lastPurchaseCost: {
            title: "Last Raw Material Purchase Cost (7 weeks)",
            value: "$12,450.80",
            change: "8.3% higher than last period",
            changeType: "negative" as const,
            icon: "🛒",
            iconBg: "#FEE2E2"
        },
        topCostlyItem: {
            title: "Top Costly Item",
            value: "Premium Beef",
            change: "$45.50 per kg",
            changeType: "neutral" as const,
            icon: "💰",
            iconBg: "#FEF3C7"
        },
        totalWastage: {
            title: "Total Wastage",
            value: "125.3 units",
            change: "12% less than last week",
            changeType: "positive" as const,
            icon: "⚠️",
            iconBg: "#DCFCE7"
        }
    };

    const wastageBreakdown = {
        kg: { value: 45.2, unit: "KG", color: "#EF4444" },
        liters: { value: 22.8, unit: "L", color: "#F59E0B" },
        count: { value: 57, unit: "items", color: "#8B5CF6" }
    };

    // Stock consumption data (declining trend)
    const stockConsumptionData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
        actual: [850, 820, 780, 740, 695, 650, 600],
        forecast: [580, 540, 500, 460, 420, 380, 340]
    };

    // Stock availability donut chart data
    const stockAvailabilityData = {
        categories: [
            { label: 'Good Stock', percentage: 45, color: '#10B981' },
            { label: 'Low Stock', percentage: 30, color: '#F59E0B' },
            { label: 'Critical', percentage: 15, color: '#EF4444' },
            { label: 'Out of Stock', percentage: 10, color: '#6B7280' }
        ]
    };

    // Cost per item over previous purchases
    const costPerItemData = [
        { label: 'Purchase 1', beefPrice: 38, chickenPrice: 15, fishPrice: 25 },
        { label: 'Purchase 2', beefPrice: 40, chickenPrice: 16, fishPrice: 26 },
        { label: 'Purchase 3', beefPrice: 42, chickenPrice: 16.5, fishPrice: 27 },
        { label: 'Purchase 4', beefPrice: 43, chickenPrice: 17, fishPrice: 28 },
        { label: 'Purchase 5', beefPrice: 45, chickenPrice: 18, fishPrice: 29 },
        { label: 'Purchase 6', beefPrice: 45.5, chickenPrice: 18.5, fishPrice: 30 },
        { label: 'Purchase 7', beefPrice: 46, chickenPrice: 19, fishPrice: 31 },
        { label: 'Purchase 8', beefPrice: 47, chickenPrice: 19.5, fishPrice: 32 },
        { label: 'Purchase 9', beefPrice: 48, chickenPrice: 20, fishPrice: 33 },
        { label: 'Purchase 10', beefPrice: 49, chickenPrice: 21, fishPrice: 34 }
    ];

    // AI Inventory Forecast data
    const aiInventoryForecastData = {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
        ingredients: [
            { name: 'Tomatoes', data: [120, 110, 95, 85, 70, 60, 45], color: '#EF4444' },
            { name: 'Lettuce', data: [80, 75, 68, 60, 52, 45, 35], color: '#10B981' },
            { name: 'Onions', data: [150, 140, 125, 110, 95, 80, 65], color: '#F59E0B' },
            { name: 'Beef', data: [60, 55, 48, 42, 35, 28, 20], color: '#8B5CF6' }
        ]
    };

    const MetricCard = ({
        title,
        value,
        change,
        changeType,
        icon,
        iconBg
    }: {
        title: string;
        value: string;
        change: string;
        changeType: 'positive' | 'negative' | 'neutral';
        icon: string;
        iconBg: string;
    }) => (
        <div style={{
            background: 'white',
            borderRadius: 16,
            padding: 24,
            boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
            border: '1px solid #E5E7EB'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 16
            }}>
                <span style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#6B7280'
                }}>
                    {title}
                </span>
                <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16
                }}>
                    {icon}
                </div>
            </div>
            <div>
                <div style={{
                    fontSize: 36,
                    fontWeight: 700,
                    color: '#111827',
                    marginBottom: 8
                }}>
                    {value}
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 12,
                    fontWeight: 600,
                    color: changeType === 'positive' ? '#10B981' :
                        changeType === 'negative' ? '#EF4444' : '#6B7280'
                }}>
                    <span>
                        {changeType === 'positive' ? '↗' :
                            changeType === 'negative' ? '↘' : '→'}
                    </span>
                    {change}
                </div>
            </div>
        </div>
    );

    const ChartCard = ({
        title,
        children,
        actions
    }: {
        title: string;
        children: React.ReactNode;
        actions?: React.ReactNode;
    }) => (
        <div style={{
            background: 'white',
            borderRadius: 16,
            padding: 24,
            boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
            border: '1px solid #E5E7EB',
            height: '100%'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24
            }}>
                <h3 style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#111827',
                    margin: 0
                }}>
                    {title}
                </h3>
                {actions}
            </div>
            {children}
        </div>
    );

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
                legend: {
                    display: false
                },
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
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#6B7280',
                        font: {
                            family: 'Lexend',
                            size: 11
                        }
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    min: 1000,
                    max: 2000,
                    ticks: {
                        stepSize: 250,
                        color: '#6B7280',
                        font: {
                            family: 'Lexend',
                            size: 11
                        },
                        callback: function (value: any) {
                            return '$' + value;
                        }
                    },
                    grid: {
                        color: '#E5E7EB',
                        lineWidth: 1
                    },
                    border: {
                        display: false
                    }
                }
            },
            elements: {
                point: {
                    hoverRadius: 6
                }
            }
        };

        return (
            <div style={{
                height: 356,
                width: '100%',
                position: 'relative'
            }}>
                {/* Header with toggle buttons */}
                <div style={{
                    position: 'absolute',
                    top: 24,
                    left: 24,
                    right: 24,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: 36,
                    zIndex: 10
                }}>
                    <h3 style={{
                        fontSize: 18,
                        fontWeight: 700,
                        fontFamily: 'Inter',
                        color: '#111827',
                        margin: 0
                    }}>
                        Sales vs Forecast
                    </h3>
                    <div style={{
                        display: 'flex',
                        background: '#F3F4F6',
                        borderRadius: 8,
                        padding: 4
                    }}>
                        <button style={{
                            background: '#FFFFFF',
                            border: 'none',
                            borderRadius: 6,
                            padding: '5px 12px',
                            fontSize: 14,
                            fontWeight: 600,
                            fontFamily: 'Lexend',
                            color: '#5F63F2',
                            cursor: 'pointer',
                            boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)'
                        }}>
                            Weekly
                        </button>
                        <button style={{
                            background: 'transparent',
                            border: 'none',
                            borderRadius: 6,
                            padding: '5px 12px',
                            fontSize: 14,
                            fontWeight: 400,
                            fontFamily: 'Lexend',
                            color: '#6B7280',
                            cursor: 'pointer'
                        }}>
                            Monthly
                        </button>
                    </div>
                </div>

                {/* Chart container */}
                <div style={{
                    position: 'absolute',
                    top: 76,
                    left: 24,
                    right: 24,
                    bottom: 24
                }}>
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
                legend: {
                    display: false
                },
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
            },
            elements: {
                arc: {
                    borderWidth: 2
                }
            }
        };

        const legendData = categoryDistributionData.categories;

        return (
            <div style={{
                width: '100%',
                height: 256,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
            }}>
                {/* Chart container */}
                <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 250,
                    height: 256
                }}>
                    <Doughnut data={chartData} options={options} />
                </div>

                {/* Legend */}
                <div style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    gap: 16,
                    width: 78
                }}>
                    {legendData.map((item) => (
                        <div key={item.label} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                        }}>
                            <div style={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                background: item.color,
                                flexShrink: 0
                            }} />
                            <span style={{
                                fontSize: 12,
                                fontFamily: 'Inter',
                                fontWeight: 400,
                                color: '#111827',
                                lineHeight: '15px'
                            }}>
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
                    borderColor: '#10B981',
                    borderWidth: 1,
                    borderRadius: 2,
                    borderSkipped: false,
                },
                {
                    label: 'Material Cost',
                    data: data.map(item => item.cost),
                    backgroundColor: '#F59E0B',
                    borderColor: '#F59E0B',
                    borderWidth: 1,
                    borderRadius: 2,
                    borderSkipped: false,
                }
            ]
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
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
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#6B7280',
                        font: {
                            family: 'Lexend',
                            size: 11
                        }
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#6B7280',
                        font: {
                            family: 'Lexend',
                            size: 11
                        },
                        callback: function (value: any) {
                            return '$' + value;
                        }
                    },
                    grid: {
                        color: '#E5E7EB',
                        lineWidth: 1
                    },
                    border: {
                        display: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index' as const
            }
        };

        return (
            <div style={{ height: 320, padding: '20px 0' }}>
                <div style={{ height: 220, marginBottom: 20 }}>
                    <Bar data={chartData} options={options} />
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 20,
                    marginTop: 16
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 12, height: 12, background: '#10B981', borderRadius: 2 }} />
                        <span style={{ fontSize: 12, color: '#111827' }}>Profit</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 12, height: 12, background: '#F59E0B', borderRadius: 2 }} />
                        <span style={{ fontSize: 12, color: '#111827' }}>Material Cost</span>
                    </div>
                </div>
            </div>
        );
    };

    const ForecastChart = () => {
        const chartData = {
            labels: forecastData.labels,
            datasets: forecastData.ingredients.map(ingredient => ({
                label: ingredient.name,
                data: ingredient.data,
                backgroundColor: ingredient.color,
                borderColor: ingredient.color,
                borderWidth: 1,
                borderRadius: 2,
                borderSkipped: false,
            }))
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
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
                            return `${context.dataset.label}: ${context.parsed.y} units`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#6B7280',
                        font: {
                            family: 'Inter',
                            size: 11
                        }
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#6B7280',
                        font: {
                            family: 'Inter',
                            size: 11
                        },
                        callback: function (value: any) {
                            return value + ' units';
                        }
                    },
                    grid: {
                        color: '#E5E7EB',
                        lineWidth: 1
                    },
                    border: {
                        display: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index' as const
            }
        };

        return (
            <div style={{ height: 320, padding: '20px 0' }}>
                <div style={{ height: 220, marginBottom: 20 }}>
                    <Bar data={chartData} options={options} />
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 16,
                    marginTop: 16
                }}>
                    {forecastData.ingredients.map(item => (
                        <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: item.color
                            }} />
                            <span style={{ fontSize: 12, color: '#111827' }}>{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Inventory-specific components
    const WastageCard = ({ type, value, unit, color }: { type: string; value: number; unit: string; color: string }) => (
        <div style={{
            background: 'white',
            borderRadius: 12,
            padding: 20,
            border: `2px solid ${color}20`,
            textAlign: 'center'
        }}>
            <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: `${color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
            }}>
                <div style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: color
                }} />
            </div>
            <div style={{
                fontSize: 24,
                fontWeight: 700,
                color: '#111827',
                marginBottom: 4
            }}>
                {value}
            </div>
            <div style={{
                fontSize: 12,
                color: '#6B7280',
                textTransform: 'uppercase',
                fontWeight: 600
            }}>
                {unit}
            </div>
        </div>
    );

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
                        font: {
                            family: 'Lexend',
                            size: 12
                        }
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
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#6B7280',
                        font: {
                            family: 'Lexend',
                            size: 11
                        }
                    }
                },
                y: {
                    beginAtZero: false,
                    min: 300,
                    ticks: {
                        color: '#6B7280',
                        font: {
                            family: 'Lexend',
                            size: 11
                        },
                        callback: function (value: any) {
                            return value + ' units';
                        }
                    },
                    grid: {
                        color: '#E5E7EB',
                        lineWidth: 1
                    }
                }
            }
        };

        return <Line data={chartData} options={options} />;
    };

    const StockAvailabilityDonut = () => {
        const chartData = {
            labels: stockAvailabilityData.categories.map(cat => cat.label),
            datasets: [
                {
                    data: stockAvailabilityData.categories.map(cat => cat.percentage),
                    backgroundColor: stockAvailabilityData.categories.map(cat => cat.color),
                    borderColor: '#FFFFFF',
                    borderWidth: 3,
                    cutout: '60%'
                }
            ]
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
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
            <div style={{
                width: '100%',
                height: 256,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 250,
                    height: 256
                }}>
                    <Doughnut data={chartData} options={options} />
                </div>

                <div style={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                    width: 100
                }}>
                    {stockAvailabilityData.categories.map((item) => (
                        <div key={item.label} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                        }}>
                            <div style={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                background: item.color,
                                flexShrink: 0
                            }} />
                            <span style={{
                                fontSize: 11,
                                fontFamily: 'Lexend',
                                fontWeight: 400,
                                color: '#111827',
                                lineHeight: '13px'
                            }}>
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const CostPerItemChart = () => {
        const chartData = {
            labels: costPerItemData.map(item => item.label),
            datasets: [
                {
                    label: 'Beef Price ($/kg)',
                    data: costPerItemData.map(item => item.beefPrice),
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.3,
                    pointBackgroundColor: '#EF4444',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 2,
                    pointRadius: 4
                },
                {
                    label: 'Chicken Price ($/kg)',
                    data: costPerItemData.map(item => item.chickenPrice),
                    borderColor: '#F59E0B',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.3,
                    pointBackgroundColor: '#F59E0B',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 2,
                    pointRadius: 4
                },
                {
                    label: 'Fish Price ($/kg)',
                    data: costPerItemData.map(item => item.fishPrice),
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.3,
                    pointBackgroundColor: '#3B82F6',
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
                        font: {
                            family: 'Lexend',
                            size: 12
                        }
                    }
                },
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
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#6B7280',
                        font: {
                            family: 'Lexend',
                            size: 11
                        }
                    }
                },
                y: {
                    beginAtZero: false,
                    ticks: {
                        color: '#6B7280',
                        font: {
                            family: 'Lexend',
                            size: 11
                        },
                        callback: function (value: any) {
                            return '$' + value;
                        }
                    },
                    grid: {
                        color: '#E5E7EB',
                        lineWidth: 1
                    }
                }
            }
        };

        return <Line data={chartData} options={options} />;
    };

    const AIInventoryForecastChart = () => {
        const chartData = {
            labels: aiInventoryForecastData.labels,
            datasets: aiInventoryForecastData.ingredients.map(ingredient => ({
                label: ingredient.name,
                data: ingredient.data,
                backgroundColor: ingredient.color,
                borderColor: ingredient.color,
                borderWidth: 1,
                borderRadius: 2,
                borderSkipped: false,
            }))
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom' as const,
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: {
                            family: 'Lexend',
                            size: 11
                        }
                    }
                },
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
                            return `${context.dataset.label}: ${context.parsed.y} units`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#6B7280',
                        font: {
                            family: 'Lexend',
                            size: 11
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#6B7280',
                        font: {
                            family: 'Lexend',
                            size: 11
                        },
                        callback: function (value: any) {
                            return value + ' units';
                        }
                    },
                    grid: {
                        color: '#E5E7EB',
                        lineWidth: 1
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index' as const
            }
        };

        return <Bar data={chartData} options={options} />;
    };

    return (
        <>
            {/* Content Sections */}
            <>
                <section className="dashboard-section">
                    <div style={{
                        padding: 32,
                        background: '#F9FAFB',
                        minHeight: 'calc(100vh - 200px)'
                    }}>

                        {/* Navigation Tabs */}
                        <div style={{
                            display: 'flex',
                            gap: 8,
                            marginBottom: 32,
                            borderBottom: '1px solid #E5E7EB',
                            paddingBottom: 8
                        }}>
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        padding: '8px 16px',
                                        border: 'none',
                                        background: activeTab === tab ? colors.primary : 'transparent',
                                        color: activeTab === tab ? 'white' : '#6B7280',
                                        borderRadius: 6,
                                        fontSize: 14,
                                        fontWeight: 600,
                                        cursor: 'pointer',
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
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: 24,
                                    marginBottom: 32
                                }}>
                                    <MetricCard
                                        title={metricsData.totalSales.title}
                                        value={metricsData.totalSales.value}
                                        change={metricsData.totalSales.change}
                                        changeType={metricsData.totalSales.changeType}
                                        icon={metricsData.totalSales.icon}
                                        iconBg={metricsData.totalSales.iconBg}
                                    />
                                    <MetricCard
                                        title={metricsData.topCategory.title}
                                        value={metricsData.topCategory.value}
                                        change={metricsData.topCategory.change}
                                        changeType={metricsData.topCategory.changeType}
                                        icon={metricsData.topCategory.icon}
                                        iconBg={metricsData.topCategory.iconBg}
                                    />
                                    <MetricCard
                                        title={metricsData.wastage.title}
                                        value={metricsData.wastage.value}
                                        change={metricsData.wastage.change}
                                        changeType={metricsData.wastage.changeType}
                                        icon={metricsData.wastage.icon}
                                        iconBg={metricsData.wastage.iconBg}
                                    />
                                </div>
                            </>
                        )}

                        {activeTab === 'Inventory' && (
                            <>
                                {/* Inventory Metrics Cards */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: 24,
                                    marginBottom: 32
                                }}>
                                    <MetricCard
                                        title={inventoryMetrics.lastPurchaseCost.title}
                                        value={inventoryMetrics.lastPurchaseCost.value}
                                        change={inventoryMetrics.lastPurchaseCost.change}
                                        changeType={inventoryMetrics.lastPurchaseCost.changeType}
                                        icon={inventoryMetrics.lastPurchaseCost.icon}
                                        iconBg={inventoryMetrics.lastPurchaseCost.iconBg}
                                    />
                                    <MetricCard
                                        title={inventoryMetrics.topCostlyItem.title}
                                        value={inventoryMetrics.topCostlyItem.value}
                                        change={inventoryMetrics.topCostlyItem.change}
                                        changeType={inventoryMetrics.topCostlyItem.changeType}
                                        icon={inventoryMetrics.topCostlyItem.icon}
                                        iconBg={inventoryMetrics.topCostlyItem.iconBg}
                                    />
                                    <MetricCard
                                        title={inventoryMetrics.totalWastage.title}
                                        value={inventoryMetrics.totalWastage.value}
                                        change={inventoryMetrics.totalWastage.change}
                                        changeType={inventoryMetrics.totalWastage.changeType}
                                        icon={inventoryMetrics.totalWastage.icon}
                                        iconBg={inventoryMetrics.totalWastage.iconBg}
                                    />
                                </div>

                                {/* Wastage Breakdown */}
                                <div style={{
                                    background: 'white',
                                    borderRadius: 16,
                                    padding: 24,
                                    boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
                                    border: '1px solid #E5E7EB',
                                    marginBottom: 32
                                }}>
                                    <h3 style={{
                                        fontSize: 18,
                                        fontWeight: 700,
                                        color: '#111827',
                                        margin: '0 0 20px 0'
                                    }}>
                                        Wastage Breakdown (All Types)
                                    </h3>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(3, 1fr)',
                                        gap: 20
                                    }}>
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
                                </div>
                            </>
                        )}

                        {/* Charts Section - Revenue Tab */}
                        {activeTab === 'Revenue' && (
                            <>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '2fr 1fr',
                                    gap: 24,
                                    marginBottom: 32
                                }}>
                                    <div style={{
                                        background: 'white',
                                        borderRadius: 16,
                                        border: '1px solid #E5E7EB',
                                        boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)'
                                    }}>
                                        <SalesChart />
                                    </div>

                                    <ChartCard
                                        title="Top Selling Categories"
                                        actions={
                                            <button style={{
                                                border: 'none',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                                padding: 4
                                            }}>
                                                ⋯
                                            </button>
                                        }
                                    >
                                        <PieChart />
                                    </ChartCard>
                                </div>

                                {/* Analytics Section */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: 24
                                }}>
                                    <ChartCard
                                        title="Cost vs. Profit Analysis"
                                        actions={
                                            <button style={{
                                                border: 'none',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                                padding: 4
                                            }}>
                                                ⋯
                                            </button>
                                        }
                                    >
                                        <BarChart data={costProfitData} />
                                    </ChartCard>

                                    <ChartCard
                                        title="AI Inventory Forecast"
                                        actions={
                                            <button style={{
                                                padding: '8px 12px',
                                                border: 'none',
                                                background: colors.primary,
                                                color: 'white',
                                                borderRadius: 6,
                                                fontSize: 12,
                                                cursor: 'pointer'
                                            }}>
                                                🤖 AI
                                            </button>
                                        }
                                    >
                                        <div style={{ marginBottom: 16 }}>
                                            <p style={{
                                                fontSize: 12,
                                                color: '#6B7280',
                                                margin: 0
                                            }}>
                                                Predicted demand for key ingredients for the next 7 days.
                                            </p>
                                        </div>
                                        <ForecastChart />
                                    </ChartCard>
                                </div>
                            </>
                        )}

                        {/* Charts Section - Inventory Tab */}
                        {activeTab === 'Inventory' && (
                            <>
                                {/* Main Charts Section */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '2fr 1fr',
                                    gap: 24,
                                    marginBottom: 32
                                }}>
                                    <ChartCard title="Stock Consumption Trend & Forecast">
                                        <div style={{ height: 300 }}>
                                            <StockConsumptionChart />
                                        </div>
                                    </ChartCard>

                                    <ChartCard title="Stock Availability Status">
                                        <StockAvailabilityDonut />
                                    </ChartCard>
                                </div>

                                {/* Bottom Charts Section */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: 24
                                }}>
                                    <ChartCard
                                        title="Cost per Item (Last 10 Purchases)"
                                        actions={
                                            <div style={{
                                                display: 'flex',
                                                gap: 8
                                            }}>
                                                <span style={{
                                                    fontSize: 12,
                                                    color: '#6B7280',
                                                    fontWeight: 500
                                                }}>
                                                    Price trend analysis
                                                </span>
                                            </div>
                                        }
                                    >
                                        <div style={{ height: 300 }}>
                                            <CostPerItemChart />
                                        </div>
                                    </ChartCard>

                                    <ChartCard
                                        title="AI Inventory Forecast"
                                        actions={
                                            <button style={{
                                                padding: '8px 12px',
                                                border: 'none',
                                                background: colors.primary,
                                                color: 'white',
                                                borderRadius: 6,
                                                fontSize: 12,
                                                cursor: 'pointer'
                                            }}>
                                                🤖 AI
                                            </button>
                                        }
                                    >
                                        <div style={{ marginBottom: 16 }}>
                                            <p style={{
                                                fontSize: 12,
                                                color: '#6B7280',
                                                margin: 0
                                            }}>
                                                Predicted consumption for key ingredients for the next 7 days.
                                            </p>
                                        </div>
                                        <div style={{ height: 280 }}>
                                            <AIInventoryForecastChart />
                                        </div>
                                    </ChartCard>
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </>
        </>
    );
}
