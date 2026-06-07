import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const requestId = formData.get('requestId') || 'unknown';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: 'File is empty' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File exceeds 10 MB' }, { status: 400 });
    }

    const fileName = file.name;
    const path = 'pli-documents/' + requestId + '/' + Date.now() + '_' + fileName;

    const blob = await put(path, file, {
      access: 'public'
    });

    return NextResponse.json({
      success: true,
      fileName: fileName,
      fileUrl: blob.url
    });
  } catch (error) {
    console.error('Upload error details:', error);
    return NextResponse.json({
      error: 'Upload failed',
      details: error.message || 'Unknown error'
    }, { status: 500 });
  }
}
