import React from 'react';
import LoadingSpinnerIcon from '../../assets/icons/loading-spinner.svg?react';
import CloseIcon from '../../assets/icons/close.svg?react';
import StatusDotSuccessIcon from '../../assets/icons/status-dot-success.svg?react';
import StatusDotErrorIcon from '../../assets/icons/status-dot-error.svg?react';
import ExclamationTriangleIcon from '../../assets/icons/exclamation-triangle.svg?react';

// Filter Tag Component
export interface FilterTagProps {
  label: string;
  onRemove: () => void;
  colorClass: string;
  buttonColorClass: string;
}

export const FilterTag: React.FC<FilterTagProps> = ({ 
  label, 
  onRemove, 
  colorClass, 
  buttonColorClass 
}) => (
  <span className={`px-3 py-1 text-sm rounded-full ${colorClass}`}>
    {label}
    <button onClick={onRemove} className={`ml-2 ${buttonColorClass}`}>
      <CloseIcon className="w-3 h-3" />
    </button>
  </span>
);

// Loading State Component
export interface LoadingStateProps {
  startDate: string;
  endDate: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ startDate, endDate }) => (
  <div className="bg-white rounded-xl p-8 text-center">
    <div className="flex items-center justify-center gap-3 mb-4">
      <LoadingSpinnerIcon className="w-6 h-6 animate-spin text-blue-600" />
      <span className="text-gray-600">Loading recent orders...</span>
    </div>
    <p className="text-sm text-gray-500">Fetching orders from last 5 minutes ({startDate} - {endDate})</p>
  </div>
);

// Results Summary Component
export interface ResultsSummaryProps {
  filteredCount: number;
  totalCount: number;
  hasLiveData: boolean;
  startDate: string;
  endDate: string;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({ 
  filteredCount, 
  totalCount, 
  hasLiveData, 
  startDate, 
  endDate 
}) => (
  <div className="mt-6 text-center text-sm text-gray-600">
    Showing {filteredCount} of {totalCount} orders
    {hasLiveData && (
      <span className="ml-2 text-green-600">
        • Live data from {startDate} to {endDate}
      </span>
    )}
  </div>
);

// Sync Status Component
export interface SyncStatusProps {
  syncStatus: {
    success: boolean;
    message?: string;
    refreshing?: boolean;
  } | null;
  getStatusClasses: (success: boolean) => {
    container: string;
    indicator: string;
    title: string;
  };
}

export const SyncStatus: React.FC<SyncStatusProps> = ({ syncStatus, getStatusClasses }) => {
  if (!syncStatus) return null;

  return (
    <div className={`mb-6 p-4 rounded-xl border ${getStatusClasses(syncStatus.success).container}`}>
      <div className="flex items-center gap-2">
        {syncStatus.refreshing ? (
          <LoadingSpinnerIcon className="w-4 h-4 animate-spin text-blue-600" />
        ) : syncStatus.success ? (
          <StatusDotSuccessIcon className="w-2 h-2" />
        ) : (
          <StatusDotErrorIcon className="w-2 h-2" />
        )}
        <span className="text-sm font-medium">
          {syncStatus.refreshing ? 'Updating Data' : getStatusClasses(syncStatus.success).title}
        </span>
      </div>
      <p className="text-sm mt-1">{syncStatus.message}</p>
    </div>
  );
};

// API Error Status Component
export interface ApiErrorStatusProps {
  hasError: boolean;
}

export const ApiErrorStatus: React.FC<ApiErrorStatusProps> = ({ hasError }) => {
  if (!hasError) return null;

  return (
    <div className="mb-6 p-4 rounded-xl border bg-yellow-50 border-yellow-200 text-yellow-800">
      <div className="flex items-center gap-2">
        <ExclamationTriangleIcon className="w-4 h-4" />
        <span className="text-sm font-medium">Using Offline Data</span>
      </div>
      <p className="text-sm mt-1">Unable to load live orders. Showing cached data instead.</p>
    </div>
  );
};
