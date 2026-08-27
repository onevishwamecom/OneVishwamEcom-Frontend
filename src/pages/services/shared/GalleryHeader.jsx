/**
 * GalleryHeader — Backward-compatible re-export of SectorPageHeader.
 * ──────────────────────────────────────────────────────────────────
 * New code should import SectorPageHeader directly.
 * `backUrl` and `backLabel` props are intentionally ignored —
 * back navigation is handled by the main navbar.
 */
export { SectorPageHeader as GalleryHeader, SectorPageHeader } from '../../../components/ui/SectorPageHeader';
export { SectorPageHeader as default } from '../../../components/ui/SectorPageHeader';
