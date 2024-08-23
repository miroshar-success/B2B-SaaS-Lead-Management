// src/components/FilterSidebar.tsx
import React, { useState, useEffect } from "react";
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";
import SearchOption from "./SearchOption";

interface FilterConfig {
  key: string;
  label: string;
  customOptions?: string[];
}

interface FilterSidebarProps {
  showFilter: boolean;
  url: string;
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
  filters: {
    [key: string]: {
      exclude: string | null;
      include: string | null;
      isKnown: boolean;
      isNotKnown: boolean;
    };
  };
  handleFilterChange: (
    key: string,
    type: string,
    value: string | boolean | null
  ) => void;
  filterConfigs: FilterConfig[];
  clearFilters: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  clearFilters,
  handleFilterChange,
  filters,
  url,
  filterConfigs,
}) => {
  const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>({});

  // Initialize collapsed state
  useEffect(() => {
    const initialCollapsedState = filterConfigs.reduce(
      (acc, filter) => ({ ...acc, [filter.key]: true }),
      {}
    );
    setCollapsed(initialCollapsedState);
  }, []);

  // Toggle collapse state
  const toggleCollapse = (key: string) => {
    setCollapsed((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };
  // Render filter options
  const renderFilterOptions = (filterConfig: FilterConfig) => {
    const filterKey = filterConfig.key;
    return (
      <div
        className={`mb-4 ${
          (!collapsed[filterKey] || filters[filterKey + ".value"]) &&
          "border-2 border-primary rounded-md p-2"
        }`}
        key={filterKey}
      >
        <h3
          className="text-sm font-semibold mb-2 cursor-pointer whitespace-nowrap flex items-center justify-between"
          onClick={() => toggleCollapse(filterKey)}
        >
          {filterConfig.label}
          {collapsed[filterKey] ? <GoTriangleDown /> : <GoTriangleUp />}
        </h3>
        {!collapsed[filterKey] && (
          <>
            <label className="flex items-center">
              <input
                type="radio"
                name={`${filterKey}-condition`}
                value="isAnyOf"
                checked={
                  !filters[filterKey + ".value"]?.isKnown &&
                  !filters[filterKey + ".value"]?.isNotKnown
                }
                onChange={() => {
                  handleFilterChange(filterKey + ".value", "isKnown", false);
                  handleFilterChange(filterKey + ".value", "isNotKnown", false);
                }}
              />
              <span className="ml-2">Is any of</span>
            </label>
            {!filters[filterKey + ".value"]?.isKnown &&
              !filters[filterKey + ".value"]?.isNotKnown && (
                <>
                  <SearchOption
                    filterKey={filterKey}
                    handleFilterChange={handleFilterChange}
                    url={url}
                    selectedOptions={
                      filters[filterKey + ".value"]?.include?.split(",") || []
                    }
                    customOptions={filterConfig.customOptions}
                  />
                  <SearchOption
                    filterKey={filterKey}
                    handleFilterChange={handleFilterChange}
                    url={url}
                    selectedOptions={
                      filters[filterKey + ".value"]?.exclude?.split(",") || []
                    }
                    exclude
                    customOptions={filterConfig.customOptions}
                  />
                </>
              )}
            <label className="flex items-center mt-1">
              <input
                type="radio"
                name={`${filterKey}-condition`}
                value="isNotAnyOf"
                checked={filters[filterKey + ".value"]?.isKnown}
                onChange={() => {
                  console.log("hello");
                  handleFilterChange(filterKey + ".value", "isKnown", true);
                  handleFilterChange(filterKey + ".value", "isNotKnown", false);
                }}
              />
              <span className="ml-2">Is Known</span>
            </label>
            <label className="flex items-center mt-1">
              <input
                type="radio"
                name={`${filterKey}-condition`}
                value="isNotAnyOf"
                checked={filters[filterKey + ".value"]?.isNotKnown}
                onChange={() => {
                  handleFilterChange(filterKey + ".value", "isNotKnown", true);
                  handleFilterChange(filterKey + ".value", "isKnown", false);
                }}
              />
              <span className="ml-2">Is Not Known</span>
            </label>
          </>
        )}
      </div>
    );
  };

  return (
    <div
      className={`relative h-full overflow-y-auto bg-white rounded-md z-10 transition-all transform 
      `}
    >
      <div className="m-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Filters</h2>
          <button
            onClick={clearFilters}
            className="border p-1 rounded text-sm bg-gray-200 hover:bg-gray-300"
          >
            Clear Filters
          </button>
        </div>
        {filterConfigs.map((filterConfig) => renderFilterOptions(filterConfig))}
      </div>
    </div>
  );
};

export default FilterSidebar;
