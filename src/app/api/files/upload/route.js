import { NextResponse } from 'next/server';
import { uploadFile } from '@/lib/fileStorage';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const requestId = formData.get('requestId');
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
    const folder = `pli-documents/${requestId}/${fileType}`;
    const result = await uploadFile(buffer, file.name, folder);

    return NextResponse.json({
      success: true,
      fileName: result.fileName,
      fileUrl: result.url,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
