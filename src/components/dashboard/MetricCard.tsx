import React from 'react';
import { TrendUpIcon } from '../../assets/icons/index';
import { 
  getMetricCardClasses, 
  getIconContainerClasses, 
  getTrendTextClasses, 
  getLabelTextClasses,
  CSS_CLASSES 
} from '../../utils/dashboardHelpers';
import { Loader } from '../Loader';

interface MetricCardProps {
  type: 'revenue' | 'orders' | 'hours' | 'categories';
  label: string;
  value: string;
  description?: string;
  trend?: {
    text: string;
    positive: boolean;
  };
  icon: React.ReactNode;
  isLoading?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  type,
  label,
  value,
  description,
  trend,
  icon,
  isLoading = false
}) => {
  return (
    <div className={getMetricCardClasses(type)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className={getLabelTextClasses(type)}>{label}</p>
          <h3 className={type === 'hours' || type === 'categories' ? CSS_CLASSES.METRIC_VALUE_SMALL : CSS_CLASSES.METRIC_VALUE}>
            {isLoading && value === "..." ? (
              <div className="flex items-center gap-2">
                <Loader size="sm" />
                <span className="text-gray-400">Loading...</span>
              </div>
            ) : (
              value
            )}
          </h3>
        </div>
        <div className={getIconContainerClasses(type)}>
          {icon}
        </div>
      </div>
      {trend && !isLoading && (
        <div className={getTrendTextClasses(type)}>
          <TrendUpIcon className="w-3 h-3" />
          <span>{trend.text}</span>
        </div>
      )}
      {description && !isLoading && (
        <p className={getTrendTextClasses(type).replace('flex items-center gap-1', '')}>
          {description}
        </p>
      )}
    </div>
  );
};
