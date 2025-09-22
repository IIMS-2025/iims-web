import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RestockItem, RestockFilter, RestockPriority, RestockStatus } from '../../types';

interface RestockState {
    items: RestockItem[];
    selectedItems: string[]; // Array of item IDs
    filter: RestockFilter;
    loading: boolean;
    error: string | null;
    bulkOperationsLoading: boolean;
    lastUpdated: string | null;
}

const initialState: RestockState = {
    items: [],
    selectedItems: [],
    filter: {
        category: undefined,
        priority: undefined,
        status: undefined,
        search: undefined,
    },
    loading: false,
    error: null,
    bulkOperationsLoading: false,
    lastUpdated: null,
};

const restockSlice = createSlice({
    name: 'restock',
    initialState,
    reducers: {
        // Loading states
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
            if (action.payload) {
                state.error = null;
            }
        },
        setBulkOperationsLoading: (state, action: PayloadAction<boolean>) => {
            state.bulkOperationsLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
            state.bulkOperationsLoading = false;
        },

        // Data management
        setRestockItems: (state, action: PayloadAction<RestockItem[]>) => {
            state.items = action.payload;
            state.loading = false;
            state.error = null;
            state.lastUpdated = new Date().toISOString();
        },
        addRestockItem: (state, action: PayloadAction<RestockItem>) => {
            state.items.push(action.payload);
            state.lastUpdated = new Date().toISOString();
        },
        updateRestockItem: (state, action: PayloadAction<{ id: string; updates: Partial<RestockItem> }>) => {
            const { id, updates } = action.payload;
            const itemIndex = state.items.findIndex(item => item.id === id);
            if (itemIndex !== -1) {
                state.items[itemIndex] = {
                    ...state.items[itemIndex],
                    ...updates,
                    last_updated: new Date().toISOString()
                };
            }
            state.lastUpdated = new Date().toISOString();
        },
        updateMultipleRestockItems: (state, action: PayloadAction<RestockItem[]>) => {
            const updatedItems = action.payload;
            updatedItems.forEach(updatedItem => {
                const itemIndex = state.items.findIndex(item => item.id === updatedItem.id);
                if (itemIndex !== -1) {
                    state.items[itemIndex] = updatedItem;
                }
            });
            state.bulkOperationsLoading = false;
            state.lastUpdated = new Date().toISOString();
        },
        removeRestockItem: (state, action: PayloadAction<string>) => {
            const itemId = action.payload;
            state.items = state.items.filter(item => item.id !== itemId);
            state.selectedItems = state.selectedItems.filter(id => id !== itemId);
            state.lastUpdated = new Date().toISOString();
        },

        // Selection management
        selectItem: (state, action: PayloadAction<string>) => {
            const itemId = action.payload;
            if (!state.selectedItems.includes(itemId)) {
                state.selectedItems.push(itemId);
            }
        },
        deselectItem: (state, action: PayloadAction<string>) => {
            const itemId = action.payload;
            state.selectedItems = state.selectedItems.filter(id => id !== itemId);
        },
        toggleItemSelection: (state, action: PayloadAction<string>) => {
            const itemId = action.payload;
            if (state.selectedItems.includes(itemId)) {
                state.selectedItems = state.selectedItems.filter(id => id !== itemId);
            } else {
                state.selectedItems.push(itemId);
            }
        },
        selectAllItems: (state, action: PayloadAction<string[]>) => {
            state.selectedItems = action.payload;
        },
        clearSelection: (state) => {
            state.selectedItems = [];
        },

        // Filter management
        setFilter: (state, action: PayloadAction<Partial<RestockFilter>>) => {
            state.filter = { ...state.filter, ...action.payload };
        },
        clearFilter: (state) => {
            state.filter = {
                category: undefined,
                priority: undefined,
                status: undefined,
                search: undefined,
            };
        },
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.filter.search = action.payload;
        },
        setCategoryFilter: (state, action: PayloadAction<string | undefined>) => {
            state.filter.category = action.payload;
        },
        setPriorityFilter: (state, action: PayloadAction<RestockPriority | undefined>) => {
            state.filter.priority = action.payload;
        },
        setStatusFilter: (state, action: PayloadAction<RestockStatus | undefined>) => {
            state.filter.status = action.payload;
        },

        // Bulk operations
        bulkUpdatePriority: (state, action: PayloadAction<{ itemIds: string[]; priority: RestockPriority }>) => {
            const { itemIds, priority } = action.payload;
            state.items.forEach(item => {
                if (itemIds.includes(item.id)) {
                    item.priority = priority;
                    item.last_updated = new Date().toISOString();
                }
            });
            state.lastUpdated = new Date().toISOString();
        },
        bulkUpdateStatus: (state, action: PayloadAction<{ itemIds: string[]; status: RestockStatus }>) => {
            const { itemIds, status } = action.payload;
            state.items.forEach(item => {
                if (itemIds.includes(item.id)) {
                    item.status = status;
                    item.last_updated = new Date().toISOString();
                }
            });
            state.lastUpdated = new Date().toISOString();
        },
    },
});

