import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg
        className={`animate-spin ${sizeClasses[size]} text-indigo-600`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
};

// Alternative dot-based loader
export const DotLoader: React.FC<LoaderProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  return (
    <div className={`inline-flex items-center space-x-1 ${className}`}>
      <div className={`${sizeClasses[size]} bg-indigo-600 rounded-full animate-pulse`}></div>
      <div className={`${sizeClasses[size]} bg-indigo-600 rounded-full animate-pulse`} style={{ animationDelay: '0.1s' }}></div>
      <div className={`${sizeClasses[size]} bg-indigo-600 rounded-full animate-pulse`} style={{ animationDelay: '0.2s' }}></div>
    </div>
  );
};

// Card loader with shimmer effect
export const CardLoader: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gray-200 rounded-lg h-4 w-3/4 mb-2"></div>
      <div className="bg-gray-200 rounded-lg h-3 w-1/2"></div>
    </div>
  );
};

// Chart skeleton loader
export const ChartLoader: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="flex items-end justify-between h-64 space-x-2">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex flex-col items-center space-y-2 flex-1">
            <div 
              className="bg-gradient-to-t from-gray-200 to-gray-300 rounded-t w-full"
              style={{ height: `${Math.random() * 60 + 40}%` }}
            ></div>
            <div className="bg-gray-200 h-3 w-8 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loader;
