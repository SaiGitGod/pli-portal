import { NextResponse } from 'next/server';
import { getDownloadUrl } from '@/lib/fileStorage';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get('url');

  if (!fileUrl) {
    return NextResponse.json({ error: 'No file URL provided' }, { status: 400 });
  }

  const downloadUrl = getDownloadUrl(fileUrl);
  return NextResponse.redirect(downloadUrl);
}
