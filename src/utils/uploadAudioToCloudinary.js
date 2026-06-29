// ──────────────────────────────────────────────
// Cloudinary unsigned upload for audio files.
// Requires VITE_CLOUDINARY_CLOUD_NAME and
// VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.
// ──────────────────────────────────────────────

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

/**
 * Uploads an audio Blob to Cloudinary and returns a public URL.
 *
 * @param {Blob} audioBlob - The recorded audio blob to upload.
 * @returns {Promise<{ success: true, url: string }>}
 * @throws {Error} If the upload fails or credentials are missing.
 */
export async function uploadAudioToCloudinary(audioBlob) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      'Cloudinary credentials are not configured. ' +
      'Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.'
    );
  }

  const formData = new FormData();
  formData.append('file', audioBlob, 'voice_message.webm');
  formData.append('upload_preset', UPLOAD_PRESET);
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
      errorData?.error?.message || `Cloudinary upload failed with status ${response.status}`
    );
  }

  const data = await response.json();

  if (!data.secure_url) {
    throw new Error('Cloudinary did not return a secure URL.');
  }

  return { success: true, url: data.secure_url };
}
