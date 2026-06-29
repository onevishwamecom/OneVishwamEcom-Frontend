export async function uploadResumeToCloudinary(file) {
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary credentials are not configured.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  
  // Important: For PDF/Word docs, we must use resource_type: 'raw' or 'auto'. 
  // 'auto' tries to guess, but explicitly setting 'auto' is usually safest for mixed uploads.
  formData.append('resource_type', 'auto');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `Upload failed with status ${response.status}`
    );
  }

  const data = await response.json();
  if (!data.secure_url) {
    throw new Error('Cloudinary did not return a secure URL.');
  }

  return { success: true, url: data.secure_url };
}
