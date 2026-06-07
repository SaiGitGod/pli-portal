import { NextResponse } from 'next/server';
import { getRequestsByVendor, updateRequestStatus } from '@/lib/database';
import { sendVendorSubmissionEmail } from '@/lib/email';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const vendorCode = searchParams.get('vendorCode');
  if (!vendorCode) return NextResponse.json({ requests: [] });
  const requests = await getRequestsByVendor(vendorCode);
  return NextResponse.json({ requests });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { requestId, comment, fileName, fileUrl } = body;
    const req = await updateRequestStatus(requestId, 'Submitted', {
      submittedFileName: fileName || 'Signed Document.pdf',
      submittedDate: new Date().toISOString().split('T')[0],
      vendorComment: comment,
      submittedFileUrl: fileUrl || ''
    });
    if (req) {
      await sendVendorSubmissionEmail({
        buyerEmail: 'saikrishna.k333@gmail.com',
        buyerName: 'Buyer',
        vendorName: req.vendorName,
        pliName: req.pliName,
        requestId
      });
    }
    return NextResponse.json({ success: true, message: 'Submitted and email sent' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
