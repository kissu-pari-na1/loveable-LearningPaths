
import React from 'react';
import { SearchHeader } from '@/components/SearchHeader';
import { TopicTree } from '@/components/TopicTree';
import { AuthHeader } from '@/components/AuthHeader';
import { Topic } from '@/types/Topic';

interface SidebarContentProps {
  isAdminMode: boolean;
  canUseAdminMode: boolean;
  searchQuery: string;
  displayTopics: Topic[];
  selectedTopicId: string | null;
  isSearching: boolean;
  isMobileOrTablet: boolean;
  onModeToggle: () => void;
  onSearch: (query: string) => void;
  onTopicSelect: (id: string) => void;
  onSidebarClose?: () => void;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({
  isAdminMode,
  canUseAdminMode,
  searchQuery,
  displayTopics,
  selectedTopicId,
  isSearching,
  isMobileOrTablet,
  onModeToggle,
  onSearch,
  onTopicSelect,
  onSidebarClose
}) => {
  const handleTopicSelect = (id: string) => {
    onTopicSelect(id);
    if (isMobileOrTablet && onSidebarClose) {
      onSidebarClose();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 md:p-4 border-b">
        <h2 className="text-base md:text-lg font-semibold">Learning Paths</h2>
      </div>
      
      <SearchHeader 
        isAdminMode={isAdminMode}
        onModeToggle={onModeToggle}
        onSearch={onSearch}
        isSearching={isSearching}
        showAdminToggle={canUseAdminMode}
      />
      
      <div className="flex-1 overflow-auto p-3 md:p-4">
        <TopicTree 
          topics={displayTopics}
          selectedTopicId={selectedTopicId}
          onTopicSelect={handleTopicSelect}
          isAdminMode={isAdminMode}
          searchQuery={searchQuery}
        />
      </div>

      <AuthHeader />
    </div>
  );
};
