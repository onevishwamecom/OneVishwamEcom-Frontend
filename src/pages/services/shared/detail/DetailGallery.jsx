import React, { useState } from 'react';

const FALLBACK_IMG = 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="none"><rect width="400" height="300" fill="#f3f4f6"/><path fill="#9ca3af" d="M160 130h80v-10l-40-40-40 40v10zm-20 50h120v-60l-40-40-80 80v20z"/></svg>`
);

/**
 * Universal Detail Page Photo Gallery
 * Displays the active 4:3 main image with smooth transitions and thumbnail selector strip.
 */
export default function DetailGallery({
  images = [],
  title = '',
  aspectRatio = 'aspect-[4/3]',
  onImageClick,
  className = '',
  activeThumbnailBorder = 'border-brand-blue',
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const imageList = Array.isArray(images) && images.length > 0
    ? images
    : typeof images === 'string' && images
      ? [images]
      : [];

  const currentImage = imageList[currentIndex] || imageList[0] || FALLBACK_IMG;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main Image */}
      <div
        className={`${aspectRatio} overflow-hidden rounded-2xl bg-gray-100 shadow-sm relative group ${
          onImageClick ? 'cursor-pointer' : ''
        }`}
        onClick={() => onImageClick && onImageClick(currentIndex)}
      >
        <img
          src={currentImage}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        {onImageClick && imageList.length > 0 && (
          <div className="absolute bottom-3 right-3 rounded-lg bg-black/60 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-white flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
            <i className="fa-solid fa-expand text-[10px]" />
            <span>{currentIndex + 1} / {imageList.length}</span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {imageList.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imageList.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                idx === currentIndex
                  ? activeThumbnailBorder
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`${title} view ${idx + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
