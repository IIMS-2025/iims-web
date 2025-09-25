import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type InsightsTab = 'Inventory' | 'Revenue';

interface InsightsState {
  activeTab: InsightsTab;
}

// Helper function to save activeTab to localStorage
const saveActiveTabToStorage = (tab: InsightsTab): void => {
  try {
    localStorage.setItem('insightsActiveTab', tab);
  } catch (error) {
    console.warn('Error saving insights activeTab to localStorage:', error);
  }
};

const initialState: InsightsState = {
  activeTab: 'Inventory',
};

const insightsSlice = createSlice({
  name: 'insights',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<InsightsTab>) => {
      state.activeTab = action.payload;
      // Persist to localStorage
      saveActiveTabToStorage(action.payload);
    },
    resetInsights: (state) => {
      state.activeTab = 'Inventory';
      saveActiveTabToStorage('Inventory');
    },
  },
});

export const { setActiveTab, resetInsights } = insightsSlice.actions;
export default insightsSlice.reducer;

// Selectors
export const selectActiveTab = (state: { insights: InsightsState }) => state.insights.activeTab;
