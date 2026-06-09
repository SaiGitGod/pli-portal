import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export const runtime = 'nodejs';
export const maxDuration = 30;
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const requestId = formData.get('requestId');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Read file into a buffer first — passing the raw File object to put()
    // can hang on Vercel's runtime. A buffer has a known size and uploads cleanly.
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const blob = await put(
      'vendor-docs/' + (requestId || 'misc') + '/' + file.name,
      buffer,
      {
        access: 'public',
        addRandomSuffix: true,
        contentType: file.type || 'application/pdf'
      }
    );

    return NextResponse.json({ success: true, url: blob.url, fileName: file.name });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed: ' + (error?.message || String(error)) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Upload route is working', hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN });
}
