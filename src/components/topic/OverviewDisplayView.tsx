
import React from 'react';
import { Topic } from '@/types/Topic';
import { AdminActionsCard } from '@/components/topic/AdminActionsCard';
import { TopicHeaderCard } from '@/components/topic/TopicHeaderCard';
import { QuickStatsCard } from '@/components/topic/QuickStatsCard';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

interface OverviewDisplayViewProps {
  topic: Topic;
  isAdminMode: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onReadMoreClick: () => void;
  parentTopic?: Topic | null;
  onParentTopicClick?: (parentId: string) => void;
  onTabChange?: (tab: string) => void;
}

export const OverviewDisplayView: React.FC<OverviewDisplayViewProps> = ({
  topic,
  isAdminMode,
  onEdit,
  onDelete,
  onReadMoreClick,
  parentTopic,
  onParentTopicClick,
  onTabChange
}) => {
  return (
    <div className="space-y-5">
      {/* Parent Topic Button */}
      {parentTopic && onParentTopicClick && (
        <div className="flex justify-start">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onParentTopicClick(parentTopic.id)}
            className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200"
          >
            <ArrowUp className="w-4 h-4" />
            <span className="font-medium">Back to {parentTopic.name}</span>
          </Button>
        </div>
      )}

      {/* Admin Actions */}
      {isAdminMode && (
        <AdminActionsCard
          topic={topic}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}

      {/* Topic Header Card */}
      <TopicHeaderCard
        topic={topic}
        onReadMoreClick={onReadMoreClick}
      />

      {/* Quick Stats Card */}
      <QuickStatsCard topic={topic} onTabChange={onTabChange} />
    </div>
  );
};
