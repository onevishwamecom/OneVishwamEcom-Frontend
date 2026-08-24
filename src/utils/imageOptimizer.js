/**
 * Cloudinary image URL optimizer.
 *
 * Appends transformation params to Cloudinary URLs for:
 * - width: matches the rendered card size (not full-size originals)
 * - quality: auto (best compression without visible loss)
 * - format: auto (WebP/AVIF when browser supports it)
 *
 * Non-Cloudinary URLs are returned unchanged.
 */

/**
 * Optimize a Cloudinary image URL for a given render width.
 * @param {string} url - Original image URL
 * @param {number} width - Target render width in pixels
 * @returns {string} Optimized URL with transformations
 */
export function optimizeImage(url, width = 400) {
  if (!url || typeof url !== 'string') return url;

  // Only transform Cloudinary URLs
  if (!url.includes('res.cloudinary.com')) return url;

  // Already has transformations? Insert before the upload path
  const uploadMarker = '/upload/';
  const idx = url.indexOf(uploadMarker);
  if (idx === -1) return url;

  const before = url.substring(0, idx + uploadMarker.length);
  const after = url.substring(idx + uploadMarker.length);

  // Don't double-apply if already has transformations
  if (after.startsWith('w_') || after.startsWith('f_') || after.startsWith('q_')) {
    return url;
  }

  return `${before}w_${width},q_auto,f_auto/${after}`;
}

/**
 * Get optimized image URL for a property card (4:3 aspect, ~400px wide).
 */
export function cardImage(url) {
  return optimizeImage(url, 400);
}

/**
 * Get optimized image URL for a hero background (wide, ~1200px).
 */
export function heroImage(url) {
  return optimizeImage(url, 1200);
}

/**
 * Get the first image from a listing's images array, or a fallback.
 * @param {object} item - Listing object with images array or image field
 * @returns {string} Image URL (optimized for card)
 */
export function getCoverImage(item) {
  const images = Array.isArray(item?.images) ? item.images : [];
  const cover = images.find((src) => src && !src.startsWith('data:')) || images[0] || item?.image || '';
  return cardImage(cover);
}

export default { optimizeImage, cardImage, heroImage, getCoverImage };