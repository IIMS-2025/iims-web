import { Provider } from "react-redux";
import { store } from "./store";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Login from "./pages/Login";
import OwnerDashboard from "./pages/dashboards/OwnerDashboard";
import ManagerDashboard from "./pages/dashboards/ManagerDashboard";
import ChefDashboard from "./pages/dashboards/ChefDashboard";
import InventoryPage from "./pages/Inventory";
import MenuOrdersPage from "./pages/MenuOrders";
import AnalyticsPage from "./pages/Analytics";
import HomePage from "./pages/Home";
import ChefSpace from "./pages/ChefSpace";
import ChefSpaceDetail from "./pages/ChefSpaceDetail";
import OrdersInsights from "./pages/OrdersInsights";
import appConfig from "./config/appConfig";

export default function App() {
  // App routing configuration (can be loaded from backend)
  const routingConfig = {
    routes: appConfig.routes,
    features: appConfig.features
  };

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path={routingConfig.routes.login} element={<Login />} />
          <Route path={routingConfig.routes.default} element={<HomePage />} />
          <Route path="/orders-insights" element={<OrdersInsights />} />
          <Route path="/chefspace" element={<ChefSpace />} />
          <Route path="/chefspace/:id" element={<ChefSpaceDetail />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to={routingConfig.routes.default} replace />} />
            <Route path="/owner" element={<OwnerDashboard />} />
            <Route path="/manager" element={<ManagerDashboard />} />
            <Route path="/chef" element={<ChefDashboard />} />
            <Route path="/menu" element={<MenuOrdersPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Route>
          <Route path="*" element={<Navigate to={routingConfig.routes.fallback} replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
