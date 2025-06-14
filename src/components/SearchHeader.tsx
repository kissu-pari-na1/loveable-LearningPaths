
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

  // Update local state when external searchQuery changes (but avoid infinite loops)
  useEffect(() => {
    if (searchQuery !== localSearchQuery) {
      setLocalSearchQuery(searchQuery);
    }
  }, [searchQuery]);

  // Debounce the search with useCallback to prevent recreating the function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (query: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          onSearch(query);
        }, 300);
      };
    })(),
    [onSearch]
  );

  // Trigger search when local query changes
  useEffect(() => {
    debouncedSearch(localSearchQuery);
  }, [localSearchQuery, debouncedSearch]);

  const handleInputChange = (value: string) => {
    setLocalSearchQuery(value);
  };

  const handleClearSearch = () => {
    setLocalSearchQuery('');
  };

  return (
    <div className="p-4 border-b border-border space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search topics..."
          value={localSearchQuery}
          onChange={(e) => handleInputChange(e.target.value)}
          className={`pl-10 ${localSearchQuery ? 'pr-10' : 'pr-3'}`}
        />
        
        {/* Clear button - only show when there's text to clear */}
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
