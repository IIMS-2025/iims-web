import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Step } from "react-joyride";

import "../assets/theme.css";
import appConfig from "../config/appConfig";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import UserGuide from "../components/UserGuide";
import { getUserGuideToggle, setUserGuideToggle } from "../utils";

const dashboardSteps: Step[] = [
  {
    target: ".user-guilde-header-title",
    content:
      "Welcome to your dashboard! Here's an overview of your activity and key metrics.",
    placement: "bottom",
  },
  {
    target: ".user-guilde-stock-alerts",
    content:
      "Click here to access your settings and preferences. You can customize your dashboard experience here.",
    placement: "bottom",
  },
  {
    target: ".user-profile",
    content:
      "This is your profile section. Manage your account information and view your profile details here.",
    placement: "left",
  },
  {
    target: ".user-guilde-inventory",
    content:
      "These cards show your key performance indicators and important metrics at a glance.",
    placement: "top",
  },
  {
    target: ".user-guilde-stock-update",
    content:
      "Stay updated with your recent activities and system notifications in this section.",
    placement: "top",
  },
];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userGuideEnabled, setUserGuideEnabledState] = useState<boolean>(false);

  const titleMap: Record<string, string> = {
    "/": "Welcome Back!",
    "/home": "Welcome Back!",
    "/insights": "Insights",
    "/orders": "Orders",
    "/inventory": "Inventory Management",
    "/restock": "Restock List",
    "/chefspace": "Chef's Space",
    "/notifications": "Notifications Center",
    "/kitchen-agent": "Kitchen Agent",
  };
  const currentPath = location.pathname.replace(/\/$/, "");
  const headerTitle = titleMap[currentPath] || appConfig.branding.brandName;

  // Initialize user guide toggle state from localStorage
  useEffect(() => {
    setUserGuideEnabledState(getUserGuideToggle());
  }, []);

  const handleGuideComplete = () => {
    console.log("User guide completed!");
  };

  const handleStepChange = (index: number) => {
    if (index === 3) {
      navigate("/inventory");
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
