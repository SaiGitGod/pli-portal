import { NextResponse } from 'next/server';
import { getAllRequests, getRequestsByStatus, updateRequestStatus, updateRequestItems, addRequests, getTileCounts, getVendor, getBuyer } from '@/lib/database';
import { sendApprovalEmail, sendRejectionEmail, sendCancellationEmail } from '@/lib/email';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tile = searchParams.get('tile') || 'all';
  const tiles = await getTileCounts();
  let requests;
  if (tile === 'pending') requests = await getRequestsByStatus('pending');
  else if (tile === 'submitted') requests = await getRequestsByStatus('submitted');
  else if (tile === 'closed') requests = await getRequestsByStatus('closed');
  else requests = await getAllRequests();
  return NextResponse.json({ tiles, requests });
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { action, requestId, comment, rates } = body;
    if (action === 'edit' && rates) {
      const updated = await updateRequestItems(requestId, rates);
      return NextResponse.json({ success: true, message: 'Rates updated' });
    }
    if (action === 'Approve') {
      const req = await updateRequestStatus(requestId, 'Closed', {});
      if (req) {
        const vendor = await getVendor(req.vendorCode);
        const buyer = await getBuyer(req.category);
        if (vendor) await sendApprovalEmail({ vendorEmail: vendor.email, vendorName: vendor.vendorName, ccEmail: buyer.buyerEmail, pliName: req.pliName, requestId, comment });
      }
      return NextResponse.json({ success: true, message: 'Approved and email sent' });
    }
    if (action === 'Reject') {
      const req = await updateRequestStatus(requestId, 'Rejected', { rejectedBy: 'Buyer', rejectionComment: comment, rejectionDate: new Date().toISOString() });
      if (req) {
        const vendor = await getVendor(req.vendorCode);
        const buyer = await getBuyer(req.category);
        if (vendor) await sendRejectionEmail({ vendorEmail: vendor.email, vendorName: vendor.vendorName, ccEmail: buyer.buyerEmail, pliName: req.pliName, requestId, comment });
      }
      return NextResponse.json({ success: true, message: 'Rejected and email sent' });
    }
    if (action === 'Cancel') {
      const req = await updateRequestStatus(requestId, 'Cancelled', {});
      if (req) {
        const vendor = await getVendor(req.vendorCode);
        const buyer = await getBuyer(req.category);
        if (vendor) await sendCancellationEmail({ vendorEmail: vendor.email, vendorName: vendor.vendorName, ccEmail: buyer.buyerEmail, pliName: req.pliName, requestId, comment });
      }
      return NextResponse.json({ success: true, message: 'Cancelled and email sent' });
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { requests: newRequests } = body;
    if (newRequests && newRequests.length > 0) {
      await addRequests(newRequests);
      return NextResponse.json({ success: true, message: `${newRequests.length} requests added` });
    }
    return NextResponse.json({ error: 'No requests provided' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
