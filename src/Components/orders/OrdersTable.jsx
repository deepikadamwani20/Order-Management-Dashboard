import React from 'react';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSort, setPage, selectAll, clearSelection } from '../features/orders/orderSlice';
import {
  selectPaginatedOrders, selectTotalPages, selectUI_,
  selectSelectedIds, selectHighlightedIds
} from '../features/orders/orderSelectors';
import OrderRow from './OrderRow';
import BulkActionsBar from '../bulk/BulkActionBar';
import './OrdersTable.css';

function SortIcon({ col, sortBy, sortDir }) {
  if (sortBy !== col) return <span className="sort-icon">↕</span>;
  return <span className="sort-icon active">{sortDir === 'asc' ? '↑' : '↓'}</span>;
}

export default function OrdersTable() {
  const dispatch = useDispatch();
  const orders = useSelector(selectPaginatedOrders);
  const totalPages = useSelector(selectTotalPages);
  const ui = useSelector(selectUI_);
  const selectedIds = useSelector(selectSelectedIds);
  const highlightedIds = useSelector(selectHighlightedIds);

  const pageIds = useMemo(() => orders.map(o => o.id), [orders]);

  const allPageSelected = pageIds.length > 0 && pageIds.every(id => selectedIds.has(id));

  const handleSelectAll = useCallback(() => {
    if (allPageSelected) dispatch(clearSelection());
    else dispatch(selectAll(pageIds));
  }, [allPageSelected, pageIds, dispatch]);

  const SORTABLE = [
    { key: 'amount', label: 'Amount' },
    { key: 'createdAt', label: 'Created Date' },
    { key: 'updatedAt', label: 'Updated Date' },
  ];

  return (
    <div className="table-container">
      <BulkActionsBar pageIds={pageIds} />
      <div className="table-scroll">
        <table className="orders-table">
          <thead>
            <tr>
              <th><input type="checkbox" checked={allPageSelected} onChange={handleSelectAll} /></th>
              <th>Order ID</th>
              <th>Customer</th>
              {SORTABLE.map(s => (
                <th key={s.key} className="sortable" onClick={() => dispatch(setSort(s.key))}>
                  {s.label} <SortIcon col={s.key} sortBy={ui.sortBy} sortDir={ui.sortDir} />
                </th>
              ))}
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <OrderRow
                key={order.id}
                orderId={order.id}
                isSelected={selectedIds.has(order.id)}
                isHighlighted={highlightedIds.has(order.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button disabled={ui.currentPage === 1} onClick={() => dispatch(setPage(ui.currentPage - 1))}>← Prev</button>
        <span>Page {ui.currentPage} of {totalPages}</span>
        <button disabled={ui.currentPage === totalPages} onClick={() => dispatch(setPage(ui.currentPage + 1))}>Next →</button>
      </div>
    </div>
  );
}