import React, { useState } from 'react';
import { colors } from '../styles/colors';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
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
        changeType: 'positive' | 'negative';
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
                    color: changeType === 'positive' ? '#10B981' : '#EF4444'
                }}>
                    <span>{changeType === 'positive' ? '↗' : '↘'}</span>
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
                            family: 'Inter',
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
                            family: 'Inter',
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
                            fontFamily: 'Inter',
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
                            fontFamily: 'Inter',
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
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
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

    return (
        <div className="home-page">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="home-main">
                {/* Header */}
                <Header
                    titleSection={{
                        title: "Orders & Insights",
                        badge: {
                            text: "Dashboard"
                        }
                    }}
                    showSearch={true}
                    showNotification={true}
                >
                    <div className="header-actions">

                    </div>
                </Header>

                {/* Content Sections */}
                <div className="home-content">
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

                            {/* Metrics Cards */}
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

                            {/* Charts Section */}
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
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
