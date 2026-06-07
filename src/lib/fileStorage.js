import { put, del, list } from '@vercel/blob';

export async function uploadFile(fileBuffer, fileName, folder) {
  try {
    const path = folder + '/' + Date.now() + '_' + fileName;
    const blob = await put(path, fileBuffer, { access: 'public', addRandomSuffix: false });
    return { url: blob.url, fileName: fileName, storagePath: path };
  } catch (err) {
    console.error('File upload error:', err);
    throw new Error('File upload failed: ' + err.message);
  }
}

export async function deleteFile(fileUrl) {
  try {
    await del(fileUrl);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function listFiles(folder) {
  try {
    const result = await list({ prefix: folder });
    return result.blobs.map(b => ({ url: b.url, fileName: b.pathname.split('/').pop(), size: b.size, uploadedAt: b.uploadedAt }));
  } catch (err) {
    return [];
  }
}

export function getDownloadUrl(fileUrl) {
  return fileUrl;
}
