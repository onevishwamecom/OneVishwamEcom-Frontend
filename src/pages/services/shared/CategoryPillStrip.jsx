/**
 * CategoryPillStrip — Backward-compatible wrapper around SectorTabs.
 * ────────────────────────────────────────────────────────────────────
 * Accepts the same props as before (types, selected, stats, onSelect,
 * renderBadge, className) and maps them to SectorTabs' canonical API.
 *
 * New code should use <SectorTabs> directly.
 */
import React from 'react';
import { SectorTabs } from '../../../components/ui/SectorTabs';

export default function CategoryPillStrip({
  types = [],
  selected,
  stats,
  onSelect,
  renderBadge,
  className = 'mt-5',
}) {
  return (
    <SectorTabs
      tabs={types}
      activeTab={selected}
      onTabChange={onSelect}
      stats={stats}
      renderBadge={renderBadge}
      className={className}
    />
  );
}
