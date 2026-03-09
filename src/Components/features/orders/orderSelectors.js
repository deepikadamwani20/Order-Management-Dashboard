import { createSelector } from '@reduxjs/toolkit';
import { parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

const selectOrdersState = state => state.orders;
const selectUI = state => state.orders.ui;

export const selectAllOrders = createSelector(
  selectOrdersState,
  ({ ids, entities }) => ids.map(id => entities[id])
);

export const selectFilteredSortedOrders = createSelector(
  selectAllOrders,
  selectUI,
  (orders, ui) => {
    let result = orders;

    // Search
    if (ui.searchTerm) {
      const term = ui.searchTerm.toLowerCase();
      result = result.filter(o =>
        o.id.toLowerCase().includes(term) ||
        o.customerName.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (ui.statusFilter !== 'All') {
      result = result.filter(o => o.status === ui.statusFilter);
    }

    // Amount range
    if (ui.amountRange.min !== '') result = result.filter(o => o.amount >= Number(ui.amountRange.min));
    if (ui.amountRange.max !== '') result = result.filter(o => o.amount <= Number(ui.amountRange.max));

    // Date range
    if (ui.dateRange.start && ui.dateRange.end) {
      const start = startOfDay(parseISO(ui.dateRange.start));
      const end = endOfDay(parseISO(ui.dateRange.end));
      result = result.filter(o => isWithinInterval(parseISO(o.createdAt), { start, end }));
    }

    // Sort
    result = [...result].sort((a, b) => {
      let valA = a[ui.sortBy], valB = b[ui.sortBy];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return ui.sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return ui.sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }
);

export const selectPaginatedOrders = createSelector(
  selectFilteredSortedOrders,
  selectUI,
  (orders, ui) => {
    const start = (ui.currentPage - 1) * ui.pageSize;
    return orders.slice(start, start + ui.pageSize);
  }
);

export const selectTotalPages = createSelector(
  selectFilteredSortedOrders,
  selectUI,
  (orders, ui) => Math.ceil(orders.length / ui.pageSize)
);

export const selectUI_ = selectUI;
export const selectHighlightedIds = state => state.orders.ui.highlightedIds;
export const selectSelectedIds = state => state.orders.ui.selectedIds;