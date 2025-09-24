import React from 'react';
import { TrendUpIcon } from '../../assets/icons/index';
import { 
  getMetricCardClasses, 
  getIconContainerClasses, 
  getTrendTextClasses, 
  getLabelTextClasses,
  CSS_CLASSES 
} from '../../utils/dashboardHelpers';

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
}

export const MetricCard: React.FC<MetricCardProps> = ({
  type,
  label,
  value,
  description,
  trend,
  icon
}) => {
  return (
    <div className={getMetricCardClasses(type)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className={getLabelTextClasses(type)}>{label}</p>
          <h3 className={type === 'hours' || type === 'categories' ? CSS_CLASSES.METRIC_VALUE_SMALL : CSS_CLASSES.METRIC_VALUE}>
            {value}
          </h3>
        </div>
        <div className={getIconContainerClasses(type)}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className={getTrendTextClasses(type)}>
          <TrendUpIcon className="w-3 h-3" />
          <span>{trend.text}</span>
        </div>
      )}
      {description && (
        <p className={getTrendTextClasses(type).replace('flex items-center gap-1', '')}>
          {description}
        </p>
      )}
    </div>
  );
};
