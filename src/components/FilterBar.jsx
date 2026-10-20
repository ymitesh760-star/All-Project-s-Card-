import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { categories } from "../data/projectsData";

export default function FilterBar({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  filteredCount,
  totalCount
}) {
  const searchInputRef = useRef(null);

  // Keyboard shortcut "/" to focus search box
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "Escape" && document.activeElement === searchInputRef.current) {
        onSearchChange("");
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSearchChange]);

  return (
    <div className="filter-bar-root">
      <div className="filter-bar-container">
        {/* Category Filter Pills */}
        <div className="category-pills-list" role="tablist" aria-label="Filter project categories">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectCategory(cat.id)}
                className={`category-pill-btn ${isActive ? "active" : ""}`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeFilterPill"
                    className="pill-active-bg"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="pill-text">{cat.label}</span>
                {isActive && (
                  <span className="pill-count-bubble">{filteredCount}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Search Input & Count Spec */}
        <div className="filter-right-tools">
          <div className="search-field-box">
            <Search size={15} className="search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter by title or technology..."
              className="search-input"
              aria-label="Search projects by title, description, or technology"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="search-clear-btn"
                title="Clear search (Esc)"
                aria-label="Clear search query"
              >
                <X size={13} />
              </button>
            ) : (
              <kbd className="search-kbd-hint" title="Press / to search">
                /
              </kbd>
            )}
          </div>

          <div className="filter-count-indicator">
            <span className="count-figures">
              {filteredCount} of {totalCount} Works
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
