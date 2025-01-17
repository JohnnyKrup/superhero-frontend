import React, { useState, useCallback } from "react";
import { debounce } from "lodash";
import { Input } from "./controls/input";
import { Loader2 } from "lucide-react";
import PropTypes from "prop-types";

export const HeroSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const searchHero = useCallback(
    debounce(async (term) => {
      if (term.length < 3) {
        onSearch && onSearch(null);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/superheroapi/search/${term}`);
        const data = await response.json();
        onSearch && onSearch(data.results);
      } catch (error) {
        console.error("Search failed:", error);
        onSearch && onSearch(null);
      }
      setLoading(false);
    }, 500),
    [onSearch]
  );

  return (
    <div className="relative w-full">
      <Input
        type="search"
        placeholder="Search heroes (minimum 3 characters)"
        value={searchTerm}
        onChange={(e) => {
          const value = e.target.value;
          setSearchTerm(value);
          searchHero(value);
        }}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        </div>
      )}
    </div>
  );
};

HeroSearch.propTypes = {
  onSearch: PropTypes.func,
};
