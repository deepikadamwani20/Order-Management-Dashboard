import React from 'react';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelectedIds, selectFilteredSortedOrders } from '../features/orders/orderSelectors';
import { clearSelection, selectAll, deleteOrders, patchOrder } from '../features/orders/orderSlice';
import { exportToCSV, exportToJSON } from '../utils/exportUtils';
// import './BulkActionsBar.css';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];

export default function BulkActionsBar({ pageIds }) {
  const dispatch = useDispatch();
  const selectedIds = useSelector(selectSelectedIds);
  const allOrders = useSelector(selectFilteredSortedOrders);
  const count = selectedIds.size;

  const selectedOrders = allOrders.filter(o => selectedIds.has(o.id));

  const handleBulkStatus = useCallback((status) => {
    selectedIds.forEach(id => dispatch(patchOrder({ id, changes: { status } })));
  }, [selectedIds, dispatch]);

  const handleBulkDelete = useCallback(() => {
    if (!window.confirm(`Delete ${count} orders?`)) return;
    dispatch(deleteOrders([...selectedIds]));
  }, [selectedIds, count, dispatch]);

  if (count === 0) return null;

  return (
    <div className="bulk-bar">
      <span className="bulk-count">{count} selected</span>
      <button onClick={() => dispatch(selectAll(pageIds))}>Select Page</button>
      <button onClick={() => dispatch(clearSelection())}>Clear</button>
      <select onChange={e => e.target.value && handleBulkStatus(e.target.value)} defaultValue="">
        <option value="" disabled>Bulk Status</option>
        {STATUSES.map(s => <option key={s}>{s}</option>)}
      </select>
      <button className="bulk-delete" onClick={handleBulkDelete}>🗑 Delete</button>
      <button onClick={() => exportToCSV(selectedOrders)}>⬇ CSV</button>
      <button onClick={() => exportToJSON(selectedOrders)}>⬇ JSON</button>
    </div>
  );
}