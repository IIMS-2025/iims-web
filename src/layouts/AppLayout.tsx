import { Outlet, useLocation } from "react-router-dom";
import "../assets/theme.css";
import appConfig from "../config/appConfig";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function AppLayout() {
  const location = useLocation();
  const titleMap: Record<string, string> = {
    "/": "Welcome Back!",
    "/home": "Welcome Back!",
    "/inventory": "Inventory Management",
    "/orders-insights": "Orders & Insights",
    "/chefspace": "Chef Space",
  };
  const currentPath = location.pathname.replace(/\/$/, "");
  const headerTitle = titleMap[currentPath] || appConfig.branding.brandName;

  return (
    <div className="home-page">
      <Sidebar />
      <main className="home-main">
        <Header
          titleSection={{ title: headerTitle }}
          showNotification={true}
        >
          <div className="header-actions"></div>
        </Header>
        <div className="home-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}


