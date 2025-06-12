
import React, { useState } from 'react';
import { Search, Settings } from 'lucide-react';
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

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
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
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
          disabled={isSearching}
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

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
