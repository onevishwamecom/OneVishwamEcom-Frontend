import React, { useRef, useState, useCallback } from 'react';

/**
 * DualRangeSlider
 * ─────────────────
 * Controlled multi-thumb range slider primitive.
 * Preserves thumb identity (value[0] = MIN, value[1] = MAX).
 * Prevents crossover via minStepsBetweenThumbs and pointer capture.
 */
export function DualRangeSlider({
  value = [0, 10000000],
  onValueChange,
  min = 0,
  max = 10000000,
  step = 100000,
  minStepsBetweenThumbs = 1,
  disabled = false,
  className = '',
}) {
  const minVal = Math.max(min, Math.min(value[0] ?? min, max));
  const maxVal = Math.max(minVal, Math.min(value[1] ?? max, max));
  const minDistance = Math.max(step, step * minStepsBetweenThumbs);

  const trackRef = useRef(null);
  const activeThumbRef = useRef(null); // 'min' | 'max' | null
  const [focusedThumb, setFocusedThumb] = useState(null); // 'min' | 'max' | null

  const span = Math.max(step, max - min);
  const leftPct = Math.max(0, Math.min(100, ((minVal - min) / span) * 100));
  const rightPct = Math.max(0, Math.min(100, ((max - maxVal) / span) * 100));

  const getValueFromPointer = useCallback((clientX) => {
    if (!trackRef.current) return min;
    const rect = trackRef.current.getBoundingClientRect();
    if (rect.width <= 0) return min;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawVal = min + ratio * (max - min);
    const steppedVal = Math.round((rawVal - min) / step) * step + min;
    return Math.max(min, Math.min(steppedVal, max));
  }, [min, max, step]);

  const handlePointerDown = (thumb, e) => {
    if (disabled) return;
    e.stopPropagation();
    activeThumbRef.current = thumb;
    setFocusedThumb(thumb);

    if (e.target && e.target.setPointerCapture) {
      try { e.target.setPointerCapture(e.pointerId); } catch (_) {}
    }
  };

  const handlePointerMove = (e) => {
    if (disabled || !activeThumbRef.current) return;
    const newPosVal = getValueFromPointer(e.clientX);

    if (activeThumbRef.current === 'min') {
      const safeMin = Math.min(newPosVal, maxVal - minDistance);
      const clampedMin = Math.max(min, safeMin);
      if (clampedMin !== minVal && onValueChange) {
        onValueChange([clampedMin, maxVal]);
      }
    } else if (activeThumbRef.current === 'max') {
      const safeMax = Math.max(newPosVal, minVal + minDistance);
      const clampedMax = Math.min(max, safeMax);
      if (clampedMax !== maxVal && onValueChange) {
        onValueChange([minVal, clampedMax]);
      }
    }
  };

  const handlePointerUp = (e) => {
    if (activeThumbRef.current) {
      if (e.target && e.target.releasePointerCapture) {
        try { e.target.releasePointerCapture(e.pointerId); } catch (_) {}
      }
      activeThumbRef.current = null;
    }
  };

  const handleTrackPointerDown = (e) => {
    if (disabled || activeThumbRef.current) return;
    const clickVal = getValueFromPointer(e.clientX);
    const distToMin = Math.abs(clickVal - minVal);
    const distToMax = Math.abs(clickVal - maxVal);

    if (distToMin <= distToMax) {
      const safeMin = Math.min(clickVal, maxVal - minDistance);
      const clampedMin = Math.max(min, safeMin);
      activeThumbRef.current = 'min';
      setFocusedThumb('min');
      if (onValueChange) onValueChange([clampedMin, maxVal]);
    } else {
      const safeMax = Math.max(clickVal, minVal + minDistance);
      const clampedMax = Math.min(max, safeMax);
      activeThumbRef.current = 'max';
      setFocusedThumb('max');
      if (onValueChange) onValueChange([minVal, clampedMax]);
    }
  };

  const handleKeyDown = (thumb, e) => {
    if (disabled) return;
    let delta = 0;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = -step;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = step;
    if (e.key === 'PageDown') delta = -step * 5;
    if (e.key === 'PageUp') delta = step * 5;
    if (e.key === 'Home') delta = thumb === 'min' ? min - minVal : minVal - maxVal;
    if (e.key === 'End') delta = thumb === 'min' ? maxVal - minDistance - minVal : max - maxVal;

    if (delta !== 0) {
      e.preventDefault();
      if (thumb === 'min') {
        const nextMin = Math.max(min, Math.min(minVal + delta, maxVal - minDistance));
        if (onValueChange) onValueChange([nextMin, maxVal]);
      } else {
        const nextMax = Math.min(max, Math.max(maxVal + delta, minVal + minDistance));
        if (onValueChange) onValueChange([minVal, nextMax]);
      }
    }
  };

  return (
    <div className={`relative w-full select-none py-2 ${className}`}>
      <div
        ref={trackRef}
        onPointerDown={handleTrackPointerDown}
        aria-hidden="true"
        className="relative h-2 w-full rounded-full bg-gray-200 cursor-pointer touch-none"
      >
        {/* Active Range Fill */}
        <div
          className="absolute h-full rounded-full bg-brand-blue"
          style={{ left: `${leftPct}%`, right: `${rightPct}%` }}
        />

        {/* Min Thumb */}
        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuemin={min}
          aria-valuemax={maxVal - minDistance}
          aria-valuenow={minVal}
          aria-label="Minimum price handle"
          onPointerDown={(e) => handlePointerDown('min', e)}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={(e) => handleKeyDown('min', e)}
          style={{ left: `${leftPct}%` }}
          className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 rounded-full border-2 border-brand-blue bg-white shadow-md transition-shadow hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-1 cursor-grab active:cursor-grabbing ${
            focusedThumb === 'min' ? 'z-30 ring-2 ring-brand-blue' : 'z-20'
          }`}
        />

        {/* Max Thumb */}
        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuemin={minVal + minDistance}
          aria-valuemax={max}
          aria-valuenow={maxVal}
          aria-label="Maximum price handle"
          onPointerDown={(e) => handlePointerDown('max', e)}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={(e) => handleKeyDown('max', e)}
          style={{ left: `${100 - rightPct}%` }}
          className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 rounded-full border-2 border-brand-blue bg-white shadow-md transition-shadow hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-1 cursor-grab active:cursor-grabbing ${
            focusedThumb === 'max' ? 'z-30 ring-2 ring-brand-blue' : 'z-20'
          }`}
        />
      </div>
    </div>
  );
}

export default DualRangeSlider;
