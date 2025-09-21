import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { colors } from '../styles/colors';
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
            <aside className="home-sidebar">
                {/* Brand Section */}
                <div className="sidebar-brand">
                    <div className="brand-icon">
                        <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
                            <path d="M8 0L8 18M0 9L16 9M2 4L14 4M2 14L14 14" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div className="brand-text">Reztro</div>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    <Link to="/home" className="nav-item">
                        <div className="nav-icon">
                            <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
                                <path d="M2 16H18M2 16V8L10 2L18 8V16M2 16H6M18 16H14M6 16V12H14V16M6 16H14" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="nav-text">Home</div>
                    </Link>

                    <Link to="/inventory" className="nav-item">
                        <div className="nav-icon">
                            <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
                                <path d="M3 3H17L15 13H5L3 3ZM3 3L2 1H1M7 17C7.55228 17 8 16.5523 8 16C8 15.4477 7.55228 15 7 15C6.44772 15 6 15.4477 6 16C6 16.5523 6.44772 17 7 17ZM15 17C15.5523 17 16 16.5523 16 16C16 15.4477 15.5523 15 15 15C14.4477 15 14 15.4477 14 16C14 16.5523 14.4477 17 15 17Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="nav-text">Inventory Dashboard</div>
                    </Link>

                    <div className="nav-item active">
                        <div className="nav-icon">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M9 1V17M1 9H17M13 5L5 13M5 5L13 13" stroke="#5F63F2" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div className="nav-text">Orders & Insights</div>
                    </div>

                    <div className="nav-item">
                        <div className="nav-icon">
                            <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
                                <path d="M3 7H17L15 17H5L3 7ZM3 7L2 1H1M12 7V5C12 3.89543 11.1046 3 10 3C8.89543 3 8 3.89543 8 5V7" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="nav-text">Inventory Usage</div>
                    </div>

                    <Link to="/chefspace" className="nav-item">
                        <div className="nav-icon">
                            <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
                                <path d="M10 1L3 5V11C3 14.866 6.134 18 10 18C13.866 18 17 14.866 17 11V5L10 1Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="nav-text">Chef Space</div>
                    </Link>
                </nav>

                {/* User Profile Section */}
                <div className="sidebar-bottom">
                    <div className="user-profile">
                        <img
                            src="https://dummyimage.com/40x40/6366F1/ffffff&text=AM"
                            alt="Anna Miller"
                            className="user-avatar"
                        />
                        <div className="user-info">
                            <div className="user-name">Anna Miller</div>
                            <div className="user-role">Store Manager</div>
                        </div>
                        <button className="user-menu-btn">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 9C8.55228 9 9 8.55228 9 8C9 7.44772 8.55228 7 8 7C7.44772 7 7 7.44772 7 8C7 8.55228 7.44772 9 8 9ZM8 4C8.55228 4 9 3.55228 9 3C9 2.44772 8.55228 2 8 2C7.44772 2 7 2.44772 7 3C7 3.55228 7.44772 4 8 4ZM8 14C8.55228 14 9 13.5523 9 13C9 12.4477 8.55228 12 8 12C7.44772 12 7 12.4477 7 13C7 13.5523 7.44772 14 8 14Z" fill="#6B7280" />
                            </svg>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="home-main">
                {/* Header */}
                <header className="home-header">
                    <div className="header-left">
                        <h1 className="header-title">Orders & Insights</h1>
                        <p className="header-subtitle">Comprehensive analytics and order management dashboard.</p>
                    </div>
                    <div className="header-right">
                        <div className="search-container">
                            <div className="search-icon">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#6B7280" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M14 14L11.1 11.1" stroke="#6B7280" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="search-input"
                            />
                        </div>
                        <button className="notification-btn">
                            <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                                <path d="M13 6C13 4.67392 12.4732 3.40215 11.5355 2.46447C10.5979 1.52678 9.32608 1 8 1C6.67392 1 5.40215 1.52678 4.46447 2.46447C3.52678 3.40215 3 4.67392 3 6C3 13 0 15 0 15H16C16 15 13 13 13 6Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9.73 19C9.5542 19.3031 9.3019 19.5547 8.99827 19.7295C8.69465 19.9044 8.35025 19.9965 8 19.9965C7.64975 19.9965 7.30535 19.9044 7.00173 19.7295C6.6981 19.5547 6.4458 19.3031 6.27 19" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="notification-badge"></span>
                        </button>
                        <button className="profile-btn">
                            <img
                                src="https://dummyimage.com/36x36/6366F1/ffffff&text=AM"
                                alt="Anna Miller"
                                className="profile-avatar"
                            />
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M3 4.5L6 7.5L9 4.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </header>

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
