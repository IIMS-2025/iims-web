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

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/owner" replace />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/owner" element={<OwnerDashboard />} />
            <Route path="/manager" element={<ManagerDashboard />} />
            <Route path="/chef" element={<ChefDashboard />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/menu" element={<MenuOrdersPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
