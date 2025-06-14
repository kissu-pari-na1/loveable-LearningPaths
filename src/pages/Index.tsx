
import React, { useEffect } from 'react';
import { MainContent } from '@/components/layout/MainContent';
import { SidebarContent } from '@/components/layout/SidebarContent';
import { AdminPanelContent } from '@/components/layout/AdminPanelContent';
import { AppLayout } from '@/components/layout/AppLayout';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { useSemanticSearch } from '@/hooks/useSemanticSearch';
import { useMultipleLearningPaths } from '@/hooks/useMultipleLearningPaths';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';
import { useIndexPageState } from '@/hooks/useIndexPageState';
import { useIndexPageHandlers } from '@/hooks/useIndexPageHandlers';

const Index = () => {
  const {
    user,
    isAdmin,
    authLoading,
    isAdminMode,
    setIsAdminMode,
    selectedTopicId,
    setSelectedTopicId,
    searchQuery,
    setSearchQuery,
    selectedPathUserId,
    setSelectedPathUserId,
    isSidebarOpen,
    setIsSidebarOpen,
    isAdminPanelOpen,
    setIsAdminPanelOpen,
    availablePaths,
    pathsLoading
  } = useIndexPageState();

  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isMobileOrTablet = isMobile || isTablet;
  
  const { topics, loading: topicsLoading, userPermission, addTopic, moveTopic, updateTopic, deleteTopic } = useMultipleLearningPaths(selectedPathUserId);
  const { searchResults, search, isSearching } = useSemanticSearch(topics);

  const {
    handleSearch,
    handleModeToggle,
    handleSignIn,
    handlePathSelect,
    handleDeleteTopic
  } = useIndexPageHandlers({
    setSearchQuery,
    setIsAdminMode,
    setSelectedPathUserId,
    setSelectedTopicId,
    search,
    deleteTopic,
    selectedTopicId,
    isAdmin,
    userPermission,
    isAdminMode
  });

  // Only allow admin mode if user has admin permission for selected path
  useEffect(() => {
    const canUseAdminMode = (isAdmin && userPermission === 'owner') || userPermission === 'admin';
    if (!canUseAdminMode && isAdminMode) {
      setIsAdminMode(false);
    }
  }, [isAdmin, userPermission, isAdminMode, setIsAdminMode]);

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
    <SidebarContent
      isAdminMode={isAdminMode}
      canUseAdminMode={canUseAdminMode}
      searchQuery={searchQuery}
      displayTopics={displayTopics}
      selectedTopicId={selectedTopicId}
      isSearching={isSearching}
      isMobileOrTablet={isMobileOrTablet}
      onModeToggle={handleModeToggle}
      onSearch={handleSearch}
      onTopicSelect={setSelectedTopicId}
      onSidebarClose={() => setIsSidebarOpen(false)}
    />
  );

  const adminPanelContent = (
    <AdminPanelContent
      topics={topics}
      selectedTopicId={selectedTopicId}
      isOwner={isOwner}
      onAddTopic={addTopic}
      onMoveTopic={moveTopic}
    />
  );

  const desktopSidebar = user && !isMobileOrTablet && (
    <div className="bg-card/95 backdrop-blur-xl border-r border-border/50 shadow-2xl flex flex-col h-full">
      <SidebarContent
        isAdminMode={isAdminMode}
        canUseAdminMode={canUseAdminMode}
        searchQuery={searchQuery}
        displayTopics={displayTopics}
        selectedTopicId={selectedTopicId}
        isSearching={isSearching}
        isMobileOrTablet={false}
        onModeToggle={handleModeToggle}
        onSearch={handleSearch}
        onTopicSelect={setSelectedTopicId}
      />
    </div>
  );

  const desktopAdminPanel = canUseAdminMode && isAdminMode && !isMobileOrTablet && (
    <div className="bg-card/95 backdrop-blur-xl border-l border-border/50 shadow-2xl flex flex-col overflow-auto h-full">
      <div className="p-4 flex-1">
        <AdminPanelContent
          topics={topics}
          selectedTopicId={selectedTopicId}
          isOwner={isOwner}
          onAddTopic={addTopic}
          onMoveTopic={moveTopic}
        />
      </div>
    </div>
  );

  const mainContent = (
    <MainContent
      user={user}
      availablePaths={availablePaths}
      selectedPathUserId={selectedPathUserId}
      selectedTopicId={selectedTopicId}
      topics={topics}
      isAdminMode={isAdminMode}
      userPermission={userPermission}
      pathsLoading={pathsLoading}
      isMobile={isMobile}
      onPathSelect={handlePathSelect}
      onUpdateTopic={updateTopic}
      onDeleteTopic={handleDeleteTopic}
      onAddSubtopic={addTopic}
      onTopicSelect={setSelectedTopicId}
      onSignIn={handleSignIn}
    />
  );

  return (
    <AppLayout
      sidebar={desktopSidebar}
      adminPanel={desktopAdminPanel}
      showAdminPanel={canUseAdminMode && isAdminMode}
    >
      {isMobileOrTablet ? (
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
