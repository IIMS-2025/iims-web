// Dashboard utility functions

/**
 * Get CSS classes for metric card based on type
 */
export const getMetricCardClasses = (type: 'revenue' | 'orders' | 'hours' | 'categories'): string => {
  const baseClasses = 'rounded-2xl p-6 border shadow-sm';
  
  switch (type) {
    case 'revenue':
      return `${baseClasses} bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-100`;
    case 'orders':
      return `${baseClasses} bg-gradient-to-br from-green-50 to-emerald-50 border-green-100`;
    case 'hours':
      return `${baseClasses} bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100`;
    case 'categories':
      return `${baseClasses} bg-gradient-to-br from-purple-50 to-violet-50 border-purple-100`;
    default:
      return `${baseClasses} bg-white border-gray-100`;
  }
};

/**
 * Get CSS classes for icon container based on type
 */
export const getIconContainerClasses = (type: 'revenue' | 'orders' | 'hours' | 'categories'): string => {
  const baseClasses = 'w-10 h-10 rounded-xl flex items-center justify-center';
  
  switch (type) {
    case 'revenue':
      return `${baseClasses} bg-amber-100`;
    case 'orders':
      return `${baseClasses} bg-green-100`;
    case 'hours':
      return `${baseClasses} bg-blue-100`;
    case 'categories':
      return `${baseClasses} bg-purple-100`;
    default:
      return `${baseClasses} bg-gray-100`;
  }
};

/**
 * Get CSS classes for trend text based on type
 */
export const getTrendTextClasses = (type: 'revenue' | 'orders' | 'hours' | 'categories'): string => {
  const baseClasses = 'flex items-center gap-1 text-sm font-medium';
  
  switch (type) {
    case 'revenue':
      return `${baseClasses} text-amber-600`;
    case 'orders':
      return `${baseClasses} text-green-600`;
    case 'hours':
      return `${baseClasses} text-blue-600`;
    case 'categories':
      return `${baseClasses} text-purple-600`;
    default:
      return `${baseClasses} text-gray-600`;
  }
};

/**
 * Get CSS classes for label text based on type
 */
export const getLabelTextClasses = (type: 'revenue' | 'orders' | 'hours' | 'categories'): string => {
  const baseClasses = 'text-sm font-medium mb-1';
  
  switch (type) {
    case 'revenue':
      return `${baseClasses} text-amber-700`;
    case 'orders':
      return `${baseClasses} text-green-700`;
    case 'hours':
      return `${baseClasses} text-blue-700`;
    case 'categories':
      return `${baseClasses} text-purple-700`;
    default:
      return `${baseClasses} text-gray-700`;
  }
};

/**
 * Get CSS classes for recommendation cards based on severity
 */
export const getRecommendationCardClasses = (severity: 'alert' | 'opportunity' | 'prevention'): string => {
  const baseClasses = 'rounded-xl p-5 border';
  
  switch (severity) {
    case 'alert':
      return `${baseClasses} bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100`;
    case 'opportunity':
      return `${baseClasses} bg-gradient-to-br from-green-50 to-emerald-50 border-green-100`;
    case 'prevention':
      return `${baseClasses} bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100`;
    default:
      return `${baseClasses} bg-gray-50 border-gray-100`;
  }
};

/**
 * Get CSS classes for notification items based on priority
 */
export const getNotificationClasses = (priority: 'high' | 'medium' | 'low'): {
  container: string;
  indicator: string;
  button: string;
} => {
  switch (priority) {
    case 'high':
      return {
        container: 'flex items-start gap-4 p-4 bg-red-50 rounded-xl border border-red-100',
        indicator: 'w-2 h-2 bg-red-500 rounded-full mt-2',
        button: 'px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200 transition-colors'
      };
    case 'medium':
      return {
        container: 'flex items-start gap-4 p-4 bg-orange-50 rounded-xl border border-orange-100',
        indicator: 'w-2 h-2 bg-orange-500 rounded-full mt-2',
        button: 'px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-lg hover:bg-orange-200 transition-colors'
      };
    case 'low':
      return {
        container: 'flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100',
        indicator: 'w-2 h-2 bg-blue-500 rounded-full mt-2',
        button: 'px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-200 transition-colors'
      };
    default:
      return {
        container: 'flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100',
        indicator: 'w-2 h-2 bg-gray-500 rounded-full mt-2',
        button: 'px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors'
      };
  }
};

/**
 * Common CSS class constants
 */
export const CSS_CLASSES = {
  // Layout
  DASHBOARD_CONTAINER: 'min-h-screen bg-gray-50 p-4',
  MAIN_CONTENT: 'w-full',
  SECTION_SPACING: 'mb-8',
  GRID_4_COLS: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
  GRID_2_COLS: 'grid grid-cols-1 lg:grid-cols-2 gap-8',
  GRID_3_COLS: 'grid grid-cols-1 lg:grid-cols-3 gap-6',
  
  // Cards
  WHITE_CARD: 'bg-white rounded-2xl shadow-sm border border-gray-100 p-6',
  CARD_HEADER: 'flex items-center gap-4 mb-6',
  
  // Typography
  TITLE_PRIMARY: 'text-2xl font-bold text-gray-900',
  TITLE_SECONDARY: 'text-xl font-bold text-gray-900',
  SUBTITLE: 'text-gray-600 mt-1',
  METRIC_VALUE: 'text-3xl font-bold text-gray-900',
  METRIC_VALUE_SMALL: 'text-2xl font-bold text-gray-900',
  
  // Interactive elements
  BUTTON_PRIMARY: 'px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors',
  BADGE_PRIMARY: 'px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-lg border border-indigo-100'
} as const;
