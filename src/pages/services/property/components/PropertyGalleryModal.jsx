import React, { useEffect } from 'react';

/**
 * Fullscreen Photo Gallery Lightbox Modal
 */
export default function PropertyGalleryModal({ images = [], index = 0, onClose, onPrev, onNext, resolveImage }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  if (!images || images.length === 0) return null;

  const currentSrc = resolveImage ? resolveImage(images[index]) : images[index];

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={onClose}>
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10"
      >
        <i className="fa-solid fa-xmark text-xl" />
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10"
      >
        <i className="fa-solid fa-chevron-left text-xl" />
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10"
      >
        <i className="fa-solid fa-chevron-right text-xl" />
      </button>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium z-10">
        {index + 1} / {images.length}
      </div>
      <img
        src={currentSrc}
        alt=""
        className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
