import { NextResponse } from 'next/server';
import { pliRequests, users } from '@/data/mockData';
import {
  sendPLICreatedEmail, sendRateEditedEmail,
  sendApprovalEmail, sendRejectionEmail, sendCancellationEmail,
} from '@/lib/email';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tile = searchParams.get('tile') || 'all';
  const requestId = searchParams.get('requestId');
  const vendorCode = searchParams.get('vendorCode');
  const plant = searchParams.get('plant');
  const status = searchParams.get('status');

  let filtered = [...pliRequests];

  if (tile === 'pending') {
    filtered = filtered.filter(r => r.status === 'Pending Submission' || r.status === 'Rejected');
  } else if (tile === 'submitted') {
    filtered = filtered.filter(r => r.status === 'Submitted');
  } else if (tile === 'closed') {
    filtered = filtered.filter(r => r.status === 'Closed');
  }

  if (requestId) filtered = filtered.filter(r => r.id.toLowerCase().includes(requestId.toLowerCase()));
  if (vendorCode) filtered = filtered.filter(r => r.vendorCode.toLowerCase().includes(vendorCode.toLowerCase()));
  if (plant) filtered = filtered.filter(r => r.plant === plant);
  if (status) filtered = filtered.filter(r => r.status === status);

  const allCount = pliRequests.reduce((sum, r) => sum + r.noOfItems, 0);
  const pendingCount = pliRequests.filter(r => r.status === 'Pending Submission' || r.status === 'Rejected').reduce((sum, r) => sum + r.noOfItems, 0);
  const submittedCount = pliRequests.filter(r => r.status === 'Submitted').reduce((sum, r) => sum + r.noOfItems, 0);
  const closedCount = pliRequests.filter(r => r.status === 'Closed').reduce((sum, r) => sum + r.noOfItems, 0);

  return NextResponse.json({
    tiles: { all: allCount, pending: pendingCount, submitted: submittedCount, closed: closedCount },
    requests: filtered,
  });
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { action, requestId, comment, rates } = body;

    const pliRequest = pliRequests.find(r => r.id === requestId);
    if (!pliRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    const vendor = users.find(u => u.vendorCode === pliRequest.vendorCode);
    const buyer = users.find(u => u.role === 'buyer');

    if (action === 'edit' && rates) {
      // Update effective rates
      pliRequest.items.forEach(item => {
        if (rates[item.id] !== undefined) {
          item.effectiveRate = rates[item.id];
        }
      });
      // Send email to vendor and CC buyer
      if (vendor && buyer) {
        await sendRateEditedEmail({
          vendorEmail: vendor.username,
          vendorName: vendor.vendorName,
          buyerEmail: buyer.username,
          buyerName: buyer.name,
          pliName: pliRequest.pliName,
          requestId,
        });
      }
      return NextResponse.json({ success: true, message: 'Rates updated and email sent' });
    }

    if (action === 'Approve') {
      pliRequest.status = 'Closed';
      pliRequest.items.forEach(item => { item.status = 'Closed'; });
      if (vendor) {
        await sendApprovalEmail({
          vendorEmail: vendor.username,
          vendorName: vendor.vendorName,
          pliName: pliRequest.pliName,
          requestId,
          comment,
        });
      }
      return NextResponse.json({ success: true, message: 'Request approved and email sent' });
    }

    if (action === 'Reject') {
      pliRequest.status = 'Rejected';
      pliRequest.items.forEach(item => { item.status = 'Rejected'; });
      if (vendor) {
        await sendRejectionEmail({
          vendorEmail: vendor.username,
          vendorName: vendor.vendorName,
          pliName: pliRequest.pliName,
          requestId,
          comment,
        });
      }
      return NextResponse.json({ success: true, message: 'Request rejected and email sent' });
    }

    if (action === 'Cancel') {
      pliRequest.status = 'Cancelled';
      pliRequest.items.forEach(item => { item.status = 'Cancelled'; });
      if (vendor) {
        await sendCancellationEmail({
          vendorEmail: vendor.username,
          vendorName: vendor.vendorName,
          pliName: pliRequest.pliName,
          requestId,
          comment,
        });
      }
      return NextResponse.json({ success: true, message: 'Request cancelled and email sent' });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  // Handle Excel file upload and PLI creation
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json({ error: 'Only .xlsx and .xls files are allowed' }, { status: 400 });
    }

    // Validate file size
    if (file.size === 0 || file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be greater than 0 KB and not exceed 5 MB' }, { status: 400 });
    }

    // In production: parse with xlsx library
    // const XLSX = require('xlsx');
    // const buffer = await file.arrayBuffer();
    // const workbook = XLSX.read(buffer);
    // const sheet = workbook.Sheets[workbook.SheetNames[0]];
    // const rows = XLSX.utils.sheet_to_json(sheet);
    //
    // Validations:
    // 1. All fields mandatory (Customer, BU, Plant, Component BO Code,
    //    Component Description, Base Unit of Measure, Vendor Code,
    //    Vendor Name, PLI Quarter, Price INR, Purchase Group)
    // 2. Price (INR) must be numeric
    // 3. Purchase Group must exist in system categories
    // 4. Customer, BU, PLI Quarter must be same across all rows
    //
    // Then group by unique Plant + Vendor Code combinations
    // and create separate PLI requests for each combination
    //
    // Auto-generate Request IDs: REQ-YYYY-MM-DD-NNN
    // Auto-generate PLI Name: Customer_Quarter_BU_XX_NN
    //
    // Send email to each vendor with CC to buyer

    // Demo response
    const createdRequests = [
      { requestId: 'REQ-2026-06-05-001', plant: '1900', vendorCode: 'CCJ0040', items: 4 },
      { requestId: 'REQ-2026-06-05-002', plant: '5100', vendorCode: 'CCJ0040', items: 3 },
    ];

    return NextResponse.json({
      success: true,
      message: `${createdRequests.length} PLI requests created from Excel upload`,
      requests: createdRequests,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process Excel file' }, { status: 500 });
  }
}
