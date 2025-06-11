
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface SearchHeaderProps {
  isAdminMode: boolean;
  onModeToggle: () => void;
  onSearch: (query: string) => void;
  isSearching: boolean;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  isAdminMode,
  onModeToggle,
  onSearch,
  isSearching
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="p-4 border-b border-border bg-card/50 backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-foreground">Learning Paths</h1>
        <div className="flex items-center gap-2">
          <Badge variant={isAdminMode ? "default" : "secondary"}>
            {isAdminMode ? "Admin" : "View"}
          </Badge>
          <Button
            onClick={onModeToggle}
            variant="outline"
            size="sm"
          >
            {isAdminMode ? "View Mode" : "Admin Mode"}
          </Button>
        </div>
      </div>
      
      <form onSubmit={handleSearch} className="space-y-2">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search topics with semantic search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-20"
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              ×
            </Button>
          )}
        </div>
        {isSearching && (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            Searching...
          </div>
        )}
      </form>
    </div>
  );
};
