import { generateOrders } from '../Components/utils/generateOrders';

// Seed once
let ordersDB = generateOrders(2000);

export const ordersApi = {
  getAll: () => new Promise(res => setTimeout(() => res([...ordersDB]), 600)),

  patch: (id, changes) => new Promise((res, rej) => {
    setTimeout(() => {
      const idx = ordersDB.findIndex(o => o.id === id);
      if (idx === -1) return rej(new Error('Not found'));
      ordersDB[idx] = { ...ordersDB[idx], ...changes, updatedAt: new Date().toISOString() };
      res({ ...ordersDB[idx] });
    }, 400);
  }),

  delete: (ids) => new Promise(res => {
    setTimeout(() => {
      ordersDB = ordersDB.filter(o => !ids.includes(o.id));
      res({ deleted: ids });
    }, 400);
  }),

  // Used internally by real-time hook
  getRandomOrder: () => ordersDB[Math.floor(Math.random() * ordersDB.length)],
  updateInDB: (id, changes) => {
    const idx = ordersDB.findIndex(o => o.id === id);
    if (idx !== -1) ordersDB[idx] = { ...ordersDB[idx], ...changes };
  }
};