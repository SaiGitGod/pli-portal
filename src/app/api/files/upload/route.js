import { NextResponse } from 'next/server';
import { uploadFile } from '@/lib/fileStorage';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const requestId = formData.get('requestId') || 'unknown';
    const fileType = formData.get('fileType') || 'signed-document';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: 'File is empty' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must not exceed 10 MB' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const folder = 'pli-documents/' + requestId + '/' + fileType;

    try {
      const result = await uploadFile(buffer, file.name, folder);
      return NextResponse.json({ success: true, fileName: result.fileName, fileUrl: result.url });
    } catch (uploadErr) {
      console.error('Upload to blob failed:', uploadErr);
      return NextResponse.json({ error: 'Storage upload failed: ' + uploadErr.message }, { status: 500 });
    }
  } catch (error) {
    console.error('Upload route error:', error);
    return NextResponse.json({ error: 'Server error: ' + error.message }, { status: 500 });
  }
}
