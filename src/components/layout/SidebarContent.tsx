
import React, { useState } from 'react';
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
  // Manage expanded topics state at this level to persist across sidebar close/open
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  const handleTopicSelect = (topicId: string) => {
    onTopicSelect(topicId);
    // Auto-close sidebar on mobile/tablet when topic is selected
    if (isMobileOrTablet && onSidebarClose) {
      onSidebarClose();
    }
  };

  const handleToggleExpanded = (topicId: string) => {
    setExpandedTopics(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(topicId)) {
        newExpanded.delete(topicId);
      } else {
        newExpanded.add(topicId);
      }
      return newExpanded;
    });
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
          expandedTopics={expandedTopics}
          onToggleExpanded={handleToggleExpanded}
        />
      </div>
      
      <AuthHeader onSignOut={onSignOut} />
    </div>
  );
};
