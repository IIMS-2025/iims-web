import React from 'react';
import type { Order } from '../../utils/orderData';
import DeliveryIcon from '../../assets/icons/delivery.svg?react';
import TakeawayIcon from '../../assets/icons/takeaway.svg?react';
import DineInIcon from '../../assets/icons/dine-in.svg?react';
import TimerIcon from '../../assets/icons/timer.svg?react';
import PhoneIcon from '../../assets/icons/phone.svg?react';
import PaymentIcon from '../../assets/icons/payment.svg?react';
import MoreIcon from '../../assets/icons/more.svg?react';
import { 
  getOrderStatusColor, 
  getPaymentStatusColor, 
  formatOrderTime, 
  formatCurrency 
} from '../../utils/orderData';

interface OrderCardProps {
  order: Order;
  onOrderClick: (order: Order) => void;
  onMoreClick: (order: Order) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onOrderClick,
  onMoreClick
}) => {
  const getOrderTypeIcon = () => {
    switch (order.orderType) {
      case 'delivery':
        return <DeliveryIcon className="w-5 h-5" />;
      case 'takeaway':
        return <TakeawayIcon className="w-5 h-5" />;
      case 'dine-in':
        return <DineInIcon className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getUrgencyClass = () => {
    if (order.estimatedTime <= 10 && order.status === 'preparing') {
      return 'priority-urgent';
    }
    return '';
  };

  return (
    <div 
      className={`order-card order-type-indicator ${order.orderType} bg-white rounded-2xl border border-gray-100 p-6 cursor-pointer ${getUrgencyClass()}`}
      onClick={() => onOrderClick(order)}
    >
      {/* Order Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-600">
            {getOrderTypeIcon()}
            <span className="font-medium text-gray-900">{order.orderNumber}</span>
          </div>
          {order.tableNumber && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
              Table {order.tableNumber}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getOrderStatusColor(order.status)}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoreClick(order);
            }}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreIcon className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Customer Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
          {order.customer.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{order.customer.name}</h3>
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            <PhoneIcon className="w-3 h-3" />
            <span>{order.customer.phone}</span>
          </div>
        </div>
      </div>

      {/* Order Items Summary */}
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">
          {order.items.length} item{order.items.length > 1 ? 's' : ''}
        </div>
        <div className="space-y-1">
          {order.items.slice(0, 2).map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.quantity}x {item.name}
              </span>
              <span className="text-gray-900 font-medium">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
          {order.items.length > 2 && (
            <div className="text-xs text-gray-500">
              +{order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Order Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <TimerIcon className="w-4 h-4" />
            <span className={order.estimatedTime <= 10 ? 'timer-pulse' : ''}>
              {order.estimatedTime} min
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {formatOrderTime(order.orderTime)}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPaymentStatusColor(order.paymentStatus)}`}>
            <PaymentIcon className="w-3 h-3 inline mr-1" />
            {order.paymentStatus}
          </span>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(order.total)}
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Address (if applicable) */}
      {order.orderType === 'delivery' && order.customer.address && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500 mb-1">Delivery Address:</div>
          <div className="text-sm text-gray-700">
            {order.customer.address.street}, {order.customer.address.city}
          </div>
        </div>
      )}

      {/* Special Notes */}
      {order.notes && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500 mb-1">Notes:</div>
          <div className="text-sm text-gray-700 italic">"{order.notes}"</div>
        </div>
      )}
    </div>
  );
};
