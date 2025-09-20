import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Forecast } from "../../types";

export interface ForecastsState {
  items: Forecast[];
}

const initialState: ForecastsState = {
  items: [],
};

const forecastsSlice = createSlice({
  name: "forecasts",
  initialState,
  reducers: {
    setForecasts(state, action: PayloadAction<Forecast[]>) {
      state.items = action.payload;
    },
  },
});

export const { setForecasts } = forecastsSlice.actions;
export default forecastsSlice.reducer;


