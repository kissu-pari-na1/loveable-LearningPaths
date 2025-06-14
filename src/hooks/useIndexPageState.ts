
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSharedLearningPaths } from '@/hooks/useSharedLearningPaths';

export const useIndexPageState = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPathUserId, setSelectedPathUserId] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  
  const { availablePaths, loading: pathsLoading } = useSharedLearningPaths();

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

  return {
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
  };
};
