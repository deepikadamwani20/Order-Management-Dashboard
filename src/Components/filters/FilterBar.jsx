import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearch, setStatusFilter, setAmountRange, setDateRange } from '../features/orders/orderSlice';
import { useDebounce } from '../hooks/useDebounce';
import { selectUI_ } from '../features/orders/orderSelectors';
import './FilterBar.css';

const STATUSES = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];

export default function FilterBar() {
  const dispatch = useDispatch();
  const ui = useSelector(selectUI_);
  const [searchInput, setSearchInput] = useState('');
  const debounced = useDebounce(searchInput, 300);

  React.useEffect(() => { dispatch(setSearch(debounced)); }, [debounced, dispatch]);

  return (
    <div className="filter-bar">
      <input className="filter-search" placeholder="🔍 Search by Order ID or Customer..."
        value={searchInput} onChange={e => setSearchInput(e.target.value)} />
      <select className="filter-select" value={ui.statusFilter}
        onChange={e => dispatch(setStatusFilter(e.target.value))}>
        {STATUSES.map(s => <option key={s}>{s}</option>)}
      </select>
      <div className="filter-amount">
        <input type="number" placeholder="Min $" value={ui.amountRange.min}
          onChange={e => dispatch(setAmountRange({ ...ui.amountRange, min: e.target.value }))} />
        <span>–</span>
        <input type="number" placeholder="Max $" value={ui.amountRange.max}
          onChange={e => dispatch(setAmountRange({ ...ui.amountRange, max: e.target.value }))} />
      </div>
      <div className="filter-dates">
        <input type="date" value={ui.dateRange.start}
          onChange={e => dispatch(setDateRange({ ...ui.dateRange, start: e.target.value }))} />
        <span>→</span>
        <input type="date" value={ui.dateRange.end}
          onChange={e => dispatch(setDateRange({ ...ui.dateRange, end: e.target.value }))} />
      </div>
    </div>
  );
}