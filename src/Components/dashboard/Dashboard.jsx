import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../features/orders/orderSlice';
import { useRealTimeUpdates } from '../hooks/useRealTimeUpdates';
import Header from './Header';
import StatsBar from './StatsBar';
import FilterBar from '../filters/FilterBar';
import OrdersTable from "../orders/OrdersTable"
import './Dashboard.css';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(s => s.orders);

  useEffect(() => { dispatch(fetchOrders()); }, [dispatch]);
  useRealTimeUpdates(true);

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-spinner" />
      <p>Loading 2,000 orders...</p>
    </div>
  );

  if (error) return <div className="error-screen">Error: {error}</div>;

  return (
    <div className="dashboard">
      <Header />
      <StatsBar />
      <FilterBar />
      <OrdersTable />
    </div>
  );
}