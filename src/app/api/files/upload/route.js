import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'Upload API is working. Use POST to upload files.' });
}

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

    let fileUrl = '';
    let uploadMethod = 'database-only';

    try {
      const { put } = await import('@vercel/blob');
      const path = 'pli-documents/' + requestId + '/' + Date.now() + '_' + file.name;
      const blob = await put(path, file, { access: 'public' });
      fileUrl = blob.url;
      uploadMethod = 'blob';
    } catch (blobError) {
      console.error('Blob failed:', blobError.message);
      fileUrl = 'pending-storage://' + requestId + '/' + file.name;
      uploadMethod = 'reference-only';
    }

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileUrl: fileUrl,
      fileSize: file.size,
      uploadMethod: uploadMethod
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
  }
}
