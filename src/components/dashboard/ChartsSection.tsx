import React from 'react';
import { Bar } from 'react-chartjs-2';
import { AlertIcon } from '../../assets/icons/index';
import { revenueTrend } from '../../utils/homeData';
import { createBarChartData, createBarChartOptions, createSalesCogsChartData, createSalesCogsChartOptions } from '../../utils/chartConfigs';
import { CSS_CLASSES } from '../../utils/dashboardHelpers';
import { useGetSalesTrendQuery } from '../../services/salesApi';
import { Loader, ChartLoader } from '../Loader';

interface StockAlert {
  title: string;
  description: string;
  severity: 'critical' | 'warning';
}

const stockAlerts: StockAlert[] = [
  {
    title: 'Mozzarella Cheese',
    description: 'Only 2.5kg remaining',
    severity: 'critical'
  },
  {
    title: 'Tomato Sauce',
    description: '5.2L remaining',
    severity: 'warning'
  },
  {
    title: 'Fresh Basil',
    description: '0.8kg remaining',
    severity: 'warning'
  }
];

const StockAlertItem: React.FC<{ alert: StockAlert }> = ({ alert }) => {
  const getBadgeClasses = () => {
    return alert.severity === 'critical'
      ? 'px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-lg'
      : 'px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-lg';
  };

  const getContainerClasses = () => {
    return alert.severity === 'critical'
      ? 'flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100'
      : 'flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-100';
  };

  return (
    <div className={getContainerClasses()}>
      <div>
        <h4 className="font-semibold text-gray-900 mb-1">{alert.title}</h4>
        <p className="text-sm text-gray-600">{alert.description}</p>
      </div>
      <span className={getBadgeClasses()}>
        {alert.severity === 'critical' ? 'Critical' : 'Low'}
      </span>
    </div>
  );
};

export const ChartsSection: React.FC = () => {
  const { data: salesTrendData, error: salesTrendError, isLoading: salesTrendLoading } = useGetSalesTrendQuery();
  
  // Use real data if available, otherwise fallback to static data
  const chartData = salesTrendData && !salesTrendError 
    ? createSalesCogsChartData(
        salesTrendData.labels,
        salesTrendData.salesData,
        salesTrendData.cogsData
      )
    : createBarChartData(revenueTrend);

  // Calculate max value for dynamic scaling
  const maxValue = salesTrendData && !salesTrendError
    ? Math.max(...salesTrendData.salesData, ...salesTrendData.cogsData)
    : undefined;

  const chartOptions = salesTrendData && !salesTrendError
    ? createSalesCogsChartOptions(maxValue)
    : createBarChartOptions();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Sales Trend & COGS (7 Days) */}
      <div className={`lg:col-span-2 ${CSS_CLASSES.WHITE_CARD}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`${CSS_CLASSES.TITLE_SECONDARY}`}>Sales Trend & COGS (7 Days)</h3>
          {salesTrendLoading && (
            <div className="flex items-center gap-2">
              <Loader size="sm" />
              <span className="text-sm text-gray-500">Loading chart data...</span>
            </div>
          )}
          {salesTrendError && (
            <span className="text-sm text-red-500">Using offline data</span>
          )}
        </div>
        <div className="h-80">
          {salesTrendLoading ? (
            <ChartLoader className="h-full" />
          ) : (
            <Bar
              data={chartData}
              options={chartOptions}
            />
          )}
        </div>
      </div>

      {/* Stock Alerts */}
      <div className={CSS_CLASSES.WHITE_CARD}>
        <div className={CSS_CLASSES.CARD_HEADER}>
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <AlertIcon className="text-red-600 w-5 h-5" />
          </div>
          <h3 className={`${CSS_CLASSES.TITLE_SECONDARY} user-guilde-stock-alerts`}>Stock Alerts</h3>
        </div>
        <div className="space-y-4">
          {stockAlerts.map((alert, index) => (
            <StockAlertItem key={index} alert={alert} />
          ))}
        </div>
      </div>
    </div>
  );
};
