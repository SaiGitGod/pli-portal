import { NextResponse } from 'next/server';
import { uploadFile } from '@/lib/fileStorage';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const requestId = formData.get('requestId');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadFile(buffer, file.name, 'vendor-docs/' + requestId);

    return NextResponse.json({ success: true, url: result.url, fileName: result.fileName });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
