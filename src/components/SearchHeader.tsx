
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const inputRef = useRef<HTMLInputElement>(null);

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
    <div className="p-4 border-b border-border/50 bg-gradient-to-b from-background/80 to-muted/20 space-y-4">
      {/* Header with title */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Learning Paths
        </h2>
      </div>

      {/* Search Input with enhanced styling */}
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10 transition-colors group-focus-within:text-primary" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search topics..."
          value={localSearchQuery}
          onChange={(e) => handleInputChange(e.target.value)}
          className={`pl-10 ${localSearchQuery ? 'pr-10' : 'pr-3'} border-border/50 bg-background/60 backdrop-blur-sm focus:bg-background focus:border-primary/50 transition-all duration-200 hover:border-primary/30`}
        />
        
        {/* Clear button - only show when there's text to clear */}
        {localSearchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted/80 z-10 transition-colors"
            onClick={handleClearSearch}
          >
            <X className="h-3 w-3 text-muted-foreground hover:text-foreground transition-colors" />
          </Button>
        )}
      </div>

      {/* Admin Mode Toggle with enhanced styling */}
      {canUseAdminMode && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-background/60 to-muted/30 border border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
          <span className="text-sm font-medium text-foreground/90">
            {isAdminMode ? 'Admin Mode' : 'View Mode'}
          </span>
          <Button
            variant={isAdminMode ? "default" : "outline"}
            size="sm"
            onClick={onModeToggle}
            className={`flex items-center gap-2 transition-all duration-200 ${
              isAdminMode 
                ? 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md' 
                : 'border-primary/30 hover:border-primary bg-gradient-to-r from-background/80 to-background/60 hover:from-primary/10 hover:to-primary/5'
            }`}
          >
            <Settings className="h-4 w-4" />
            {isAdminMode ? 'Exit Admin' : 'Admin Mode'}
          </Button>
        </div>
      )}
    </div>
  );
};
