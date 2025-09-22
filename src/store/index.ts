import { configureStore } from "@reduxjs/toolkit";
import inventoryReducer from "./slices/inventorySlice";
import ordersReducer from "./slices/ordersSlice";
import forecastsReducer from "./slices/forecastsSlice";
import restockReducer from "./slices/restockSlice";
import { cookbookApi } from "../services/cookbookApi";


export const store = configureStore({
  reducer: {
    inventory: inventoryReducer,
    orders: ordersReducer,
    forecasts: forecastsReducer,
    restock: restockReducer,
    [cookbookApi.reducerPath]: cookbookApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      cookbookApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


