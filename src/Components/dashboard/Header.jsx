import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import './Header.css';

export default function Header() {
  const dispatch = useDispatch();
  const email = useSelector(s => s.auth.email);
  return (
    <header className="header">
      <div className="header-brand">⚡ <span>OrderFlow</span></div>
      <div className="header-user">
        <span className="header-email">{email}</span>
        <button className="logout-btn" onClick={() => dispatch(logout())}>Logout</button>
      </div>
    </header>
  );
}