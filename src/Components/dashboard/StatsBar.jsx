import React from 'react';
import { useSelector } from 'react-redux';
import { selectFilteredSortedOrders } from '../features/orders/orderSelectors';
import './StatsBar.css';

export default function StatsBar() {
  const orders = useSelector(selectFilteredSortedOrders);
  const total = orders.length;
  const revenue = orders.reduce((s, o) => s + o.amount, 0);
  const pending = orders.filter(o => o.status === 'Pending').length;
  const delivered = orders.filter(o => o.status === 'Delivered').length;

  return (
    <div className="stats-bar">
      <div className="stat"><span className="stat-val">{total.toLocaleString()}</span><span className="stat-label">Total Orders</span></div>
      <div className="stat"><span className="stat-val">${revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span><span className="stat-label">Revenue</span></div>
      <div className="stat"><span className="stat-val">{pending}</span><span className="stat-label">Pending</span></div>
      <div className="stat"><span className="stat-val">{delivered}</span><span className="stat-label">Delivered</span></div>
    </div>
  );
}