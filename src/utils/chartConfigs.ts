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

export const createBarChartData = (revenueTrend: RevenueTrend) => ({
  labels: revenueTrend.labels,
  datasets: [
    {
      label: 'Revenue',
      data: revenueTrend.data,
      backgroundColor: '#3B82F6',
      borderColor: '#3B82F6',
      borderWidth: 1,
      borderRadius: 4,
      borderSkipped: false,
    },
    {
      label: 'COGS',
      data: [1200, 1400, 1100, 1600, 1800, 2100, 1900],
      backgroundColor: '#F59E0B',
      borderColor: '#F59E0B',
      borderWidth: 1,
      borderRadius: 4,
      borderSkipped: false,
    }
  ]
});

export const createBarChartOptions = () => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        pointStyle: 'rect' as const,
        padding: 20,
      }
    },
    tooltip: {
      backgroundColor: '#FFFFFF',
      titleColor: '#111827',
      bodyColor: '#6B7280',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      cornerRadius: 8,
      callbacks: {
        label: function (context: any) {
          return `${context.dataset.label}: ₹${context.parsed.y.toLocaleString()}`;
        }
      }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: '#6B7280',
        font: { family: 'Lexend', size: 12, weight: 500 }
      }
    },
    y: {
      beginAtZero: true,
      max: 4500,
      ticks: {
        stepSize: 500,
        color: '#6B7280',
        font: { family: 'Lexend', size: 12, weight: 500 },
        callback: function (value: any) {
          return '₹' + (value / 1000).toFixed(1) + 'k';
        }
      },
      grid: { 
        color: '#F3F4F6', 
        lineWidth: 1,
        drawBorder: false
      }
    }
  },
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  elements: {
    bar: {
      borderWidth: 1,
    }
  }
});

// Legacy line chart functions (kept for compatibility)
export const createLineChartData = createBarChartData;
export const createLineChartOptions = createBarChartOptions;

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString()}`;
};

// Helper function to format percentage
export const formatPercentage = (value: number): string => {
  return `${value}%`;
};
