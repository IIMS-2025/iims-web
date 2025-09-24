import { Provider } from "react-redux";
import { store } from "./store";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import HomePage from "./pages/Home";
import ChefSpace from "./pages/ChefSpace";
import ChefSpaceDetail from "./pages/ChefSpaceDetail";
import OrdersInsights from "./pages/OrdersInsights";
import RestockList from "./pages/RestockList";
import Notifications from "./pages/Notifications";
import KitchenAgent from "./pages/KitchenAgent";
import AppLayout from "./layouts/AppLayout";
import appConfig from "./config/appConfig";
import InventoryPage from "./pages/Inventory";

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
          <Route path="/" element={<Navigate to={routingConfig.routes.default} replace />} />
          <Route path={routingConfig.routes.login} element={<Login />} />
          <Route element={<AppLayout />}>
            <Route path={routingConfig.routes.default} element={<HomePage />} />
            <Route path="/insights" element={<OrdersInsights />} />
            <Route path="/chefspace" element={<ChefSpace />} />
            <Route path="/chefspace/:id" element={<ChefSpaceDetail />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/restock" element={<RestockList />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/kitchen-agent" element={<KitchenAgent />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
