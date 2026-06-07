import { NextResponse } from 'next/server';
import { getVendorByCode, getBuyerByPurchaseGroup } from '@/data/vendorDatabase';
import { sendPLICreatedEmail, sendApprovalEmail, sendRejectionEmail, sendCancellationEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, requests: pliRequests, vendorCode, purchaseGroup, pliName, requestId, comment, buyerName, itemCount } = body;

    if (action === 'pli-created' && pliRequests) {
      const results = [];
      for (const req of pliRequests) {
        const vendor = getVendorByCode(req.vendorCode);
        const buyer = getBuyerByPurchaseGroup(req.category);
        if (vendor) {
          const result = await sendPLICreatedEmail({
            vendorEmail: vendor.email,
            vendorName: vendor.vendorName,
            ccEmail: buyer.buyerEmail,
            ccName: buyer.buyerName,
            pliName: req.pliName,
            requestId: req.id,
            itemCount: req.noOfItems,
            buyerName: buyerName || 'Buyer'
          });
          results.push({ requestId: req.id, vendorCode: req.vendorCode, ...result });
        } else {
          results.push({ requestId: req.id, vendorCode: req.vendorCode, success: false, error: `Vendor ${req.vendorCode} not found in database` });
        }
      }
      return NextResponse.json({ success: true, results });
    }

    if (action === 'approve' || action === 'reject' || action === 'cancel') {
      const vendor = getVendorByCode(vendorCode);
      const buyer = getBuyerByPurchaseGroup(purchaseGroup);
      if (!vendor) {
        return NextResponse.json({ success: false, error: `Vendor ${vendorCode} not found` }, { status: 404 });
      }
      let result;
      if (action === 'approve') {
        result = await sendApprovalEmail({ vendorEmail: vendor.email, vendorName: vendor.vendorName, ccEmail: buyer.buyerEmail, pliName, requestId, comment });
      } else if (action === 'reject') {
        result = await sendRejectionEmail({ vendorEmail: vendor.email, vendorName: vendor.vendorName, ccEmail: buyer.buyerEmail, pliName, requestId, comment });
      } else {
        result = await sendCancellationEmail({ vendorEmail: vendor.email, vendorName: vendor.vendorName, ccEmail: buyer.buyerEmail, pliName, requestId, comment });
      }
      return NextResponse.json({ success: true, ...result });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Send email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
