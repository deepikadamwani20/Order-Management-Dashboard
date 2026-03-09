import { subDays, subHours } from 'date-fns';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];
const FIRST_NAMES = ['Alice','Bob','Carol','David','Eva','Frank','Grace','Hank','Iris','Jake'];
const LAST_NAMES = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis'];

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomName() {
  return `${FIRST_NAMES[randomBetween(0,9)]} ${LAST_NAMES[randomBetween(0,7)]}`;
}

export function generateOrders(count = 2000) {
  return Array.from({ length: count }, (_, i) => {
    const createdDate = subDays(new Date(), randomBetween(1, 365));
    const updatedDate = subHours(createdDate, randomBetween(0, 48) * -1);
    return {
      id: `ORD-${String(i + 1).padStart(5, '0')}`,
      customerName: randomName(),
      amount: parseFloat((randomBetween(10, 9999) + Math.random()).toFixed(2)),
      status: STATUSES[randomBetween(0, 5)],
      createdAt: createdDate.toISOString(),
      updatedAt: updatedDate.toISOString(),
    };
  });
}