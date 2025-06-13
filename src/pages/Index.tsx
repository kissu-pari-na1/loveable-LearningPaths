
import React, { useState, useEffect } from 'react';
import { SearchHeader } from '@/components/SearchHeader';
import { TopicTree } from '@/components/TopicTree';
import { TopicDetail } from '@/components/TopicDetail';
import { AdminPanel } from '@/components/AdminPanel';
import { AuthHeader } from '@/components/AuthHeader';
import { DashboardSelector } from '@/components/DashboardSelector';
import { SharingPanel } from '@/components/SharingPanel';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useSemanticSearch } from '@/hooks/useSemanticSearch';
import { useSharedLearningPaths } from '@/hooks/useSharedLearningPaths';
import { useMultipleLearningPaths } from '@/hooks/useMultipleLearningPaths';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPathUserId, setSelectedPathUserId] = useState<string>('');
  
  const { availablePaths, loading: pathsLoading } = useSharedLearningPaths();
  const { topics, loading: topicsLoading, userPermission, addTopic, moveTopic, updateTopic, deleteTopic } = useMultipleLearningPaths(selectedPathUserId);
  const { searchResults, search, isSearching } = useSemanticSearch(topics);

  // Set default selected path to current user
  useEffect(() => {
    if (user && !selectedPathUserId && availablePaths.length > 0) {
      setSelectedPathUserId(user.id);
    }
  }, [user, availablePaths, selectedPathUserId]);

  // Only allow admin mode if user has admin permission for selected path
  useEffect(() => {
    const canUseAdminMode = (isAdmin && userPermission === 'owner') || userPermission === 'admin';
    if (!canUseAdminMode && isAdminMode) {
      setIsAdminMode(false);
    }
  }, [isAdmin, userPermission, isAdminMode]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      await search(query);
    }
  };

  const handleModeToggle = () => {
    const canUseAdminMode = (isAdmin && userPermission === 'owner') || userPermission === 'admin';
    if (canUseAdminMode) {
      setIsAdminMode(!isAdminMode);
    }
  };

  const displayTopics = searchQuery.trim() ? searchResults : topics;
  const canUseAdminMode = (isAdmin && userPermission === 'owner') || userPermission === 'admin';
  const isOwner = userPermission === 'owner';

  if (authLoading || pathsLoading || topicsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="flex h-screen">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Sidebar Panel */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
            <div className="bg-card border-r border-border shadow-lg flex flex-col h-full">
              <AuthHeader />
              
              <DashboardSelector
                availablePaths={availablePaths}
                selectedPathUserId={selectedPathUserId}
                onPathSelect={setSelectedPathUserId}
                loading={pathsLoading}
              />
              
              <SearchHeader 
                isAdminMode={isAdminMode}
                onModeToggle={handleModeToggle}
                onSearch={handleSearch}
                isSearching={isSearching}
                showAdminToggle={canUseAdminMode}
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
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Main Content Panel */}
          <ResizablePanel defaultSize={canUseAdminMode && isAdminMode ? 50 : 75}>
            <div className="flex flex-col h-full">
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
                    <p className="text-muted-foreground">
                      {user ? (
                        <>Select a topic from the sidebar to view details, or use the search to find specific content.</>
                      ) : (
                        <>Sign in to access all features, or browse topics in view mode.</>
                      )}
                    </p>
                    {userPermission && userPermission !== 'owner' && (
                      <p className="text-sm text-muted-foreground mt-2">
                        You have {userPermission} access to this learning path.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </ResizablePanel>

          {/* Admin Panel - show if user has admin permissions and is in admin mode */}
          {canUseAdminMode && isAdminMode && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
                <div className="bg-card border-l border-border shadow-lg flex flex-col overflow-auto h-full">
                  <div className="p-4">
                    <AdminPanel 
                      topics={topics}
                      onAddTopic={addTopic}
                      onMoveTopic={moveTopic}
                      selectedTopicId={selectedTopicId}
                    />
                  </div>
                  
                  {isOwner && (
                    <div className="p-4 border-t border-border">
                      <SharingPanel isOwner={isOwner} />
                    </div>
                  )}
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Index;
