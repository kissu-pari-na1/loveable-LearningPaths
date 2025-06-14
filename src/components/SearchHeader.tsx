
import React, { useState, useEffect, useCallback } from 'react';
import { Search, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchHeaderProps {
  searchQuery: string;
  isAdminMode: boolean;
  canUseAdminMode: boolean;
  onModeToggle: () => void;
  onSearch: (query: string) => void;
  onSidebarClose?: () => void;
  isMobileOrTablet: boolean;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  searchQuery,
  isAdminMode,
  canUseAdminMode,
  onModeToggle,
  onSearch,
  onSidebarClose,
  isMobileOrTablet
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Update local state when external searchQuery changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
    setDebouncedQuery(searchQuery);
  }, [searchQuery]);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(localSearchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [localSearchQuery]);

  // Trigger search when debounced query changes
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleInputChange = (value: string) => {
    setLocalSearchQuery(value);
  };

  const handleClearSearch = () => {
    setLocalSearchQuery('');
    setDebouncedQuery('');
  };

  return (
    <div className="p-4 border-b border-border space-y-4">
      {/* Mobile close button */}
      {isMobileOrTablet && onSidebarClose && (
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Learning Paths</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSidebarClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search topics..."
          value={localSearchQuery}
          onChange={(e) => handleInputChange(e.target.value)}
          className="pl-10 pr-10"
        />
        
        {/* Clear button */}
        {localSearchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
            onClick={handleClearSearch}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Search status */}
      {localSearchQuery && (
        <div className="text-xs text-muted-foreground">
          {debouncedQuery !== localSearchQuery ? 'Typing...' : `Search results for "${debouncedQuery}"`}
        </div>
      )}

      {/* Admin Mode Toggle */}
      {canUseAdminMode && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {isAdminMode ? 'Admin Mode' : 'View Mode'}
          </span>
          <Button
            variant={isAdminMode ? "default" : "outline"}
            size="sm"
            onClick={onModeToggle}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            {isAdminMode ? 'Exit Admin' : 'Admin Mode'}
          </Button>
        </div>
      )}
    </div>
  );
};
