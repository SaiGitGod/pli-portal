// ============================================================
// DATABASE ABSTRACTION LAYER
// ============================================================
// Currently: In-memory storage (demo/testing)
//
// TO CONNECT A REAL DATABASE:
// Your IT team replaces this single file.
// All functions below must keep the same names and return formats.
// The rest of the application does NOT change.
//
// Supported options:
// - PostgreSQL (recommended for production)
// - MySQL
// - MongoDB
// - Microsoft SQL Server
// - Any database your IT team prefers
//
// Example PostgreSQL replacement:
//   import { Pool } from 'pg';
//   const pool = new Pool({ connectionString: process.env.DATABASE_URL });
//   export async function getAllRequests() {
//     const { rows } = await pool.query('SELECT * FROM pli_requests ORDER BY request_date DESC');
//     return rows;
//   }
// ============================================================

import { pliRequests as defaultRequests } from '@/data/mockData';
import { vendorMaster, purchaseGroupBuyers, defaultCCBuyer } from '@/data/vendorDatabase';

// In-memory store (resets when server restarts - replace with real DB)
let requestsStore = [...defaultRequests];

// ==================== PLI REQUESTS ====================

export async function getAllRequests() {
  return [...requestsStore];
}

export async function getRequestById(id) {
  return requestsStore.find(r => r.id === id) || null;
}

export async function getRequestsByVendor(vendorCode) {
  return requestsStore.filter(r => r.vendorCode === vendorCode);
}

export async function getRequestsByStatus(status) {
  if (status === 'pending') return requestsStore.filter(r => r.status === 'Pending Submission' || r.status === 'Rejected');
  if (status === 'submitted') return requestsStore.filter(r => r.status === 'Submitted');
  if (status === 'closed') return requestsStore.filter(r => r.status === 'Closed');
  return [...requestsStore];
}

export async function addRequests(newRequests) {
  requestsStore = [...newRequests, ...requestsStore];
  return requestsStore;
}

export async function updateRequestStatus(id, newStatus, extraData) {
  requestsStore = requestsStore.map(r => {
    if (r.id !== id) return r;
    return {
      ...r,
      status: newStatus,
      ...extraData,
      items: r.items.map(item => ({ ...item, status: newStatus }))
    };
  });
  return requestsStore.find(r => r.id === id);
}

export async function updateRequestItems(id, updatedItems) {
  requestsStore = requestsStore.map(r => {
    if (r.id !== id) return r;
    return {
      ...r,
      items: r.items.map(item => {
        const update = updatedItems[item.id];
        if (update !== undefined) return { ...item, effectiveRate: update };
        return item;
      })
    };
  });
  return requestsStore.find(r => r.id === id);
}

// ==================== VENDOR MASTER ====================

export async function getVendor(vendorCode) {
  return vendorMaster.find(v => v.vendorCode === vendorCode) || null;
}

export async function getAllVendors() {
  return [...vendorMaster];
}

// ==================== PURCHASE GROUP / BUYER ====================

export async function getBuyer(purchaseGroup) {
  const found = purchaseGroupBuyers.find(b => b.purchaseGroup === purchaseGroup);
  if (found) return found;
  return { purchaseGroup, categoryName: purchaseGroup, buyerEmail: defaultCCBuyer.email, buyerName: defaultCCBuyer.name };
}

// ==================== DASHBOARD COMPUTATIONS ====================

export async function getDashboardData() {
  const requests = await getAllRequests();

  const totalPLI = new Set(requests.map(r => r.pliName)).size;
  const totalBOCodes = requests.reduce((s, r) => s + r.noOfItems, 0);
  const pendingSubmissions = requests.filter(r => r.status === 'Pending Submission' || r.status === 'Rejected').reduce((s, r) => s + r.noOfItems, 0);
  const activePLI = new Set(requests.filter(r => r.status !== 'Closed' && r.status !== 'Cancelled').map(r => r.pliName)).size;

  const pliMap = {};
  requests.forEach(r => { if (!pliMap[r.pliName]) pliMap[r.pliName] = []; pliMap[r.pliName].push(r); });
  let approvedPLI = 0, pendingPLI = 0, cancelledPLI = 0;
  Object.values(pliMap).forEach(group => {
    const statuses = group.map(r => r.status);
    if (statuses.some(s => s === 'Pending Submission' || s === 'Submitted' || s === 'Rejected')) pendingPLI++;
    else if (statuses.every(s => s === 'Cancelled')) cancelledPLI++;
    else if (statuses.some(s => s === 'Closed')) approvedPLI++;
  });

  const catMap = {};
  requests.forEach(r => {
    if (!catMap[r.category]) catMap[r.category] = { approved: 0, pending: 0, cancelled: 0 };
    if (r.status === 'Closed') catMap[r.category].approved += r.noOfItems;
    else if (r.status === 'Cancelled') catMap[r.category].cancelled += r.noOfItems;
    else catMap[r.category].pending += r.noOfItems;
  });

  const pliSummary = Object.entries(pliMap).map(([name, group]) => ({
    name,
    totalParts: group.reduce((s, r) => s + r.noOfItems, 0),
    approved: group.filter(r => r.status === 'Closed').reduce((s, r) => s + r.noOfItems, 0),
    cancelled: group.filter(r => r.status === 'Cancelled').reduce((s, r) => s + r.noOfItems, 0),
    pending: group.filter(r => r.status !== 'Closed' && r.status !== 'Cancelled').reduce((s, r) => s + r.noOfItems, 0),
    startDate: group[0].requestDate
  }));

  const vMap = {};
  requests.forEach(r => {
    if (!vMap[r.vendorCode]) vMap[r.vendorCode] = { vendorCode: r.vendorCode, totalParts: 0, approved: 0, cancelled: 0, pending: 0 };
    vMap[r.vendorCode].totalParts += r.noOfItems;
    if (r.status === 'Closed') vMap[r.vendorCode].approved += r.noOfItems;
    else if (r.status === 'Cancelled') vMap[r.vendorCode].cancelled += r.noOfItems;
    else vMap[r.vendorCode].pending += r.noOfItems;
  });

  return {
    summary: { totalPLI, totalBOCodes, avgDaysClosure: 31, pendingSubmissions, activePLI },
    pliStatus: [
      { name: 'Approved', value: approvedPLI, color: '#22c55e' },
      { name: 'Pending', value: pendingPLI, color: '#eab308' },
      { name: 'Cancelled', value: cancelledPLI, color: '#ef4444' }
    ],
    categorySummary: Object.entries(catMap).map(e => ({ name: e[0], Approved: e[1].approved, Pending: e[1].pending, Cancelled: e[1].cancelled })),
    pliSummary,
    vendorSummary: Object.values(vMap)
  };
}

// ==================== TILE COUNTS ====================

export async function getTileCounts() {
  const requests = await getAllRequests();
  return {
    all: requests.reduce((s, r) => s + r.noOfItems, 0),
    pending: requests.filter(r => r.status === 'Pending Submission' || r.status === 'Rejected').reduce((s, r) => s + r.noOfItems, 0),
    submitted: requests.filter(r => r.status === 'Submitted').reduce((s, r) => s + r.noOfItems, 0),
    closed: requests.filter(r => r.status === 'Closed').reduce((s, r) => s + r.noOfItems, 0)
  };
}
