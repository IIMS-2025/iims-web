import { configureStore } from "@reduxjs/toolkit";
import inventoryReducer from "./slices/inventorySlice";
import ordersReducer from "./slices/ordersSlice";
import forecastsReducer from "./slices/forecastsSlice";

export const store = configureStore({
  reducer: {
    inventory: inventoryReducer,
    orders: ordersReducer,
    forecasts: forecastsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


