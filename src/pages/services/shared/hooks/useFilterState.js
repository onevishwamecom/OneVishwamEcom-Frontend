import { useState, useCallback } from 'react';

/**
 * Universal hook for managing filter selections and collapsible sidebar section state.
 */
export function useFilterState(initialFilters = {}, initialSections = {}) {
  const [filters, setFilters] = useState(() => ({ ...initialFilters }));
  const [openSections, setOpenSections] = useState(() => ({ ...initialSections }));

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleSection = useCallback((sectionId) => {
    setOpenSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ ...initialFilters });
  }, [initialFilters]);

  return {
    filters,
    setFilters,
    openSections,
    setOpenSections,
    updateFilter,
    toggleSection,
    resetFilters,
  };
}

export default useFilterState;
