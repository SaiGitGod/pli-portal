// ============================================================
// FILE STORAGE ABSTRACTION LAYER
// ============================================================
// Currently: Vercel Blob (free cloud storage)
//
// TO REPLACE WITH INTERNAL STORAGE:
// Your IT team replaces this single file.
// Keep the same function names and return formats.
//
// Example AWS S3 replacement:
//   import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
//   const s3 = new S3Client({ region: process.env.AWS_REGION });
//   export async function uploadFile(file, fileName, folder) {
//     await s3.send(new PutObjectCommand({ Bucket: process.env.S3_BUCKET, Key: `${folder}/${fileName}`, Body: file }));
//     return { url: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${folder}/${fileName}`, fileName };
//   }
//
// Example internal server replacement:
//   Save to a shared network drive or internal file server
//   export async function uploadFile(file, fileName, folder) {
//     const path = `/shared/pli-documents/${folder}/${fileName}`;
//     fs.writeFileSync(path, file);
//     return { url: path, fileName };
//   }
// ============================================================

import { put, del, list } from '@vercel/blob';

// Upload a file and return its URL
export async function uploadFile(fileBuffer, fileName, folder) {
  const path = `${folder}/${Date.now()}_${fileName}`;
  const blob = await put(path, fileBuffer, { access: 'public' });
  return { url: blob.url, fileName: fileName, storagePath: path };
}

// Delete a file by URL
export async function deleteFile(fileUrl) {
  try {
    await del(fileUrl);
    return { success: true };
  } catch (err) {
    console.error('Delete file error:', err);
    return { success: false, error: err.message };
  }
}

// List files in a folder
export async function listFiles(folder) {
  try {
    const { blobs } = await list({ prefix: folder });
    return blobs.map(b => ({ url: b.url, fileName: b.pathname.split('/').pop(), size: b.size, uploadedAt: b.uploadedAt }));
  } catch (err) {
    return [];
  }
}

// Get a download URL (for Vercel Blob, the URL is already public)
export function getDownloadUrl(fileUrl) {
  return fileUrl;
}
