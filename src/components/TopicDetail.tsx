
import React from 'react';
import { Topic } from '@/types/Topic';
import { TopicDetailContent } from '@/components/topic/TopicDetailContent';

interface TopicDetailProps {
  topicId: string;
  topics: Topic[];
  isAdminMode: boolean;
  onUpdateTopic: (topicId: string, updates: Partial<Topic>) => void;
  onDeleteTopic: (topicId: string) => void;
  onAddSubtopic?: (newSubtopic: Omit<Topic, 'id'>, parentId: string) => void;
  onTopicSelect?: (topicId: string) => void;
}

export const TopicDetail: React.FC<TopicDetailProps> = ({
  topicId,
  topics,
  isAdminMode,
  onUpdateTopic,
  onDeleteTopic,
  onAddSubtopic,
  onTopicSelect
}) => {
  const findTopicById = (topics: Topic[], id: string): Topic | null => {
    for (const topic of topics) {
      if (topic.id === id) return topic;
      const found = findTopicById(topic.childTopics, id);
      if (found) return found;
    }
    return null;
  };

  const topic = findTopicById(topics, topicId);

  if (!topic) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Topic not found</h2>
          <p className="text-muted-foreground">The selected topic could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <TopicDetailContent
        topic={topic}
        isAdminMode={isAdminMode}
        onUpdateTopic={onUpdateTopic}
        onDeleteTopic={onDeleteTopic}
        onAddSubtopic={onAddSubtopic}
        onTopicSelect={onTopicSelect}
      />
    </div>
  );
};
