
import { useNavigate } from 'react-router-dom';

interface UseIndexPageHandlersProps {
  setSearchQuery: (query: string) => void;
  setIsAdminMode: (mode: boolean) => void;
  setSelectedPathUserId: (userId: string) => void;
  setSelectedTopicId: (id: string | null) => void;
  search: (query: string) => Promise<void>;
  deleteTopic: (topicId: string) => Promise<void>;
  selectedTopicId: string | null;
  isAdmin: boolean;
  userPermission: 'owner' | 'viewer' | 'admin';
  isAdminMode: boolean;
}

export const useIndexPageHandlers = ({
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
}: UseIndexPageHandlersProps) => {
  const navigate = useNavigate();

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

  const handleSignOut = () => {
    // Clear selected topic when signing out
    setSelectedTopicId(null);
    navigate('/auth');
  };

  const handlePathSelect = (userId: string) => {
    setSelectedPathUserId(userId);
  };

  const handleDeleteTopic = async (topicId: string) => {
    // Clear selected topic if it's the one being deleted
    if (selectedTopicId === topicId) {
      setSelectedTopicId(null);
    }
    await deleteTopic(topicId);
  };

  return {
    handleSearch,
    handleModeToggle,
    handleSignIn,
    handleSignOut,
    handlePathSelect,
    handleDeleteTopic
  };
};
