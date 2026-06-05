import { pliRequests as defaultRequests } from '@/data/mockData';

const STORAGE_KEY = 'pli-portal-requests';

export function getRequests() {
  if (typeof window === 'undefined') return defaultRequests;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return defaultRequests;
}

export function saveRequests(requests) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch (e) {}
}

export function resetRequests() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function computeSummary(requests) {
  const totalPLI = new Set(requests.map(r => r.pliName)).size;
  const totalBOCodes = requests.reduce((s, r) => s + r.noOfItems, 0);
  const pendingSubmissions = requests.filter(r => r.status === 'Pending Submission' || r.status === 'Rejected').reduce((s, r) => s + r.noOfItems, 0);
  const activePLI = new Set(requests.filter(r => r.status !== 'Closed' && r.status !== 'Cancelled').map(r => r.pliName)).size;
  return { totalPLI, totalBOCodes, avgDaysClosure: 31, pendingSubmissions, activePLI };
}

export function computePLIStatus(requests) {
  const pliMap = {};
  requests.forEach(r => { if (!pliMap[r.pliName]) pliMap[r.pliName] = []; pliMap[r.pliName].push(r.status); });
  let approved = 0, pending = 0, cancelled = 0;
  Object.values(pliMap).forEach(statuses => {
    if (statuses.some(s => s === 'Pending Submission' || s === 'Submitted' || s === 'Rejected')) pending++;
    else if (statuses.every(s => s === 'Cancelled')) cancelled++;
    else if (statuses.some(s => s === 'Closed')) approved++;
  });
  return [{ name: 'Approved', value: approved, color: '#22c55e' }, { name: 'Pending', value: pending, color: '#eab308' }, { name: 'Cancelled', value: cancelled, color: '#ef4444' }];
}

export function computeCategorySummary(requests) {
  const catMap = {};
  requests.forEach(r => {
    if (!catMap[r.category]) catMap[r.category] = { approved: 0, pending: 0, cancelled: 0 };
    if (r.status === 'Closed') catMap[r.category].approved += r.noOfItems;
    else if (r.status === 'Cancelled') catMap[r.category].cancelled += r.noOfItems;
    else catMap[r.category].pending += r.noOfItems;
  });
  return Object.entries(catMap).map(e => ({ name: e[0], Approved: e[1].approved, Pending: e[1].pending, Cancelled: e[1].cancelled }));
}

export function computePLINames(requests) {
  const pliMap = {};
  requests.forEach(r => {
    if (!pliMap[r.pliName]) pliMap[r.pliName] = { name: r.pliName, totalParts: 0, approved: 0, cancelled: 0, pending: 0, startDate: r.requestDate };
    pliMap[r.pliName].totalParts += r.noOfItems;
    if (r.status === 'Closed') pliMap[r.pliName].approved += r.noOfItems;
    else if (r.status === 'Cancelled') pliMap[r.pliName].cancelled += r.noOfItems;
    else pliMap[r.pliName].pending += r.noOfItems;
  });
  return Object.values(pliMap);
}

export function computeVendorSummary(requests) {
  const vMap = {};
  requests.forEach(r => {
    if (!vMap[r.vendorCode]) vMap[r.vendorCode] = { vendorCode: r.vendorCode, totalParts: 0, approved: 0, cancelled: 0, pending: 0 };
    vMap[r.vendorCode].totalParts += r.noOfItems;
    if (r.status === 'Closed') vMap[r.vendorCode].approved += r.noOfItems;
    else if (r.status === 'Cancelled') vMap[r.vendorCode].cancelled += r.noOfItems;
    else vMap[r.vendorCode].pending += r.noOfItems;
  });
  return Object.values(vMap);
}
