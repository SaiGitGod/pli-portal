import { NextResponse } from 'next/server';
import { handleUpload } from '@vercel/blob/client';

export async function GET() {
  return NextResponse.json({ status: 'Upload API is working. Use POST to upload files.' });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: ['application/pdf'],
          maximumSizeInBytes: 10 * 1024 * 1024
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log('Upload completed:', blob.url);
      }
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
