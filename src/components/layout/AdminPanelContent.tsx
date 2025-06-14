
import React from 'react';
import { AdminPanel } from '@/components/AdminPanel';
import { SharingPanel } from '@/components/SharingPanel';
import { Topic } from '@/types/Topic';

interface AdminPanelContentProps {
  topics: Topic[];
  selectedTopicId: string | null;
  isOwner: boolean;
  onAddTopic: (topic: Omit<Topic, 'id'>, parentId?: string) => void;
  onMoveTopic: (topicId: string, newParentId?: string) => void;
}

export const AdminPanelContent: React.FC<AdminPanelContentProps> = ({
  topics,
  selectedTopicId,
  isOwner,
  onAddTopic,
  onMoveTopic
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 md:p-4 border-b">
        <h2 className="text-base md:text-lg font-semibold">Admin Panel</h2>
      </div>
      
      <div className="p-3 md:p-4 flex-1 overflow-auto">
        <AdminPanel 
          topics={topics}
          onAddTopic={onAddTopic}
          onMoveTopic={onMoveTopic}
          selectedTopicId={selectedTopicId}
        />
      </div>
      
      {isOwner && (
        <div className="p-3 md:p-4 border-t border-border/50">
          <SharingPanel isOwner={isOwner} />
        </div>
      )}
    </div>
  );
};
