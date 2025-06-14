import React, { useState, useEffect } from 'react';
import { SearchHeader } from '@/components/SearchHeader';
import { TopicTree } from '@/components/TopicTree';
import { TopicDetail } from '@/components/TopicDetail';
import { AdminPanel } from '@/components/AdminPanel';
import { AuthHeader } from '@/components/AuthHeader';
import { DashboardSelector } from '@/components/DashboardSelector';
import { SharingPanel } from '@/components/SharingPanel';
import { AppLayout } from '@/components/layout/AppLayout';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { WelcomeScreen } from '@/components/layout/WelcomeScreen';
import { useSemanticSearch } from '@/hooks/useSemanticSearch';
import { useSharedLearningPaths } from '@/hooks/useSharedLearningPaths';
import { useMultipleLearningPaths } from '@/hooks/useMultipleLearningPaths';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPathUserId, setSelectedPathUserId] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  
  const isMobile = useIsMobile();
  const { availablePaths, loading: pathsLoading } = useSharedLearningPaths();
  const { topics, loading: topicsLoading, userPermission, addTopic, moveTopic, updateTopic, deleteTopic } = useMultipleLearningPaths(selectedPathUserId);
  const { searchResults, search, isSearching } = useSemanticSearch(topics);

  // Set default selected path to current user
  useEffect(() => {
    if (user && !selectedPathUserId && availablePaths.length > 0) {
      setSelectedPathUserId(user.id);
    }
  }, [user, availablePaths, selectedPathUserId]);

  // Reset selected topic when dashboard selection changes
  useEffect(() => {
    setSelectedTopicId(null);
  }, [selectedPathUserId]);

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

  const handleSignIn = () => {
    navigate('/auth');
  };

  const handlePathSelect = (userId: string) => {
    setSelectedPathUserId(userId);
  };

  const displayTopics = searchQuery.trim() ? searchResults : topics;
  const canUseAdminMode = (isAdmin && userPermission === 'owner') || userPermission === 'admin';
  const isOwner = userPermission === 'owner';

  if (authLoading || (user && (pathsLoading || topicsLoading))) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-muted-foreground text-lg">Loading your learning journey...</p>
        </div>
      </div>
    );
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Learning Paths</h2>
      </div>
      
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
          onTopicSelect={(id) => {
            setSelectedTopicId(id);
            setIsSidebarOpen(false);
          }}
          isAdminMode={isAdminMode}
          searchQuery={searchQuery}
        />
      </div>

      <AuthHeader />
    </div>
  );

  const adminPanelContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
      </div>
      
      <div className="p-4 flex-1 overflow-auto">
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
  );

  const desktopSidebar = user && (
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

      <AuthHeader />
    </div>
  );

  const desktopAdminPanel = canUseAdminMode && isAdminMode && (
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
  );

  const mainContent = (
    <div className="flex flex-col h-full">
      {user && (
        <DashboardSelector
          availablePaths={availablePaths}
          selectedPathUserId={selectedPathUserId}
          onPathSelect={handlePathSelect}
          loading={pathsLoading}
        />
      )}
      
      {selectedTopicId ? (
        <TopicDetail 
          topicId={selectedTopicId}
          topics={topics}
          isAdminMode={isAdminMode}
          onUpdateTopic={updateTopic}
          onDeleteTopic={deleteTopic}
          onAddSubtopic={addTopic}
          onTopicSelect={setSelectedTopicId}
        />
      ) : (
        <WelcomeScreen
          user={user}
          userPermission={userPermission}
          onSignIn={handleSignIn}
          isMobile={isMobile}
        />
      )}
    </div>
  );

  return (
    <AppLayout
      sidebar={desktopSidebar}
      adminPanel={desktopAdminPanel}
      showAdminPanel={canUseAdminMode && isAdminMode}
    >
      {isMobile ? (
        <>
          {user && (
            <MobileHeader
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              sidebarContent={sidebarContent}
              adminPanelContent={adminPanelContent}
              showAdminButton={canUseAdminMode && isAdminMode}
              isAdminPanelOpen={isAdminPanelOpen}
              setIsAdminPanelOpen={setIsAdminPanelOpen}
            />
          )}
          {mainContent}
        </>
      ) : (
        mainContent
      )}
    </AppLayout>
  );
};

export default Index;
