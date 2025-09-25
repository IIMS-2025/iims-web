import React from 'react';
import type { Order } from '../../utils/orderData';
import MoreIcon from '../../assets/icons/more.svg?react';
import SearchIcon from '../../assets/icons/search.svg?react';
import FilterIcon from '../../assets/icons/filter.svg?react';
import { 
  formatOrderTime,
  formatCurrency 
} from '../../utils/orderData';

interface OrderTableProps {
  orders: Order[];
  onOrderClick?: (order: Order) => void;
  onMoreClick: (order: Order) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onFilterClick: () => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  onOrderClick,
  onMoreClick,
  searchTerm,
  onSearchChange,
  onFilterClick
}) => {
  const getUrgencyClass = (order: Order) => {
    if (order.estimatedTime <= 10 && order.status === 'preparing') {
      return 'bg-red-50 border-red-200';
    }
    return '';
  };

  if (orders.length === 0) {
    return (
      <div className="user-guide-oders-list-first-row bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          📋
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
        <p className="text-gray-600">No orders match your current filters</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Search and Filter Bar */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders by customer name, order number..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            />
          </div>
          <button
            onClick={onFilterClick}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <FilterIcon className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Items
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Order Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order, index) => (
              <tr 
                key={order.orderNumber}
                className={`hover:bg-gray-50 transition-colors ${index === 0 ? `user-guide-oders-list-first-row` : ''} ${getUrgencyClass(order)}`}
              >
                {/* Order ID */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="font-medium text-gray-900 text-sm">{order.orderNumber}</div>
                </td>

                {/* Items */}
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-900 max-w-xs">
                    {order.items.length <= 2 ? (
                      // Show all items if 2 or fewer
                      <span className="truncate block">
                        {order.items.map((item, index) => (
                          <span key={item.id}>
                            {item.quantity}x {item.name}
                            {index < order.items.length - 1 && ', '}
                          </span>
                        ))}
                      </span>
                    ) : (
                      // Show first item + count if more than 2
                      <span className="truncate block">
                        {order.items[0].quantity}x {order.items[0].name}
                        <span className="text-gray-500 text-xs ml-1">
                          +{order.items.length - 1} more
                        </span>
                      </span>
                    )}
                  </div>
                </td>

                {/* Order Time */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatOrderTime(order.orderTime)}
                  </div>
                </td>

                {/* Price */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(order.total)}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoreClick(order);
                    }}
                    className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Help Text */}
      {orders.length > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
          <div className="text-xs text-gray-500">
            Click "View Details" to see complete order information
          </div>
        </div>
      )}
    </div>
  );
};
