export const users = [
  { id: 'buyer1', username: 'buyer@varroc.com', password: 'buyer123', role: 'buyer', name: 'Buyer' },
  { id: 'vendor1', username: 'vendor1@josts.com', password: 'vendor123', role: 'vendor', name: 'Rajesh Patel', vendorCode: 'CCJ0040', vendorName: 'JOSTS ENGINEERING COMPANY' },
  { id: 'vendor2', username: 'vendor2@shreeswami.com', password: 'vendor123', role: 'vendor', name: 'Amit Shah', vendorCode: 'CSS0905', vendorName: 'SHREE SWAMI ENTERPRISES' }
];
export const categories = ['Electrical', 'Molding', 'SM&F'];
export const plants = ['1900', '5100'];
export const customers = ['TATA', 'Birla'];
export const quarters = ['Q2FY2526', 'Q3FY2526'];
export const pliRequests = [
  { id: 'REQ-001', vendorCode: 'CCJ0040', vendorName: 'JOSTS ENGINEERING COMPANY', plant: '5100', noOfItems: 2, requestDate: '2026-02-19', status: 'Pending Submission', pliName: 'TATA_Q3FY2526_BU_26_15', customer: 'TATA', quarter: 'Q3FY2526', category: 'Electrical', buyerName: 'Buyer', items: [{ id: 'I1', plant: '5100', componentCode: 'B00019000001', componentDescription: 'ADHESIVE ANABOND-221', uom: 'KG', effectiveQuarter: 'Q3FY2526', effectiveRate: 3500, status: 'Pending Submission' }, { id: 'I2', plant: '5100', componentCode: 'B00019000002', componentDescription: 'CABLE HARNESS 12V', uom: 'NOS', effectiveQuarter: 'Q3FY2526', effectiveRate: 1250, status: 'Pending Submission' }] },
  { id: 'REQ-002', vendorCode: 'CCJ0040', vendorName: 'JOSTS ENGINEERING COMPANY', plant: '1900', noOfItems: 2, requestDate: '2026-02-19', status: 'Submitted', pliName: 'TATA_Q3FY2526_BU_26_14', customer: 'TATA', quarter: 'Q3FY2526', category: 'Electrical', buyerName: 'Buyer', items: [{ id: 'I3', plant: '1900', componentCode: 'B00019000005', componentDescription: 'RELAY MODULE 24V', uom: 'NOS', effectiveQuarter: 'Q3FY2526', effectiveRate: 890, status: 'Submitted' }, { id: 'I4', plant: '1900', componentCode: 'B00019000006', componentDescription: 'FUSE HOLDER', uom: 'NOS', effectiveQuarter: 'Q3FY2526', effectiveRate: 125, status: 'Submitted' }] },
  { id: 'REQ-003', vendorCode: 'CCJ0040', vendorName: 'JOSTS ENGINEERING COMPANY', plant: '1900', noOfItems: 2, requestDate: '2026-02-18', status: 'Closed', pliName: 'TATA_Q3FY2526_BU_26_11', customer: 'TATA', quarter: 'Q3FY2526', category: 'Molding', buyerName: 'Buyer', items: [{ id: 'I5', plant: '1900', componentCode: 'M00019000001', componentDescription: 'HOUSING MOLD UPPER', uom: 'NOS', effectiveQuarter: 'Q3FY2526', effectiveRate: 2800, status: 'Closed' }, { id: 'I6', plant: '1900', componentCode: 'M00019000002', componentDescription: 'GROMMET SEAL', uom: 'NOS', effectiveQuarter: 'Q3FY2526', effectiveRate: 75, status: 'Closed' }] },
  { id: 'REQ-004', vendorCode: 'CSS0905', vendorName: 'SHREE SWAMI ENTERPRISES', plant: '1900', noOfItems: 2, requestDate: '2026-02-18', status: 'Pending Submission', pliName: 'Birla_Q2FY2526_BU_25_135', customer: 'Birla', quarter: 'Q2FY2526', category: 'SM&F', buyerName: 'Buyer', items: [{ id: 'I7', plant: '1900', componentCode: 'S00019000007', componentDescription: 'HINGE HEAVY DUTY', uom: 'NOS', effectiveQuarter: 'Q2FY2526', effectiveRate: 320, status: 'Pending Submission' }, { id: 'I8', plant: '1900', componentCode: 'S00019000008', componentDescription: 'SHAFT DRIVE STEEL', uom: 'NOS', effectiveQuarter: 'Q2FY2526', effectiveRate: 1800, status: 'Pending Submission' }] }
];
export const pliNames = [
  { name: 'TATA_Q3FY2526_BU_26_15', totalParts: 2, approved: 0, cancelled: 0, pending: 2, startDate: '2026-02-19' },
  { name: 'TATA_Q3FY2526_BU_26_14', totalParts: 2, approved: 0, cancelled: 0, pending: 2, startDate: '2026-02-19' },
  { name: 'TATA_Q3FY2526_BU_26_11', totalParts: 2, approved: 2, cancelled: 0, pending: 0, startDate: '2026-02-18' },
  { name: 'Birla_Q2FY2526_BU_25_135', totalParts: 2, approved: 0, cancelled: 0, pending: 2, startDate: '2026-02-18' }
];
export const vendorSummary = [
  { vendorCode: 'CCJ0040', totalParts: 6, approved: 2, cancelled: 0, pending: 4 },
  { vendorCode: 'CSS0905', totalParts: 2, approved: 0, cancelled: 0, pending: 2 }
];
export function getDashboardSummary(requests) {
  if (!requests) requests = pliRequests;
  const totalPLI = new Set(requests.map(r => r.pliName)).size;
  const totalBOCodes = requests.reduce((sum, r) => sum + r.noOfItems, 0);
  const pendingSubmissions = requests.filter(r => r.status === 'Pending Submission' || r.status === 'Rejected').reduce((sum, r) => sum + r.noOfItems, 0);
  const activePLI = new Set(requests.filter(r => r.status !== 'Closed' && r.status !== 'Cancelled').map(r => r.pliName)).size;
  return { totalPLI, totalBOCodes, avgDaysClosure: 31, pendingSubmissions, activePLI };
}
export function getPLIStatusOverview(requests) {
  if (!requests) requests = pliRequests;
  const pliMap = {};
  requests.forEach(r => { if (!pliMap[r.pliName]) pliMap[r.pliName] = []; pliMap[r.pliName].push(r.status); });
  let approved = 0, pending = 0, cancelled = 0;
  Object.values(pliMap).forEach(statuses => {
    const hasPending = statuses.some(s => s === 'Pending Submission' || s === 'Submitted' || s === 'Rejected');
    const allCancelled = statuses.every(s => s === 'Cancelled');
    const hasApproved = statuses.some(s => s === 'Closed');
    if (hasPending) pending++; else if (allCancelled) cancelled++; else if (hasApproved) approved++;
  });
  return [{ name: 'Approved', value: approved, color: '#22c55e' }, { name: 'Pending', value: pending, color: '#eab308' }, { name: 'Cancelled', value: cancelled, color: '#ef4444' }];
}
export function getCategorySummary(requests) {
  if (!requests) requests = pliRequests;
  const catMap = {};
  requests.forEach(r => {
    if (!catMap[r.category]) catMap[r.category] = { approved: 0, pending: 0, cancelled: 0 };
    if (r.status === 'Closed') catMap[r.category].approved += r.noOfItems;
    else if (r.status === 'Cancelled') catMap[r.category].cancelled += r.noOfItems;
    else catMap[r.category].pending += r.noOfItems;
  });
  return Object.entries(catMap).map(e => ({ name: e[0], Approved: e[1].approved, Pending: e[1].pending, Cancelled: e[1].cancelled }));
}
