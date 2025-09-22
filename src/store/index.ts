import { configureStore } from "@reduxjs/toolkit";
import inventoryReducer from "./slices/inventorySlice";
import ordersReducer from "./slices/ordersSlice";
import forecastsReducer from "./slices/forecastsSlice";
import restockReducer from "./slices/restockSlice";

export const store = configureStore({
  reducer: {
    inventory: inventoryReducer,
    orders: ordersReducer,
    forecasts: forecastsReducer,
    restock: restockReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


