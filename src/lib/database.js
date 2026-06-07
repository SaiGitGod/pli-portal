import { sql } from '@vercel/postgres';

// ==================== PLI REQUESTS ====================

export async function getAllRequests() {
  const { rows: requests } = await sql`SELECT * FROM pli_requests ORDER BY created_at DESC`;
  for (const req of requests) {
    const { rows: items } = await sql`SELECT * FROM pli_items WHERE request_id = ${req.id}`;
    req.items = items.map(item => ({
      id: item.id, plant: item.plant, componentCode: item.component_code,
      componentDescription: item.component_description, uom: item.uom,
      effectiveQuarter: item.effective_quarter, effectiveRate: parseFloat(item.effective_rate),
      status: item.status
    }));
    req.vendorCode = req.vendor_code;
    req.vendorName = req.vendor_name;
    req.noOfItems = req.no_of_items;
    req.requestDate = req.request_date;
    req.pliName = req.pli_name;
    req.buyerName = req.buyer_name;
    req.submittedFileName = req.submitted_file_name;
    req.submittedDate = req.submitted_date;
    req.vendorComment = req.vendor_comment;
    req.rejectedBy = req.rejected_by;
    req.rejectionComment = req.rejection_comment;
    req.rejectionDate = req.rejection_date;
    req.submittedFileUrl = req.submitted_file_url;
  }
  return requests;
}

export async function getRequestById(id) {
  const all = await getAllRequests();
  return all.find(r => r.id === id) || null;
}

export async function getRequestsByVendor(vendorCode) {
  const all = await getAllRequests();
  return all.filter(r => r.vendorCode === vendorCode);
}

export async function getRequestsByStatus(status) {
  const all = await getAllRequests();
  if (status === 'pending') return all.filter(r => r.status === 'Pending Submission' || r.status === 'Rejected');
  if (status === 'submitted') return all.filter(r => r.status === 'Submitted');
  if (status === 'closed') return all.filter(r => r.status === 'Closed');
  return all;
}

export async function addRequests(newRequests) {
  for (const req of newRequests) {
    await sql`INSERT INTO pli_requests (id, vendor_code, vendor_name, plant, no_of_items, request_date, status, pli_name, customer, quarter, category, buyer_name) VALUES (${req.id}, ${req.vendorCode}, ${req.vendorName}, ${req.plant}, ${req.noOfItems}, ${req.requestDate}, ${req.status}, ${req.pliName}, ${req.customer}, ${req.quarter}, ${req.category}, ${req.buyerName})`;
    for (const item of req.items) {
      await sql`INSERT INTO pli_items (id, request_id, plant, component_code, component_description, uom, effective_quarter, effective_rate, status) VALUES (${item.id}, ${req.id}, ${item.plant}, ${item.componentCode}, ${item.componentDescription}, ${item.uom}, ${item.effectiveQuarter}, ${item.effectiveRate}, ${item.status})`;
    }
  }
  return await getAllRequests();
}

export async function updateRequestStatus(id, newStatus, extraData) {
  await sql`UPDATE pli_requests SET status = ${newStatus} WHERE id = ${id}`;
  await sql`UPDATE pli_items SET status = ${newStatus} WHERE request_id = ${id}`;
  if (extraData) {
    if (extraData.submittedFileName) await sql`UPDATE pli_requests SET submitted_file_name = ${extraData.submittedFileName}, submitted_date = ${extraData.submittedDate}, vendor_comment = ${extraData.vendorComment || ''}, submitted_file_url = ${extraData.submittedFileUrl || ''} WHERE id = ${id}`;
    if (extraData.rejectedBy) await sql`UPDATE pli_requests SET rejected_by = ${extraData.rejectedBy}, rejection_comment = ${extraData.rejectionComment || ''}, rejection_date = ${extraData.rejectionDate || ''} WHERE id = ${id}`;
  }
  return await getRequestById(id);
}

export async function updateRequestItems(id, updatedRates) {
  for (const [itemId, rate] of Object.entries(updatedRates)) {
    await sql`UPDATE pli_items SET effective_rate = ${rate} WHERE id = ${itemId}`;
  }
  return await getRequestById(id);
}

// ==================== VENDOR MASTER ====================

export async function getVendor(vendorCode) {
  const { rows } = await sql`SELECT * FROM vendors WHERE vendor_code = ${vendorCode}`;
  if (rows.length === 0) return null;
  return { vendorCode: rows[0].vendor_code, vendorName: rows[0].vendor_name, email: rows[0].email, contactPerson: rows[0].contact_person };
}

export async function getAllVendors() {
  const { rows } = await sql`SELECT * FROM vendors`;
  return rows.map(r => ({ vendorCode: r.vendor_code, vendorName: r.vendor_name, email: r.email, contactPerson: r.contact_person }));
}

// ==================== PURCHASE GROUP ====================

export async function getBuyer(purchaseGroup) {
  const { rows } = await sql`SELECT * FROM purchase_group_buyers WHERE purchase_group = ${purchaseGroup}`;
  if (rows.length === 0) return { purchaseGroup, categoryName: purchaseGroup, buyerEmail: 'SaiKrishna.Kodipaka@varroc.com', buyerName: 'Sai Krishna Kodipaka' };
  return { purchaseGroup: rows[0].purchase_group, categoryName: rows[0].category_name, buyerEmail: rows[0].buyer_email, buyerName: rows[0].buyer_name };
}

// ==================== DASHBOARD ====================

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
    name, totalParts: group.reduce((s, r) => s + r.noOfItems, 0),
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
    pliStatus: [{ name: 'Approved', value: approvedPLI, color: '#22c55e' }, { name: 'Pending', value: pendingPLI, color: '#eab308' }, { name: 'Cancelled', value: cancelledPLI, color: '#ef4444' }],
    categorySummary: Object.entries(catMap).map(e => ({ name: e[0], Approved: e[1].approved, Pending: e[1].pending, Cancelled: e[1].cancelled })),
    pliSummary,
    vendorSummary: Object.values(vMap)
  };
}

export async function getTileCounts() {
  const requests = await getAllRequests();
  return {
    all: requests.reduce((s, r) => s + r.noOfItems, 0),
    pending: requests.filter(r => r.status === 'Pending Submission' || r.status === 'Rejected').reduce((s, r) => s + r.noOfItems, 0),
    submitted: requests.filter(r => r.status === 'Submitted').reduce((s, r) => s + r.noOfItems, 0),
    closed: requests.filter(r => r.status === 'Closed').reduce((s, r) => s + r.noOfItems, 0)
  };
}
