import React from 'react';
import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSelect, optimisticUpdate, rollbackUpdate } from '../features/orders/orderSlice';
import { patchOrder } from '../features/orders/orderSlice';
import { format } from 'date-fns';
import './OrderRow.css';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];

const STATUS_CLASS = {
  Pending: 'status-pending', Processing: 'status-processing', Shipped: 'status-shipped',
  Delivered: 'status-delivered', Cancelled: 'status-cancelled', Refunded: 'status-refunded',
};

const OrderRow = React.memo(function OrderRow({ orderId, isSelected, isHighlighted }) {
  const dispatch = useDispatch();
  const order = useSelector(state => state.orders.entities[orderId]);
  const [editing, setEditing] = useState(false);

  const handleStatusChange = useCallback(async (e) => {
    const newStatus = e.target.value;
    const original = { ...order };
    dispatch(optimisticUpdate({ id: orderId, changes: { status: newStatus } }));
    setEditing(false);
    const result = await dispatch(patchOrder({ id: orderId, changes: { status: newStatus } }));
    if (patchOrder.rejected.match(result)) {
      dispatch(rollbackUpdate({ id: orderId, original }));
    }
  }, [order, orderId, dispatch]);

  if (!order) return null;

  return (
    <tr className={`order-row ${isSelected ? 'row-selected' : ''} ${isHighlighted ? 'row-highlight' : ''}`}>
      <td>
        <input type="checkbox" checked={isSelected} onChange={() => dispatch(toggleSelect(orderId))} />
      </td>
      <td className="order-id">{order.id}</td>
      <td>{order.customerName}</td>
      <td className="order-amount">${order.amount.toFixed(2)}</td>
      <td>
        {editing ? (
          <select autoFocus defaultValue={order.status} onBlur={() => setEditing(false)} onChange={handleStatusChange}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        ) : (
          <span className={`status-badge ${STATUS_CLASS[order.status]}`} onClick={() => setEditing(true)}
            title="Click to edit">
            {order.status}
          </span>
        )}
      </td>
      <td className="order-date">{format(new Date(order.createdAt), 'MMM d, yyyy')}</td>
      <td className="order-date">{format(new Date(order.updatedAt), 'MMM d, yyyy HH:mm')}</td>
    </tr>
  );
});

export default OrderRow;