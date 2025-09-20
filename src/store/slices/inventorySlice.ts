import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Inventory } from "../../types";

export interface InventoryState {
  items: Inventory[];
  loading: boolean;
}

const initialState: InventoryState = {
  items: [],
  loading: false,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setInventory(state, action: PayloadAction<Inventory[]>) {
      state.items = action.payload;
    },
    upsertInventory(state, action: PayloadAction<Inventory>) {
      const idx = state.items.findIndex(
        (i) =>
          i.location_id === action.payload.location_id &&
          i.product_id === action.payload.product_id
      );
      if (idx >= 0) {
        state.items[idx] = action.payload;
      } else {
        state.items.push(action.payload);
      }
    },
  },
});

export const { setInventory, upsertInventory } = inventorySlice.actions;
export default inventorySlice.reducer;


