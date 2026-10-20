import api from './api';

/**
 * Upload a File/Blob straight to Cloudinary using a signature from our backend.
 * @param {File|Blob} file
 * @param {string} folder e.g. "ds_portfolio/collections/weddings", "ds_portfolio/categories/weddings", "services"
 * @returns {Promise<{url: string, publicId: string, resourceType: string}>}
 */
export async function uploadToCloudinary(file, folder = 'ds_portfolio') {
  if (!file) {
    throw new Error('Please select a file to upload');
  }

  const { data } = await api.get('/api/v1/upload/signature', { params: { folder } });
  const { timestamp, signature, apiKey, cloudName, folder: signedFolder } = data?.data || {};

  if (!signature || !apiKey || !cloudName || !timestamp) {
    throw new Error('Failed to retrieve upload signature from server');
  }

  const form = new FormData();
  form.append('file', file);
  form.append('api_key', apiKey);
  form.append('timestamp', timestamp);
  form.append('signature', signature);
  form.append('folder', signedFolder);

  // Use plain fetch, NOT the axios `api` instance: that instance sends cookies
  // (withCredentials), which Cloudinary rejects with a CORS error.
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: 'POST',
    body: form,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error?.message || 'Upload to Cloudinary failed');
  }

  return {
    url: json.secure_url,
    publicId: json.public_id,
    resourceType: json.resource_type,
  };
}

export default uploadToCloudinary;
