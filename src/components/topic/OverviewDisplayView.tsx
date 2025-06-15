
import React from 'react';
import { Topic } from '@/types/Topic';
import { AdminActionsCard } from '@/components/topic/AdminActionsCard';
import { TopicHeaderCard } from '@/components/topic/TopicHeaderCard';
import { QuickStatsCard } from '@/components/topic/QuickStatsCard';

interface OverviewDisplayViewProps {
  topic: Topic;
  isAdminMode: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onReadMoreClick: () => void;
}

export const OverviewDisplayView: React.FC<OverviewDisplayViewProps> = ({
  topic,
  isAdminMode,
  onEdit,
  onDelete,
  onReadMoreClick
}) => {
  return (
    <div className="space-y-5">
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
      <QuickStatsCard topic={topic} />
    </div>
  );
};
