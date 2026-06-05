import { NextResponse } from 'next/server';
import { pliRequests, users } from '@/data/mockData';
import { sendVendorSubmissionEmail } from '@/lib/email';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const vendorCode = searchParams.get('vendorCode');
  const plant = searchParams.get('plant');
  const pliName = searchParams.get('pliName');
  const status = searchParams.get('status');
  const requestId = searchParams.get('requestId');

  let filtered = [...pliRequests];

  if (vendorCode) filtered = filtered.filter(r => r.vendorCode === vendorCode);
  if (plant) filtered = filtered.filter(r => r.plant === plant);
  if (pliName) filtered = filtered.filter(r => r.pliName.toLowerCase().includes(pliName.toLowerCase()));
  if (status) filtered = filtered.filter(r => r.status === status);
  if (requestId) filtered = filtered.filter(r => r.id === requestId);

  return NextResponse.json({ requests: filtered });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { requestId, comment, fileName } = body;

    const pliRequest = pliRequests.find(r => r.id === requestId);
    if (!pliRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Update status to Submitted
    pliRequest.status = 'Submitted';
    pliRequest.items.forEach(item => { item.status = 'Submitted'; });

    // Send email to buyer
    const buyer = users.find(u => u.role === 'buyer');
    if (buyer) {
      await sendVendorSubmissionEmail({
        buyerEmail: buyer.username,
        buyerName: buyer.name,
        vendorName: pliRequest.vendorName,
        pliName: pliRequest.pliName,
        requestId,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Document submitted successfully. Email sent to buyer.',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