export const {
    setLoading,
    setBulkOperationsLoading,
    setError,
    setRestockItems,
    addRestockItem,
    updateRestockItem,
    updateMultipleRestockItems,
    removeRestockItem,
    selectItem,
    deselectItem,
    toggleItemSelection,
    selectAllItems,
    clearSelection,
    setFilter,
    clearFilter,
    setSearchTerm,
    setCategoryFilter,
    setPriorityFilter,
    setStatusFilter,
    bulkUpdatePriority,
    bulkUpdateStatus,
} = restockSlice.actions;

export default restockSlice.reducer;

// Selectors
export const selectRestockItems = (state: { restock: RestockState }) => state.restock.items;
export const selectSelectedItems = (state: { restock: RestockState }) => state.restock.selectedItems;
export const selectRestockFilter = (state: { restock: RestockState }) => state.restock.filter;
export const selectRestockLoading = (state: { restock: RestockState }) => state.restock.loading;
export const selectRestockError = (state: { restock: RestockState }) => state.restock.error;
export const selectBulkOperationsLoading = (state: { restock: RestockState }) => state.restock.bulkOperationsLoading;

// Computed selectors
export const selectFilteredRestockItems = (state: { restock: RestockState }) => {
    const { items, filter } = state.restock;

    return items.filter(item => {
        // Category filter
        if (filter.category && filter.category !== 'all' && item.category.toLowerCase() !== filter.category.toLowerCase()) {
            return false;
        }

        // Priority filter
        if (filter.priority && filter.priority !== 'all' && item.priority !== filter.priority) {
            return false;
        }

        // Status filter
        if (filter.status && filter.status !== 'all' && item.status !== filter.status) {
            return false;
        }

        // Search filter
        if (filter.search) {
            const search = filter.search.toLowerCase();
            return item.product_name.toLowerCase().includes(search) ||
                item.category.toLowerCase().includes(search) ||
                (item.supplier && item.supplier.toLowerCase().includes(search));
        }

        return true;
    });
};

export const selectSelectedRestockItems = (state: { restock: RestockState }) => {
    const { items, selectedItems } = state.restock;
    return items.filter(item => selectedItems.includes(item.id));
};

export const selectTotalSelectedCost = (state: { restock: RestockState }) => {
    const selectedItems = selectSelectedRestockItems(state);
    return selectedItems.reduce((total, item) => total + item.estimated_cost, 0);
};

export const selectRestockStats = (state: { restock: RestockState }) => {
    const items = selectFilteredRestockItems(state);

    return {
        total: items.length,
        critical: items.filter(item => item.priority === 'critical').length,
        high: items.filter(item => item.priority === 'high').length,
        medium: items.filter(item => item.priority === 'medium').length,
        low: items.filter(item => item.priority === 'low').length,
        pending: items.filter(item => item.status === 'pending').length,
        ordered: items.filter(item => item.status === 'ordered').length,
        totalCost: items.reduce((sum, item) => sum + item.estimated_cost, 0),
    };
};
