import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { realtimeUpdate, clearHighlight } from '../features/orders/orderSlice';
import { ordersApi } from '../../api/ordersApi';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];

export function useRealTimeUpdates(active = true) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!active) return;

    const run = () => {
      const order = ordersApi.getRandomOrder();
      if (!order) return;

      const changes = {
        status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
        amount: parseFloat((Math.random() * 9000 + 10).toFixed(2)),
        updatedAt: new Date().toISOString(),
      };

      ordersApi.updateInDB(order.id, changes);
      dispatch(realtimeUpdate({ id: order.id, changes }));

      // Remove highlight after 2s
      setTimeout(() => dispatch(clearHighlight(order.id)), 2000);
    };

    const delay = () => Math.floor(Math.random() * 5000) + 5000; // 5–10s
    let timeout;
    const schedule = () => { timeout = setTimeout(() => { run(); schedule(); }, delay()); };
    schedule();

    return () => clearTimeout(timeout);
  }, [active, dispatch]);
}