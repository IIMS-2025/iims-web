import React from 'react';
import { AlertIcon, AIIcon } from '../../assets/icons/index';
import { getNotificationClasses, CSS_CLASSES } from '../../utils/dashboardHelpers';

interface Notification {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  buttonText: string;
  onButtonClick?: () => void;
}

interface ForecastItem {
  title: string;
  description: string;
  type: 'purple' | 'green' | 'orange';
}

const notifications: Notification[] = [
  {
    id: '1',
    title: 'New Urgent Review from Sarah J.',
    description: '"Pizza was cold when delivered..." - 2 hours ago',
    priority: 'high',
    buttonText: 'Respond Now'
  },
  {
    id: '2',
    title: 'Freezer Temperature Alert',
    description: 'Unit #2 temperature is above threshold. Immediate check required.',
    priority: 'medium',
    buttonText: 'View Details'
  },
  {
    id: '3',
    title: 'Supplier Invoice Due',
    description: 'Invoice #INV-2024-831 from \'Global Foods\' is due tomorrow.',
    priority: 'low',
    buttonText: 'Mark as Paid'
  }
];

const forecasts: ForecastItem[] = [
  {
    title: 'Weekend Rush Prediction',
    description: 'Expect 40% increase in orders this Saturday. Recommend stocking extra pizza ingredients.',
    type: 'purple'
  },
  {
    title: 'Trending Item',
    description: 'Pasta Carbonara orders increased 25% this week. Consider featuring it as today\'s special.',
    type: 'green'
  },
  {
    title: 'Waste Reduction',
    description: 'Lettuce usage down 15%. Promote salads to reduce potential waste.',
    type: 'orange'
  }
];

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
  const classes = getNotificationClasses(notification.priority);

  return (
    <div className={classes.container}>
      <div className={classes.indicator}></div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 mb-1">{notification.title}</h4>
        <p className="text-sm text-gray-600 mb-2">{notification.description}</p>
        <button 
          className={classes.button}
          onClick={notification.onButtonClick}
        >
          {notification.buttonText}
        </button>
      </div>
    </div>
  );
};

const ForecastItem: React.FC<{ forecast: ForecastItem }> = ({ forecast }) => {
  const getCardClasses = () => {
    const baseClasses = 'rounded-xl p-4 border';
    switch (forecast.type) {
      case 'purple':
        return `${baseClasses} bg-gradient-to-br from-purple-50 to-violet-50 border-purple-100`;
      case 'green':
        return `${baseClasses} bg-gradient-to-br from-green-50 to-emerald-50 border-green-100`;
      case 'orange':
        return `${baseClasses} bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100`;
      default:
        return `${baseClasses} bg-gray-50 border-gray-100`;
    }
  };

  return (
    <div className={getCardClasses()}>
      <h4 className="font-semibold text-gray-900 mb-2">{forecast.title}</h4>
      <p className="text-sm text-gray-600 leading-relaxed">
        {forecast.description}
      </p>
    </div>
  );
};

export const NotificationsSection: React.FC = () => {
  return (
    <div className={`${CSS_CLASSES.GRID_2_COLS} ${CSS_CLASSES.SECTION_SPACING}`}>
      {/* AI Forecast Summary */}
      <div className={CSS_CLASSES.WHITE_CARD}>
        <div className={CSS_CLASSES.CARD_HEADER}>
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <AIIcon className="text-indigo-600 w-5 h-5" />
          </div>
          <h3 className={CSS_CLASSES.TITLE_SECONDARY}>AI Forecast Summary</h3>
        </div>
        <div className="space-y-4">
          {forecasts.map((forecast, index) => (
            <ForecastItem key={index} forecast={forecast} />
          ))}
        </div>
      </div>

      {/* Notifications & Actions */}
      <div className={CSS_CLASSES.WHITE_CARD}>
        <div className={CSS_CLASSES.CARD_HEADER}>
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <AlertIcon className="text-amber-600 w-5 h-5" />
          </div>
          <h3 className={CSS_CLASSES.TITLE_SECONDARY}>Notifications & Actions</h3>
        </div>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      </div>
    </div>
  );
};
