import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const requestId = formData.get('requestId');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const blob = await put('vendor-docs/' + requestId + '/' + Date.now() + '_' + file.name, file, {
      access: 'public',
    });

    return NextResponse.json({ success: true, url: blob.url, fileName: file.name });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Upload route is working', hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN });
}

export const dynamic = 'force-dynamic';
