
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
  onTopicSelect: (topicId: string) => void;
  onSidebarClose?: () => void;
  onSignOut?: () => void;
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
  onSidebarClose,
  onSignOut
}) => {
  const handleTopicSelect = (topicId: string) => {
    onTopicSelect(topicId);
    // Auto-close sidebar on mobile/tablet when topic is selected
    if (isMobileOrTablet && onSidebarClose) {
      onSidebarClose();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <SearchHeader
        searchQuery={searchQuery}
        onSearch={onSearch}
        isAdminMode={isAdminMode}
        canUseAdminMode={canUseAdminMode}
        onModeToggle={onModeToggle}
        onSidebarClose={onSidebarClose}
        isMobileOrTablet={isMobileOrTablet}
      />
      
      <div className="flex-1 overflow-auto">
        <TopicTree
          topics={displayTopics}
          selectedTopicId={selectedTopicId}
          onTopicSelect={handleTopicSelect}
          isLoading={isSearching}
        />
      </div>
      
      <AuthHeader onSignOut={onSignOut} />
    </div>
  );
};
