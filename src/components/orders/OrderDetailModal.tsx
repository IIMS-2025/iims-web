import React from 'react';
import type { Order } from '../../utils/orderData';
import { formatOrderTime, formatCurrency } from '../../utils/orderData';
import CloseIcon from '../../assets/icons/edit.svg?react'; // Using edit icon as close icon

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose
}) => {
  if (!isOpen || !order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderTypeIcon = (type: string) => {
    switch (type) {
      case 'dine-in': return '🍽️';
      case 'takeaway': return '🛍️';
      case 'delivery': return '🚚';
      default: return '📋';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
            <p className="text-sm text-gray-600">Order #{order.orderNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <CloseIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Order Overview */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Type</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg">{getOrderTypeIcon(order.orderType)}</span>
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {order.orderType.replace('-', ' ')}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Order Time</p>
              <p className="text-sm font-medium text-gray-900 mt-1">{formatOrderTime(order.orderTime)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Time</p>
              <p className="text-sm font-medium text-gray-900 mt-1">{order.estimatedTime} min</p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Name</p>
              <p className="text-sm text-gray-900 mt-1">{order.customer.name}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</p>
              <p className="text-sm text-gray-900 mt-1">{order.customer.phone || 'Not provided'}</p>
            </div>
            {order.customer.email && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</p>
                <p className="text-sm text-gray-900 mt-1">{order.customer.email}</p>
              </div>
            )}
            {order.orderType === 'delivery' && order.customer.address && (
              <div className="md:col-span-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Address</p>
                <p className="text-sm text-gray-900 mt-1">
                  {order.customer.address.street}<br />
                  {order.customer.address.city}, {order.customer.address.postalCode}
                </p>
              </div>
            )}
            {order.tableNumber && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Table Number</p>
                <p className="text-sm text-gray-900 mt-1">Table {order.tableNumber}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                  {item.customizations && item.customizations.length > 0 && (
                    <p className="text-xs text-gray-600 mt-1">
                      {item.customizations.join(', ')}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {item.quantity} × {formatCurrency(item.price)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(item.quantity * item.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Information */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="text-sm font-medium text-gray-900">{formatCurrency(order.subtotal)}</span>
            </div>
            {order.tax > 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tax</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(order.tax)}</span>
              </div>
            )}
            {order.deliveryFee > 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Delivery Fee</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(order.deliveryFee)}</span>
              </div>
            )}
            <hr className="border-gray-200" />
            <div className="flex justify-between">
              <span className="text-base font-medium text-gray-900">Total</span>
              <span className="text-base font-bold text-gray-900">{formatCurrency(order.total)}</span>
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-gray-600">Payment Method</span>
              <span className="text-sm font-medium text-gray-900 capitalize">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Payment Status</span>
              <span className={`text-sm font-medium capitalize ${getPaymentStatusColor(order.paymentStatus)}`}>
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Special Instructions</h3>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{order.notes}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              window.print();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
