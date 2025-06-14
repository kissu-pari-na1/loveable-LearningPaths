
import React, { useState, useEffect, useCallback } from 'react';
import { Search, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchHeaderProps {
  isAdminMode: boolean;
  onModeToggle: () => void;
  onSearch: (query: string) => void;
  isSearching: boolean;
  showAdminToggle?: boolean;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  isAdminMode,
  onModeToggle,
  onSearch,
  isSearching,
  showAdminToggle = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Trigger search when debounced query changes
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
  };

  return (
    <div className="p-4 border-b border-border space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search topics..."
          value={searchQuery}
          onChange={(e) => handleInputChange(e.target.value)}
          className="pl-10 pr-10"
        />
        
        {/* Clear button */}
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-8 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
            onClick={handleClearSearch}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        
        {/* Loading indicator */}
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Search status */}
      {searchQuery && !isSearching && (
        <div className="text-xs text-muted-foreground">
          {debouncedQuery !== searchQuery ? 'Typing...' : `Search results for "${debouncedQuery}"`}
        </div>
      )}

      {/* Admin Mode Toggle */}
      {showAdminToggle && (
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
