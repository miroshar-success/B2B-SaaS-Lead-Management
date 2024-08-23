import { useEffect, useState, useRef, useCallback, KeyboardEvent } from "react";
import { CiSearch } from "react-icons/ci";
import { axiosInstance } from "../context/Auth";

interface SearchOptionProps {
  filterKey: string;
  url: string;
  handleFilterChange: (key: string, type: string, value: string | null) => void;
  exclude?: boolean;
  selectedOptions: string[];
  customOptions?: string[]; // Optional custom options prop
}

const SearchOption: React.FC<SearchOptionProps> = ({
  filterKey,
  url,
  handleFilterChange,
  exclude,
  selectedOptions,
  customOptions, // Destructure customOptions
}) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [allOptions, setAllOptions] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState<boolean>(!exclude);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchAllOptions = async () => {
    if (customOptions) {
      // Use custom options if provided
      console.log(customOptions);
      setAllOptions(customOptions);
      setOptions(customOptions);
    } else {
      try {
        const response = await axiosInstance.get(`/${url}/search`, {
          params: {
            field: filterKey,
            value: "",
            limit: 25,
          },
        });
        setAllOptions(response.data);
        setOptions(response.data);
      } catch (error) {
        console.error("Error fetching all options:", error);
      }
    }
  };

  const handleSearch = async () => {
    if (!searchValue) {
      setOptions(allOptions); // Show all options if search is empty
      return;
    }

    if (customOptions) {
      // Filter custom options locally
      const filteredOptions = customOptions.filter((option) =>
        option.toLowerCase().includes(searchValue.toLowerCase())
      );
      setOptions(filteredOptions);
    } else {
      try {
        const response = await axiosInstance.get(`/${url}/search`, {
          params: {
            field: filterKey,
            value: searchValue,
            limit: 10,
          },
        });
        setOptions(response.data);
      } catch (error) {
        console.error("Error searching leads:", error);
      }
    }
  };

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Fetch all options initially
    fetchAllOptions();
  }, [customOptions]);

  const handleOptionClick = (option: string) => {
    setSearchValue(""); // Clear search input
    setOptions(allOptions); // Reset to show all options

    const updatedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((o) => o !== option)
      : [...selectedOptions, option];
    handleFilterChange(
      filterKey + ".value",
      exclude ? "exclude" : "include",
      updatedOptions.join(",")
    );
  };

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && searchValue === "") {
      const updatedOptions = selectedOptions.slice(0, -1);
      handleFilterChange(
        filterKey + ".value",
        exclude ? "exclude" : "include",
        updatedOptions.join(",")
      );
    }
  };

  return (
    <div className="relative mb-2">
      {exclude && (
        <label className="flex items-center">
          <input
            type="checkbox"
            value="isAnyOf"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
          />
          <span className="ml-2">
            {exclude ? "Is not any of" : "Is any of"}
          </span>
        </label>
      )}
      {isChecked && (
        <div className="relative mt-2">
          <div
            className="flex items-center flex-wrap border rounded-md cursor-pointer"
            onClick={toggleDropdown}
          >
            {selectedOptions.length > 0 && (
              <div className="flex flex-wrap p-1 gap-1">
                {selectedOptions.map((value) => (
                  <div className="text-xs bg-gray-100 p-0.5 px-1">{value}</div>
                ))}
              </div>
            )}

            <div className="flex">
              <input
                className="w-full border-b p-2 focus:outline-none"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search"
              />
              <div className="p-2">
                <CiSearch size={16} />
              </div>
            </div>
          </div>
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-0 bg-white border rounded-md shadow-lg z-10 w-full max-h-56 overflow-y-auto mt-1"
            >
              <div>
                {options.length > 0 ? (
                  options.map((option) => (
                    <div
                      key={option}
                      className={`p-2 border-b cursor-pointer ${
                        selectedOptions.includes(option) ? "bg-gray-200" : ""
                      }`}
                      onClick={() => handleOptionClick(option)}
                    >
                      {option}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-500">No options found</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchOption;
