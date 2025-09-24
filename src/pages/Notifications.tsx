import React, { useState } from "react";
import { AlertIcon, AIIcon } from "../assets/icons/index";
import { getNotificationClasses, CSS_CLASSES } from "../utils/dashboardHelpers";

interface Notification {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  buttonText: string;
  timestamp: string;
  category: "alert" | "review" | "order" | "inventory" | "payment";
  isRead: boolean;
  onButtonClick?: () => void;
}

interface ForecastItem {
  title: string;
  description: string;
  type: "purple" | "green" | "orange";
  timestamp: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Urgent Review from Sarah J.",
    description:
      '"Pizza was cold when delivered..." - Customer needs immediate response',
    priority: "high",
    buttonText: "Respond Now",
    timestamp: "2 hours ago",
    category: "review",
    isRead: false,
  },
  {
    id: "2",
    title: "Freezer Temperature Alert",
    description:
      "Unit #2 temperature is above threshold. Immediate check required.",
    priority: "high",
    buttonText: "View Details",
    timestamp: "30 minutes ago",
    category: "alert",
    isRead: false,
  },
  {
    id: "3",
    title: "Low Stock Alert: Mozzarella Cheese",
    description: "Only 5 units remaining. Expected to run out in 2 days.",
    priority: "medium",
    buttonText: "Reorder Now",
    timestamp: "1 hour ago",
    category: "inventory",
    isRead: false,
  },
  {
    id: "4",
    title: "Supplier Invoice Due",
    description: "Invoice #INV-2024-831 from 'Global Foods' is due tomorrow.",
    priority: "medium",
    buttonText: "Mark as Paid",
    timestamp: "3 hours ago",
    category: "payment",
    isRead: true,
  },
  {
    id: "5",
    title: "New Order #1247",
    description:
      "Large order placed for table 12. Estimated prep time: 25 minutes.",
    priority: "low",
    buttonText: "View Order",
    timestamp: "5 minutes ago",
    category: "order",
    isRead: false,
  },
  {
    id: "6",
    title: "Daily Sales Report Ready",
    description: "Your daily sales summary for March 24th is now available.",
    priority: "low",
    buttonText: "View Report",
    timestamp: "6 hours ago",
    category: "alert",
    isRead: true,
  },
];

const mockForecasts: ForecastItem[] = [
  {
    title: "Weekend Rush Prediction",
    description:
      "Expect 40% increase in orders this Saturday. Recommend stocking extra pizza ingredients.",
    type: "purple",
    timestamp: "1 hour ago",
  },
  {
    title: "Trending Item Alert",
    description:
      "Pasta Carbonara orders increased 25% this week. Consider featuring it as today's special.",
    type: "green",
    timestamp: "2 hours ago",
  },
  {
    title: "Waste Reduction Opportunity",
    description:
      "Lettuce usage down 15%. Promote salads to reduce potential waste.",
    type: "orange",
    timestamp: "4 hours ago",
  },
  {
    title: "Peak Hours Analysis",
    description:
      "Lunch rush starts 30 minutes earlier on weekdays. Adjust staff scheduling.",
    type: "purple",
    timestamp: "1 day ago",
  },
];

const NotificationItem: React.FC<{
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}> = ({ notification, onMarkAsRead }) => {
  const classes = getNotificationClasses(notification.priority);

  const getCategoryIcon = () => {
    switch (notification.category) {
      case "review":
        return "💬";
      case "alert":
        return "⚠️";
      case "inventory":
        return "📦";
      case "payment":
        return "💳";
      case "order":
        return "🍽️";
      default:
        return "📢";
    }
  };

  return (
    <div
      className={`${classes.container} ${
        notification.isRead ? "opacity-60" : ""
      } hover:shadow-md transition-shadow duration-200 w-full relative`}
    >
      <div className="flex items-start gap-3">
        <div className="text-xl">{getCategoryIcon()}</div>
        <div className={classes.indicator}></div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-1">
            <h4
              className={`font-semibold text-gray-900 ${
                notification.isRead ? "text-gray-600" : ""
              }`}
            >
              {notification.title}
            </h4>
            <span className="text-xs text-gray-500 ml-2 absolute right-[16px]">
              {notification.timestamp}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3 leading-relaxed">
            {notification.description}
          </p>
          <div className="flex items-center gap-2">
            <button
              className={classes.button}
              onClick={notification.onButtonClick}
            >
              {notification.buttonText}
            </button>
            {!notification.isRead && (
              <button
                className="text-xs text-gray-500 hover:text-gray-700 underline"
                onClick={() => onMarkAsRead(notification.id)}
              >
                Mark as read
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ForecastItem: React.FC<{ forecast: ForecastItem }> = ({ forecast }) => {
  const getCardClasses = () => {
    const baseClasses =
      "rounded-xl p-4 border hover:shadow-md transition-shadow duration-200";
    switch (forecast.type) {
      case "purple":
        return `${baseClasses} bg-gradient-to-br from-purple-50 to-violet-50 border-purple-100`;
      case "green":
        return `${baseClasses} bg-gradient-to-br from-green-50 to-emerald-50 border-green-100`;
      case "orange":
        return `${baseClasses} bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100`;
      default:
        return `${baseClasses} bg-gray-50 border-gray-100`;
    }
  };

  const getIconByType = () => {
    switch (forecast.type) {
      case "purple":
        return "🔮";
      case "green":
        return "📈";
      case "orange":
        return "⚡";
      default:
        return "🤖";
    }
  };

  return (
    <div className={getCardClasses()}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getIconByType()}</span>
          <h4 className="font-semibold text-gray-900">{forecast.title}</h4>
        </div>
        <span className="text-xs text-gray-500">{forecast.timestamp}</span>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">
        {forecast.description}
      </p>
    </div>
  );
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<
    "all" | "unread" | "high" | "medium" | "low"
  >("all");

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  const filteredNotifications = notifications.filter((notification) => {
    switch (filter) {
      case "unread":
        return !notification.isRead;
      case "high":
      case "medium":
      case "low":
        return notification.priority === filter;
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="notifications-page">
      {/* Header Section */}
      <div className="mt-[-20px]">
        <div className="flex items-center justify-between">
          <div className="flex flex-row justify-center items-center gap-2">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <AlertIcon className="text-amber-600 w-5 h-5" />
            </div>
            <p className="text-gray-600 h-10 mt-10">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notifications`
                : "All notifications are read"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Notifications List */}
        <div className="lg:col-span-3">
          <div>
            <div className="flex flex-col max-h-[80vh] gap-[16px] overflow-y-auto pr-[5px]">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📭</div>
                  <p>No notifications found for the selected filter.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
