import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ordersApi } from '../../../api/ordersApi';

export const fetchOrders = createAsyncThunk('orders/fetchAll', async () => {
  return await ordersApi.getAll();
});

export const patchOrder = createAsyncThunk('orders/patch', async ({ id, changes }, { rejectWithValue }) => {
  try {
    return await ordersApi.patch(id, changes);
  } catch (err) {
    return rejectWithValue({ id, error: err.message });
  }
});

export const deleteOrders = createAsyncThunk('orders/delete', async (ids) => {
  await ordersApi.delete(ids);
  return ids;
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    // Normalized: { ids: [], entities: {} }
    ids: [],
    entities: {},
    loading: false,
    error: null,
    // UI state — separate from server state
    ui: {
      searchTerm: '',
      statusFilter: 'All',
      amountRange: { min: '', max: '' },
      dateRange: { start: '', end: '' },
      sortBy: 'createdAt',
      sortDir: 'desc',
      selectedIds: new Set(),
      highlightedIds: new Set(),
      currentPage: 1,
      pageSize: 50,
    },
  },
  reducers: {
    // Real-time update (from useRealTimeUpdates hook)
    realtimeUpdate(state, action) {
      const { id, changes } = action.payload;
      if (state.entities[id]) {
        state.entities[id] = { ...state.entities[id], ...changes };
      }
      // Add to highlighted set (for row flash)
      state.ui.highlightedIds = new Set([...state.ui.highlightedIds, id]);
    },
    clearHighlight(state, action) {
      const next = new Set(state.ui.highlightedIds);
      next.delete(action.payload);
      state.ui.highlightedIds = next;
    },
    // Optimistic update
    optimisticUpdate(state, action) {
      const { id, changes } = action.payload;
      if (state.entities[id]) state.entities[id] = { ...state.entities[id], ...changes };
    },
    // Rollback
    rollbackUpdate(state, action) {
      const { id, original } = action.payload;
      if (state.entities[id]) state.entities[id] = original;
    },
    setSearch(state, action) { state.ui.searchTerm = action.payload; state.ui.currentPage = 1; },
    setStatusFilter(state, action) { state.ui.statusFilter = action.payload; state.ui.currentPage = 1; },
    setAmountRange(state, action) { state.ui.amountRange = action.payload; state.ui.currentPage = 1; },
    setDateRange(state, action) { state.ui.dateRange = action.payload; state.ui.currentPage = 1; },
    setSort(state, action) {
      if (state.ui.sortBy === action.payload) {
        state.ui.sortDir = state.ui.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        state.ui.sortBy = action.payload;
        state.ui.sortDir = 'desc';
      }
    },
    toggleSelect(state, action) {
      const next = new Set(state.ui.selectedIds);
      if (next.has(action.payload)) next.delete(action.payload);
      else next.add(action.payload);
      state.ui.selectedIds = next;
    },
    selectAll(state, action) { state.ui.selectedIds = new Set(action.payload); },
    clearSelection(state) { state.ui.selectedIds = new Set(); },
    setPage(state, action) { state.ui.currentPage = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.ids = action.payload.map(o => o.id);
        state.entities = Object.fromEntries(action.payload.map(o => [o.id, o]));
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(patchOrder.fulfilled, (state, action) => {
        state.entities[action.payload.id] = action.payload;
      })
      .addCase(patchOrder.rejected, (state, action) => {
        // Rollback is handled by the component via optimisticUpdate/rollbackUpdate
      })
      .addCase(deleteOrders.fulfilled, (state, action) => {
        const deletedIds = new Set(action.payload);
        state.ids = state.ids.filter(id => !deletedIds.has(id));
        deletedIds.forEach(id => delete state.entities[id]);
        state.ui.selectedIds = new Set();
      });
  },
});

export const {
  realtimeUpdate, clearHighlight, optimisticUpdate, rollbackUpdate,
  setSearch, setStatusFilter, setAmountRange, setDateRange,
  setSort, toggleSelect, selectAll, clearSelection, setPage,
} = ordersSlice.actions;

export default ordersSlice.reducer;