import { useState } from "react";

const initialFilters = {
  name: "",
};

export function useServicesFilters() {
  const [filters, setFilters] = useState(initialFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  const updateFilter = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };

  const applyFilters = (overrides = {}) => {
    const nextFilters = { ...filters, ...overrides };
    setFilters(nextFilters);
    setAppliedFilters(nextFilters);
    setFilterOpen(false);
  };

  return {
    filters: appliedFilters,
    filterOpen,
    setFilterOpen,
    updateFilter,
    clearFilters,
    applyFilters,
  };
}

