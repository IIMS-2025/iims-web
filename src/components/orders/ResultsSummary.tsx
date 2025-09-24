import React from 'react';

interface ResultsSummaryProps {
  filteredCount: number;
  totalCount: number;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  filteredCount,
  totalCount
}) => {
  if (filteredCount === 0) return null;

  return (
    <div className="mt-6 text-center text-sm text-gray-600">
      Showing {filteredCount} of {totalCount} orders
    </div>
  );
};
