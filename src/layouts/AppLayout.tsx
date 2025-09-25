import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Step } from "react-joyride";

import "../assets/theme.css";
import appConfig from "../config/appConfig";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import UserGuide from "../components/UserGuide";
import { getUserGuideToggle, setUserGuideToggle } from "../utils";
import { setActiveTab } from "../store/slices/insightsSlice";
import { useDispatch } from "react-redux";

const dashboardSteps: Step[] = [
  {
    target: ".user-guilde-header-title",
    content:
      "Welcome to your dashboard! Here's an overview of your activity and key metrics.",
    placement: "bottom",
  },
  {
    target: ".user-guide-order-tab",
    content:
      "Click here to access your orders and manage your orders here.",
    placement: "right",
  },
  {
    target: ".user-guide-sync-orders",
    content:
      "Click here to sync your orders and manage your orders here.",
    placement: "left",
  },
  {
    target: ".user-guide-oders-list-first-row",
    content: "Click here to view your latest order and manage your orders here.",
    placement: "bottom",
  },
  {
    target: ".user-guide-inventory-tab",
    content: "Click here to access your inventory and manage your inventory here.",
    placement: "bottom",
  },
  {
    target: ".user-guide-inventory-list-first-row",
    content: "Low stock items are highlighted.",
    placement: "bottom",
  },
  {
    target: ".user-guilde-restock-list-tab",
    content:
      "Click here to access your restock list and manage your restock list here.",
    placement: "right",
  },
  {
    target: ".user-guide-restock-export-btn",
    content: "Click here to export your restock list and manage your restock list here.",
    placement: "bottom",
  },
  {
    target: ".user-guide-cook-book-tab",
    content: "Click here to access your cook book and manage your cook book here.",
    placement: "right",
  },
  {
    target: ".user-guide-cook-book-list-first-item",
    content: "Click here to view deatials of this menu item",
    placement: "right",
  },
  {
    target: ".user-guide-menu-details",
    content: "View details of this menu item",
    placement: "bottom",
  },
  {
    target: ".user-guide-ingredients-list",
    content: "Click here to view ingredients of this menu item",
    placement: "left",
  },
  {
    target: ".user-guide-insights-tab",
    content: "Click here to access your insights and manage your insights here.",
    placement: "right",
  },
  {
    target: ".user-guide-inventory-insights-overview",
    content: "View overview of your inventory insights",
    placement: "bottom",
  },
  {
    target: ".user-guide-inventory-insights-smart-notifications",
    content: "View anomalies of your inventory insights",
    placement: "right",
  },
  {
    target: ".user-guide-inventory-insights-forecast-graph",
    content: "View anomalies of your inventory insights in graph",
    placement: "right",
  },
  {
    target: ".user-guide-revenue-insights-tab",
    content: "View anomalies of your inventory insights in graph",
    placement: "right",
  },
  {
    target: ".user-guide-revenue-insights-overview",
    content: "View overview of your revenue insights",
    placement: "bottom",
  },
  {
    target: ".user-guide-revenue-insights-forecast-graph",
    content: "View anomalies of your revenue insights in graph",
    placement: "right",
  },
  {
    target: ".user-guide-revenue-insights-ai",
    content: "View anomalies of your revenue insights in ai",
    placement: "left",
  },
  {
    target: ".user-guide-home-tab",
    content: "View home tab",
    placement: "right",
  },
  {
    target: ".user-guide-home-overview",
    content: "View home overview",
    placement: "bottom",
  },
  {
    target: ".user-guide-home-ai-recommendations",
    content: "View home ai recommendations",
    placement: "right",
  },
  {
    target: ".user-guide-home-ai-summary",
    content: "View home ai summary",
    placement: "left",
  },
  {
    target: ".user-guide-kitchen-agent-tab",
    content: "View kitchen agent tab",
    placement: "right",
  },
  {
    target: ".user-guide-kitchen-agent-quick-actions1",
    content: "View kitchen agent quick actions",
    placement: "top",
  }
];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userGuideEnabled, setUserGuideEnabledState] = useState<boolean>(false);

  const titleMap: Record<string, string> = {
    "/": "Welcome Back!",
    "/home": "Welcome Back!",
    "/inventory": "Inventory Management",
    "/insights": "Insights",
    "/restock": "Restock List",
    "/chefspace": "Chef's Space",
    "/notifications": "Notifications Center",
    "/kitchen-agent": "Kitchen Agent",
  };
  const currentPath = location.pathname.replace(/\/$/, "");
  const headerTitle = titleMap[currentPath] || null;

  // Initialize user guide toggle state from localStorage
  useEffect(() => {
    setUserGuideEnabledState(getUserGuideToggle());
  }, []);

  const handleGuideComplete = () => {
    console.log("User guide completed!");
  };

  const handleStepChange = (index: number) => {

    switch (index) {
      case 1:
        // step home to orders
        navigate("/orders");
        break;
      case 4:
          navigate("/inventory");
        break;
      case 6:
        navigate("/restock");
        break;
      case 8:
        navigate("/chefspace");
        break;
      case 10: 
        navigate("/chefspace/20000001-0000-0000-0000-000000000000");
        break;
      case 12:
        navigate("/insights");
        break;
      case 16: 
        dispatch(setActiveTab('Revenue'));
        break;
      case 20: 
      setTimeout(() => {
        navigate("/home");
      }, 1000);
        break;
      case 24: 
        navigate("/kitchen-agent");
        break;
    }
  };

  const handleUserGuideToggle = (enabled: boolean) => {
    setUserGuideEnabledState(enabled);
    setUserGuideToggle(enabled);
  };

  return (
    <div className="home-page">
      <Sidebar
        showUserGuideToggle={true}
        userGuideEnabled={userGuideEnabled}
        onUserGuideToggle={handleUserGuideToggle}
      />
      <main className="home-main">
        <Header titleSection={{ title: headerTitle }} showNotification={true}>
          <div className="header-actions"></div>
        </Header>
        <div className="home-content">
          <UserGuide
            steps={dashboardSteps}
            storageKey="dashboardGuideCompleted"
            onComplete={handleGuideComplete}
            onStepChange={handleStepChange}
            enabled={userGuideEnabled}
          />
          <Outlet />
        </div>
      </main>
    </div>
  );
}
