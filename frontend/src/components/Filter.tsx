// src/components/FilterSidebar.tsx
import React, { useState, useEffect, useCallback } from "react";
import { CiSearch } from "react-icons/ci";
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";
import { FaTimes } from "react-icons/fa";
import { axiosInstance } from "../context/Auth";

interface FilterOption {
  key: string;
  label: string;
}

interface FilterConfig {
  key: string;
  label: string;
}

interface FilterSidebarProps {
  showFilter: boolean;
  url: string;
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
  filters: { [key: string]: string | null };
  handleFilterChange: (key: string, value: string | null) => void;
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
  const [options, setOptions] = useState<{ [key: string]: FilterOption[] }>({});
  const [searchValue, setSearchValue] = useState<{ [key: string]: string }>({});
  const [limit] = useState(10); // Default limit

  // Initialize collapsed state
  useEffect(() => {
    const initialCollapsedState = filterConfigs.reduce(
      (acc, filter) => ({ ...acc, [filter.key]: true }),
      {}
    );
    setCollapsed(initialCollapsedState);
  }, []);

  // Use useCallback to memoize the handleSearch function
  const handleSearch = useCallback(
    async (filterKey: string, search: string) => {
      if (!search) {
        // Clear options if search is empty
        setOptions((prevOptions) => ({
          ...prevOptions,
          [filterKey]: [],
        }));
        return;
      }

      try {
        const response = await axiosInstance.get(`/${url}/search`, {
          params: {
            field: filterKey,
            value: search,
            limit,
          },
        });
        const results = response.data.map((item: any) => ({
          key: item._id,
          label: item[filterKey]?.value || "",
        }));
        setOptions((prevOptions) => ({
          ...prevOptions,
          [filterKey]: results,
        }));
      } catch (error) {
        console.error("Error searching leads:", error);
      }
    },
    [limit]
  );

  // Trigger search on input change with a delay to minimize API calls
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    Object.keys(searchValue).forEach((key) => {
      const search = searchValue[key];
      if (search) {
        const timer = setTimeout(() => {
          handleSearch(key, search);
        }, 300); // 300ms delay
        timers.push(timer);
      }
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [searchValue, handleSearch]);

  // Toggle collapse state
  const toggleCollapse = (key: string) => {
    setCollapsed((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
    // Clear options when toggling collapse
    setOptions((prevOptions) => ({
      ...prevOptions,
      [key]: [],
    }));
  };

  // Remove selected filter
  const removeFilter = (key: string) => {
    handleFilterChange(key, null);
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
          <div className="relative">
            <div className="border rounded-md flex items-center p-1">
              <input
                className="w-full focus:outline-none"
                value={searchValue[filterKey] || ""}
                onChange={(e) =>
                  setSearchValue((prev) => ({
                    ...prev,
                    [filterKey]: e.target.value,
                  }))
                }
                placeholder={`Search ${filterConfig.label}`}
              />
              <CiSearch className="cursor-pointer" />
            </div>
            {options[filterKey]?.length > 0 && (
              <div className="absolute top-8 left-0 bg-white w-full border rounded-md shadow-lg z-10 max-h-56 overflow-y-auto">
                {options[filterKey].map((option) => (
                  <div
                    key={option.key}
                    className="p-2 border-b cursor-pointer"
                    onClick={() => {
                      handleFilterChange(filterKey + ".value", option.label);
                      // Clear options and search value on selection
                      setOptions((prevOptions) => ({
                        ...prevOptions,
                        [filterKey]: [],
                      }));
                      setSearchValue((prev) => ({
                        ...prev,
                        [filterKey]: "",
                      }));
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Show selected filter if present */}
        {filters[filterKey + ".value"] && (
          <div className="flex items-center mt-2 bg-gray-100 p-2 rounded-md">
            <span className="text-sm">{filters[filterKey + ".value"]}</span>
            <button
              className="ml-2 text-red-500 hover:text-red-700"
              onClick={() => removeFilter(filterKey + ".value")}
            >
              <FaTimes />
            </button>
          </div>
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
