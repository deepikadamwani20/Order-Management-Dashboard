export function exportToCSV(orders, filename = 'orders.csv') {
  const headers = ['ID', 'Customer Name', 'Amount', 'Status', 'Created At', 'Updated At'];
  const rows = orders.map(o => [o.id, o.customerName, o.amount, o.status, o.createdAt, o.updatedAt]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  downloadFile(csv, filename, 'text/csv');
}

export function exportToJSON(orders, filename = 'orders.json') {
  downloadFile(JSON.stringify(orders, null, 2), filename, 'application/json');
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}