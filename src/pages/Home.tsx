import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function HomePage() {
  // Data variables for backend integration
  const metricsData = {
    ordersServed: {
      label: "ORDERS SERVED",
      value: "127",
      trend: {
        icon: "↗",
        text: "+15% vs yesterday",
        positive: true
      }
    },
    peakHours: {
      label: "PEAK HOURS",
      value: "12-2PM | 7-9PM",
      description: "85% of daily orders"
    },
    topCategories: {
      label: "TOP CATEGORIES",
      value: "Pizza & Pasta",
      description: "56% of total revenue"
    },
    revenueImpact: {
      label: "REVENUE IMPACT",
      value: "₹2,847",
      trend: {
        icon: "↗",
        text: "+12.5% growth",
        positive: true
      }
    }
  };

  const revenueByCategory = {
    total: 7000,
    categories: [
      { label: 'Pizza', percentage: 40, amount: 2800, color: '#5F63F2' },
      { label: 'Burgers', percentage: 31, amount: 2200, color: '#10B981' },
      { label: 'Drinks', percentage: 17, amount: 1200, color: '#F59E0B' },
      { label: 'Salads', percentage: 11, amount: 800, color: '#EF4444' }
    ]
  };

  const revenueTrend = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [2400, 2800, 2200, 3200, 3600, 4200, 3800]
  };

  const topOrdersToday = [
    { name: 'Margherita Pizza', value: 312, colorClass: 'red' },
    { name: 'Pasta Carbonara', value: 234, colorClass: 'yellow' },
    { name: 'Caesar Salad', value: 180, colorClass: 'green' }
  ];

  const stockAlerts = [
    {
      title: 'Mozzarella Cheese',
      description: 'Only 2.5kg remaining',
      severity: 'critical' as const
    },
    {
      title: 'Tomato Sauce',
      description: '5.2L remaining',
      severity: 'warning' as const
    },
    {
      title: 'Fresh Basil',
      description: '0.8kg remaining',
      severity: 'warning' as const
    }
  ];

  const aiForecasts = [
    {
      type: 'purple' as const,
      text: 'Weekend Rush Prediction: Expect 40% increase in orders this Saturday. Recommend stocking extra pizza ingredients.'
    },
    {
      type: 'green' as const,
      text: 'Trending Item: Pasta Carbonara orders increased 25% this week. Consider featuring it as today\'s special.'
    },
    {
      type: 'orange' as const,
      text: 'Waste Reduction: Lettuce usage down 15%. Promote salads to reduce potential waste.'
    }
  ];

  const recommendations = [
    {
      title: 'Inventory Alert',
      text: 'Increase pasta inventory by 30% for tomorrow\'s lunch rush based on current demand trends.'
    },
    {
      title: 'Revenue Opportunity',
      text: 'Pizza sales peak at 7PM. Consider promoting premium toppings during this window.'
    }
  ];

  const pendingReviews = [
    {
      name: 'Sarah Johnson',
      text: '"Pizza was cold when delivered..."',
      time: '2 hours ago',
      type: 'critical' as const
    },
    {
      name: 'Mike Chen',
      text: '"Good food but slow service..."',
      time: '5 hours ago',
      type: 'warning' as const
    },
    {
      name: 'Emma Davis',
      text: '"Great pasta! Would love more..."',
      time: '1 day ago',
      type: 'positive' as const
    }
  ];

  const overallRating = {
    percentage: 92,
    change: '+5% this week'
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
          <div className="nav-item active">
            <div className="nav-icon">
              <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
                <path d="M2 16H18M2 16V8L10 2L18 8V16M2 16H6M18 16H14M6 16V12H14V16M6 16H14" stroke="#5F63F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="nav-text">Home</div>
          </div>

          <Link to="/inventory" className="nav-item">
            <div className="nav-icon">
              <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
                <path d="M3 3H17L15 13H5L3 3ZM3 3L2 1H1M7 17C7.55228 17 8 16.5523 8 16C8 15.4477 7.55228 15 7 15C6.44772 15 6 15.4477 6 16C6 16.5523 6.44772 17 7 17ZM15 17C15.5523 17 16 16.5523 16 16C16 15.4477 15.5523 15 15 15C14.4477 15 14 15.4477 14 16C14 16.5523 14.4477 17 15 17Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="nav-text">Inventory Dashboard</div>
          </Link>

          <Link to="/orders-insights" className="nav-item">
            <div className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1V17M1 9H17M13 5L5 13M5 5L13 13" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="nav-text">Orders & Insights</div>
          </Link>

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
            <h1 className="header-title">Dashboard</h1>
            <p className="header-subtitle">Welcome back, Anna! Here's your restaurant overview.</p>
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
            <div className="dashboard-card">
              {/* Header Section */}
              <div className="dashboard-header">
                <div className="dashboard-title-section">
                  <div className="dashboard-icon">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M9 1L11.2451 6.90983L18 9L11.2451 11.0902L9 17L6.75493 11.0902L0 9L6.75493 6.90983L9 1Z" fill="white" />
                    </svg>
                  </div>
                  <div className="dashboard-text">
                    <h2 className="dashboard-title">Today's Performance Overview</h2>
                    <p className="dashboard-subtitle">AI-powered insights for smarter decisions</p>
                  </div>
                </div>
                <div className="ai-badge">
                  <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
                    <path d="M9 1L11.2451 6.90983L18 9L11.2451 11.0902L9 17L6.75493 11.0902L0 9L6.75493 6.90983L9 1Z" fill="#5F63F2" />
                  </svg>
                  <span>Live AI Analysis</span>
                </div>
              </div>

              {/* Metrics Cards */}
              <div className="metrics-grid">
                <div className="metric-card metric-green">
                  <div className="metric-content">
                    <div className="metric-info">
                      <div className="metric-label">{metricsData.ordersServed.label}</div>
                      <div className="metric-value">{metricsData.ordersServed.value}</div>
                    </div>
                    <div className="metric-icon green"></div>
                  </div>
                  <div className="metric-trend">
                    <svg width="9" height="12" viewBox="0 0 9 12" fill="none">
                      <path d="M4.5 1L8 6H1L4.5 1Z" fill="#16A34A" />
                    </svg>
                    <span>{metricsData.ordersServed.trend.text}</span>
                  </div>
                </div>

                <div className="metric-card metric-blue">
                  <div className="metric-content">
                    <div className="metric-info">
                      <div className="metric-label">{metricsData.peakHours.label}</div>
                      <div className="metric-value">{metricsData.peakHours.value}</div>
                    </div>
                    <div className="metric-icon blue"></div>
                  </div>
                  <div className="metric-description">{metricsData.peakHours.description}</div>
                </div>

                <div className="metric-card metric-purple">
                  <div className="metric-content">
                    <div className="metric-info">
                      <div className="metric-label">{metricsData.topCategories.label}</div>
                      <div className="metric-value">{metricsData.topCategories.value}</div>
                    </div>
                    <div className="metric-icon purple"></div>
                  </div>
                  <div className="metric-description">{metricsData.topCategories.description}</div>
                </div>

                <div className="metric-card metric-orange">
                  <div className="metric-content">
                    <div className="metric-info">
                      <div className="metric-label">{metricsData.revenueImpact.label}</div>
                      <div className="metric-value">{metricsData.revenueImpact.value}</div>
                    </div>
                    <div className="metric-icon orange"></div>
                  </div>
                  <div className="metric-trend">
                    <svg width="9" height="12" viewBox="0 0 9 12" fill="none">
                      <path d="M4.5 1L8 6H1L4.5 1Z" fill="#EA580C" />
                    </svg>
                    <span>{metricsData.revenueImpact.trend.text}</span>
                  </div>
                </div>
              </div>

              {/* Smart Recommendations */}
              <div className="recommendations-section">
                <div className="recommendations-header">
                  <div className="recommendations-icon">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M9 1L11.2451 6.90983L18 9L11.2451 11.0902L9 17L6.75493 11.0902L0 9L6.75493 6.90983L9 1Z" fill="white" />
                    </svg>
                  </div>
                  <div className="recommendations-title">
                    <span>Smart Recommendations</span>
                    <div className="recommendations-badge">
                      <span>AI-Powered</span>
                    </div>
                  </div>
                </div>
                <div className="recommendations-content">
                  {recommendations.map((recommendation, index) => (
                    <div key={index} className="recommendation-card">
                      <div className="recommendation-header">
                        <div className="recommendation-icon"></div>
                        <h4 className="recommendation-title">{recommendation.title}</h4>
                      </div>
                      <p className="recommendation-text">
                        {recommendation.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <section className="content-section-2">
            <div className="reviews-card">
              {/* Header Section */}
              <div className="reviews-header">
                <div className="reviews-title-section">
                  <div className="reviews-icon">
                    <svg width="22.5" height="28" viewBox="0 0 22.5 28" fill="none">
                      <path d="M11.25 14C14.1495 14 16.5 11.6495 16.5 8.75C16.5 5.8505 14.1495 3.5 11.25 3.5C8.3505 3.5 6 5.8505 6 8.75C6 11.6495 8.3505 14 11.25 14ZM11.25 17.5C7.6695 17.5 0.5 19.2905 0.5 22.75V24.5H22V22.75C22 19.2905 14.8305 17.5 11.25 17.5Z" fill="#F59E0B" />
                    </svg>
                  </div>
                  <div className="reviews-text">
                    <h2 className="reviews-title">Pending Reviews</h2>
                    <p className="reviews-subtitle">Customer feedback awaiting response</p>
                  </div>
                </div>
                <div className="reviews-actions">
                  <span className="reviews-badge">
                    <svg width="14" height="17" viewBox="0 0 14 17" fill="none">
                      <path d="M7 8.5L10 5.5L4 5.5L7 8.5Z" fill="#F59E0B" />
                    </svg>
                    8 Reviews
                  </span>
                  <button className="view-all-btn">View All</button>
                </div>
              </div>

              {/* Review Cards */}
              <div className="reviews-content">
                {pendingReviews.map((review, index) => (
                  <div key={index} className={`review-card ${review.type}`}>
                    <div className="reviewer-info">
                      <div className="reviewer-avatar"></div>
                      <div className="reviewer-details">
                        <h4 className="reviewer-name">{review.name}</h4>
                        <p className="review-text">{review.text}</p>
                        <div className="review-meta">
                          <span className="review-time">{review.time}</span>
                          <button className="reply-btn">Reply</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Overall Rating */}
              <div className="overall-rating">
                <div className="rating-circle">
                  <div className="rating-value">{overallRating.percentage}%</div>
                  <div className="rating-change">{overallRating.change}</div>
                </div>
              </div>
            </div>
          </section>
          <section className="content-section-3">
            <div className="analytics-container">
              {/* Revenue by Category */}
              <div className="analytics-card">
                <h3 className="analytics-title">Revenue by Category</h3>
                <div className="chart-container">
                  <div className="chart-placeholder" style={{ position: 'relative', height: '256px', minWidth: '450px' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, width: '250px', height: '256px' }}>
                      <Doughnut
                        data={{
                          labels: revenueByCategory.categories.map(cat => cat.label),
                          datasets: [{
                            data: revenueByCategory.categories.map(cat => cat.percentage),
                            backgroundColor: revenueByCategory.categories.map(cat => cat.color),
                            borderColor: '#FFFFFF',
                            borderWidth: 2
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          cutout: '50%',
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
                                  const value = context.parsed;
                                  const total = revenueByCategory.total;
                                  const amount = Math.round((value / 100) * total);
                                  return `${context.label}: ₹${amount} (${value}%)`;
                                }
                              }
                            }
                          },
                          elements: { arc: { borderWidth: 2 } }
                        }}
                      />
                    </div>

                    {/* Center text overlay */}
                    <div style={{
                      position: 'absolute',
                      left: '125px',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      pointerEvents: 'none'
                    }}>
                      <div style={{ fontSize: '12px', fontWeight: '500', color: '#6B7280' }}>Total</div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>₹{revenueByCategory.total.toLocaleString()}</div>
                    </div>

                    {/* Legend */}
                    <div style={{
                      position: 'absolute',
                      left: '280px',
                      top: '60px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px'
                    }}>
                      {revenueByCategory.categories.map((item) => (
                        <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                          <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: item.color,
                            marginTop: '2px',
                            flexShrink: 0
                          }} />
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: '500', color: '#111827', lineHeight: '1.2' }}>
                              {item.label}
                            </div>
                            <div style={{ fontSize: '11px', color: '#6B7280', lineHeight: '1.2' }}>
                              ₹{item.amount.toLocaleString()} ({item.percentage}%)
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue Trend */}
              <div className="analytics-card">
                <h3 className="analytics-title">Revenue Trend (7 Days)</h3>
                <div className="chart-container">
                  <div className="chart-placeholder" style={{ height: '256px', minWidth: '450px' }}>
                    <Line
                      data={{
                        labels: revenueTrend.labels,
                        datasets: [{
                          label: 'Daily Revenue',
                          data: revenueTrend.data,
                          borderColor: '#10B981',
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          borderWidth: 3,
                          fill: true,
                          tension: 0.3,
                          pointBackgroundColor: '#FFFFFF',
                          pointBorderColor: '#10B981',
                          pointBorderWidth: 3,
                          pointRadius: 5,
                          pointHoverRadius: 7
                        }]
                      }}
                      options={{
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
                            displayColors: false,
                            callbacks: {
                              label: function (context: any) {
                                return `Revenue: ₹${context.parsed.y.toLocaleString()}`;
                              }
                            }
                          }
                        },
                        scales: {
                          x: {
                            grid: { display: false },
                            ticks: {
                              color: '#6B7280',
                              font: { family: 'Inter', size: 12, weight: 500 }
                            },
                            border: { display: true, color: '#E5E7EB' }
                          },
                          y: {
                            min: 0,
                            max: 4500,
                            ticks: {
                              stepSize: 700,
                              color: '#6B7280',
                              font: { family: 'Inter', size: 12, weight: 500 },
                              callback: function (value: any) {
                                return '₹' + (value / 1000).toFixed(1) + 'k';
                              }
                            },
                            grid: { color: '#F3F4F6', lineWidth: 1 },
                            border: { display: true, color: '#E5E7EB' }
                          }
                        },
                        elements: {
                          point: { hoverRadius: 7 }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Top Orders Today */}
              <div className="analytics-card">
                <h3 className="analytics-title">Top Orders Today</h3>
                <div className="orders-list">
                  {topOrdersToday.map((order, index) => (
                    <div key={index} className="order-item">
                      <div className="order-info">
                        <div className={`order-icon ${order.colorClass}`}></div>
                        <div className="order-details">
                          <span className="order-name">{order.name}</span>
                        </div>
                      </div>
                      <div className="order-value">₹{order.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <section className="content-section-4">
            <div className="inventory-container">
              {/* Stock Alerts */}
              <div className="inventory-card">
                <div className="inventory-header">
                  <h3 className="inventory-title">Stock Alerts</h3>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1V3M8 13V15M3.05 3.05L4.46 4.46M11.54 11.54L12.95 12.95M1 8H3M13 8H15M3.05 12.95L4.46 11.54M11.54 4.46L12.95 3.05" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="stock-alerts">
                  {stockAlerts.map((alert, index) => (
                    <div key={index} className={`alert-item ${alert.severity}`}>
                      <div className="alert-content">
                        <h4 className="alert-title">{alert.title}</h4>
                        <p className="alert-description">{alert.description}</p>
                      </div>
                      <span className={`alert-badge ${alert.severity}`}>
                        {alert.severity === 'critical' ? 'Critical' : 'Low'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Forecast Summary */}
              <div className="inventory-card">
                <div className="inventory-header">
                  <h3 className="inventory-title">AI Forecast Summary</h3>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1L9.545 5.455L14 7L9.545 8.545L8 13L6.455 8.545L2 7L6.455 5.455L8 1Z" fill="#5F63F2" />
                  </svg>
                </div>
                <div className="forecast-items">
                  {aiForecasts.map((forecast, index) => (
                    <div key={index} className={`forecast-item ${forecast.type}`}>
                      <p className="forecast-text">
                        {forecast.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}


