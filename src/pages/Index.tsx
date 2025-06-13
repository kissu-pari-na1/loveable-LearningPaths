
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
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-muted-foreground text-lg">Loading your learning journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-800">
      <div className="flex h-screen">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Sidebar Panel */}
          <ResizablePanel defaultSize={28} minSize={15} maxSize={75}>
            <div className="bg-card/95 backdrop-blur-xl border-r border-border/50 shadow-2xl flex flex-col h-full">
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

              {/* AuthHeader moved to bottom */}
              <AuthHeader />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Main Content Panel */}
          <ResizablePanel defaultSize={canUseAdminMode && isAdminMode ? 50 : 75}>
            <div className="flex flex-col h-full">
              {/* DashboardSelector moved to top of main panel */}
              <DashboardSelector
                availablePaths={availablePaths}
                selectedPathUserId={selectedPathUserId}
                onPathSelect={setSelectedPathUserId}
                loading={pathsLoading}
              />
              
              {selectedTopicId ? (
                <TopicDetail 
                  topicId={selectedTopicId}
                  topics={topics}
                  isAdminMode={isAdminMode}
                  onUpdateTopic={updateTopic}
                  onDeleteTopic={deleteTopic}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background/50 to-muted/30 backdrop-blur-sm">
                  <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-violet-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent mb-4">
                      Welcome to Learning Paths
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {user ? (
                        <>Discover knowledge through beautifully organized learning paths. Select a topic to begin your journey of exploration.</>
                      ) : (
                        <>Join our community of learners. Sign in to unlock the full potential of personalized learning paths.</>
                      )}
                    </p>
                    {userPermission && userPermission !== 'owner' && (
                      <p className="text-sm text-violet-600 dark:text-violet-400 mt-4 px-4 py-2 bg-violet-50 dark:bg-violet-900/30 rounded-full">
                        You have {userPermission} access to this learning path
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
                <div className="bg-card/95 backdrop-blur-xl border-l border-border/50 shadow-2xl flex flex-col overflow-auto h-full">
                  <div className="p-4 flex-1">
                    <AdminPanel 
                      topics={topics}
                      onAddTopic={addTopic}
                      onMoveTopic={moveTopic}
                      selectedTopicId={selectedTopicId}
                    />
                  </div>
                  
                  {isOwner && (
                    <div className="p-4 border-t border-border/50">
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
