
import React from 'react';
import { Topic } from '@/types/Topic';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProjectLinksSection } from '@/components/topic/ProjectLinksSection';
import { SubtopicsSection } from '@/components/topic/SubtopicsSection';
import { OverviewEditingView } from '@/components/topic/OverviewEditingView';
import { OverviewDisplayView } from '@/components/topic/OverviewDisplayView';
import { DescriptionTabContent } from '@/components/topic/DescriptionTabContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NewLinkData {
  title: string;
  url: string;
  description: string;
  types: ('Personal' | 'Project')[];
}

interface TopicDetailTabsProps {
  topic: Topic;
  isAdminMode: boolean;
  activeTab: string;
  onTabChange: (value: string) => void;
  showAddLink: boolean;
  newLink: NewLinkData;
  onToggleAddLink: () => void;
  onAddLink: () => void;
  onRemoveLink: (linkId: string) => void;
  onNewLinkChange: (field: keyof NewLinkData, value: string | ('Personal' | 'Project')[]) => void;
  onSubtopicClick: (subtopicId: string) => void;
  onAddSubtopic?: (newSubtopic: Omit<Topic, 'id'>, parentId: string) => void;
  isEditing: boolean;
  editForm: { name: string; description: string };
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onEditFormChange: (field: 'name' | 'description', value: string) => void;
}

export const TopicDetailTabs: React.FC<TopicDetailTabsProps> = ({
  topic,
  isAdminMode,
  showAddLink,
  newLink,
  onToggleAddLink,
  onAddLink,
  onRemoveLink,
  onNewLinkChange,
  onSubtopicClick,
  onAddSubtopic,
  isEditing,
  editForm,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onEditFormChange
}) => {
  const hasSubtopics = topic.childTopics.length > 0;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ScrollArea className="h-full w-full">
        <div className="space-y-6 p-1 pb-6">
          {/* Overview Section */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <span className="text-lg">📋</span>
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <OverviewEditingView
                  editForm={editForm}
                  onSave={onSave}
                  onCancel={onCancel}
                  onEditFormChange={onEditFormChange}
                />
              ) : (
                <OverviewDisplayView
                  topic={topic}
                  isAdminMode={isAdminMode}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              )}
            </CardContent>
          </Card>

          {/* Description Section */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <span className="text-lg">📝</span>
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DescriptionTabContent topic={topic} />
            </CardContent>
          </Card>

          {/* Resources Section */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <span className="text-lg">🔗</span>
                Resources
                {topic.projectLinks.length > 0 && (
                  <span className="ml-2 px-2 py-1 text-xs bg-gradient-to-r from-primary to-purple-600 text-primary-foreground rounded-full shadow-sm">
                    {topic.projectLinks.length}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectLinksSection
                topic={topic}
                isAdminMode={isAdminMode}
                showAddLink={showAddLink}
                newLink={newLink}
                onToggleAddLink={onToggleAddLink}
                onAddLink={onAddLink}
                onRemoveLink={onRemoveLink}
                onNewLinkChange={onNewLinkChange}
              />
            </CardContent>
          </Card>

          {/* Subtopics Section */}
          {(hasSubtopics || isAdminMode) && (
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <span className="text-lg">📂</span>
                  Subtopics
                  {hasSubtopics && (
                    <span className="ml-2 px-2 py-1 text-xs bg-gradient-to-r from-primary to-purple-600 text-primary-foreground rounded-full shadow-sm">
                      {topic.childTopics.length}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SubtopicsSection
                  topic={topic}
                  isAdminMode={isAdminMode}
                  onSubtopicClick={onSubtopicClick}
                  onAddSubtopic={onAddSubtopic}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
