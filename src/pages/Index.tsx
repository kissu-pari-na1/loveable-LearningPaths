
import React, { useState, useEffect } from 'react';
import { SearchHeader } from '@/components/SearchHeader';
import { TopicTree } from '@/components/TopicTree';
import { TopicDetail } from '@/components/TopicDetail';
import { AdminPanel } from '@/components/AdminPanel';
import { useTopics } from '@/hooks/useTopics';
import { useSemanticSearch } from '@/hooks/useSemanticSearch';

const Index = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { topics, addTopic, moveTopic, updateTopic, deleteTopic } = useTopics();
  const { searchResults, search, isSearching } = useSemanticSearch(topics);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      await search(query);
    }
  };

  const displayTopics = searchQuery.trim() ? searchResults : topics;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-card border-r border-border shadow-lg flex flex-col">
          <SearchHeader 
            isAdminMode={isAdminMode}
            onModeToggle={() => setIsAdminMode(!isAdminMode)}
            onSearch={handleSearch}
            isSearching={isSearching}
          />
          
          <div className="flex-1 overflow-auto p-4">
            <TopicTree 
              topics={displayTopics}
              selectedTopicId={selectedTopicId}
              onTopicSelect={setSelectedTopicId}
              isAdminMode={isAdminMode}
              searchQuery={searchQuery}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {selectedTopicId ? (
            <TopicDetail 
              topicId={selectedTopicId}
              topics={topics}
              isAdminMode={isAdminMode}
              onUpdateTopic={updateTopic}
              onDeleteTopic={deleteTopic}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-muted/10">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">Welcome to Learning Paths</h2>
                <p className="text-muted-foreground">Select a topic from the sidebar to view details, or use the search to find specific content.</p>
              </div>
            </div>
          )}
        </div>

        {/* Admin Panel */}
        {isAdminMode && (
          <AdminPanel 
            topics={topics}
            onAddTopic={addTopic}
            onMoveTopic={moveTopic}
            selectedTopicId={selectedTopicId}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
