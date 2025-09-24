import type { ChartOptions } from 'chart.js';

// Type definitions
export interface RevenueByCategory {
  total: number;
  categories: Array<{
    label: string;
    percentage: number;
    amount: number;
    color: string;
  }>;
}

export interface RevenueTrend {
  labels: string[];
  data: number[];
}

// Chart.js configuration utilities
export const createDoughnutChartData = (revenueByCategory: RevenueByCategory) => ({
  labels: revenueByCategory.categories.map(cat => cat.label),
  datasets: [{
    data: revenueByCategory.categories.map(cat => cat.percentage),
    backgroundColor: revenueByCategory.categories.map(cat => cat.color),
    borderColor: '#FFFFFF',
    borderWidth: 2
  }]
});

export const createDoughnutChartOptions = (revenueByCategory: RevenueByCategory) => ({
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
});

export const createLineChartData = (revenueTrend: RevenueTrend) => ({
  labels: revenueTrend.labels,
  datasets: [
    {
      label: 'Revenue',
      data: revenueTrend.data,
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.3,
      pointBackgroundColor: '#FFFFFF',
      pointBorderColor: '#3B82F6',
      pointBorderWidth: 2,
      pointRadius: 4,
    },
    {
      label: 'COGS',
      data: [1200, 1400, 1100, 1600, 1800, 2100, 1900],
      borderColor: '#F59E0B',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.3,
      pointBackgroundColor: '#FFFFFF',
      pointBorderColor: '#F59E0B',
      pointBorderWidth: 2,
      pointRadius: 4,
    }
  ]
});

export const createLineChartOptions = () => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        pointStyle: 'circle' as const,
      }
    },
    tooltip: {
      backgroundColor: '#FFFFFF',
      titleColor: '#111827',
      bodyColor: '#6B7280',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      cornerRadius: 8,
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: '#6B7280',
        font: { family: 'Inter', size: 12, weight: 500 }
      }
    },
    y: {
      min: 0,
      max: 4500,
      ticks: {
        stepSize: 500,
        color: '#6B7280',
        font: { family: 'Inter', size: 12, weight: 500 },
        callback: function (value: any) {
          return '₹' + (value / 1000).toFixed(1) + 'k';
        }
      },
      grid: { color: '#F3F4F6', lineWidth: 1 }
    }
  }
});

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString()}`;
};

// Helper function to format percentage
export const formatPercentage = (value: number): string => {
  return `${value}%`;
};
