
import React from 'react';
import { DashboardSelector } from '@/components/DashboardSelector';
import { TopicDetail } from '@/components/TopicDetail';
import { WelcomeScreen } from '@/components/layout/WelcomeScreen';
import { Topic } from '@/types/Topic';
import { LearningPathAccess } from '@/hooks/useSharedLearningPaths';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MainContentProps {
  user: any;
  availablePaths: LearningPathAccess[];
  selectedPathUserId: string;
  selectedTopicId: string | null;
  topics: Topic[];
  isAdminMode: boolean;
  userPermission: 'owner' | 'viewer' | 'admin';
  pathsLoading: boolean;
  isMobile: boolean;
  onPathSelect: (userId: string) => void;
  onUpdateTopic: (topicId: string, updates: Partial<Topic>) => void;
  onDeleteTopic: (topicId: string) => void;
  onAddSubtopic: (newTopic: Omit<Topic, 'id'>, parentId: string) => void;
  onTopicSelect: (topicId: string) => void;
  onSignIn: () => void;
}

export const MainContent: React.FC<MainContentProps> = ({
  user,
  availablePaths,
  selectedPathUserId,
  selectedTopicId,
  topics,
  isAdminMode,
  userPermission,
  pathsLoading,
  isMobile,
  onPathSelect,
  onUpdateTopic,
  onDeleteTopic,
  onAddSubtopic,
  onTopicSelect,
  onSignIn
}) => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {user && (
        <div className="flex-shrink-0 border-b border-border/50 bg-card/50 backdrop-blur-sm">
          <DashboardSelector
            availablePaths={availablePaths}
            selectedPathUserId={selectedPathUserId}
            onPathSelect={onPathSelect}
            loading={pathsLoading}
          />
        </div>
      )}
      
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full w-full">
          {selectedTopicId ? (
            <TopicDetail 
              topicId={selectedTopicId}
              topics={topics}
              isAdminMode={isAdminMode}
              onUpdateTopic={onUpdateTopic}
              onDeleteTopic={onDeleteTopic}
              onAddSubtopic={onAddSubtopic}
              onTopicSelect={onTopicSelect}
            />
          ) : (
            <WelcomeScreen
              user={user}
              userPermission={userPermission}
              onSignIn={onSignIn}
              isMobile={isMobile}
            />
          )}
        </ScrollArea>
      </div>
    </div>
  );
};
