
import React from 'react';
import { Topic } from '@/types/Topic';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProjectLinksSection } from '@/components/topic/ProjectLinksSection';
import { SubtopicsSection } from '@/components/topic/SubtopicsSection';
import { OverviewEditingView } from '@/components/topic/OverviewEditingView';
import { OverviewDisplayView } from '@/components/topic/OverviewDisplayView';
import { DescriptionTabContent } from '@/components/topic/DescriptionTabContent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  activeTab,
  onTabChange,
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

  const handleReadMoreClick = () => {
    onTabChange('description');
  };

  return (
    <div className="flex flex-col h-full">
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex flex-col h-full">
        {/* Fixed Tab Header */}
        <div className="flex-shrink-0 sticky top-0 z-20 bg-background border-b border-border px-4 py-3 shadow-sm">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:inline-flex">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <span className="text-sm">📋</span>
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="description" className="flex items-center gap-2">
              <span className="text-sm">📝</span>
              <span className="hidden sm:inline">Description</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <span className="text-sm">🔗</span>
              <span className="hidden sm:inline">Resources</span>
              {topic.projectLinks.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                  {topic.projectLinks.length}
                </span>
              )}
            </TabsTrigger>
            {(hasSubtopics || isAdminMode) && (
              <TabsTrigger value="subtopics" className="flex items-center gap-2">
                <span className="text-sm">📂</span>
                <span className="hidden sm:inline">Subtopics</span>
                {hasSubtopics && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                    {topic.childTopics.length}
                  </span>
                )}
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 pb-6">
            <TabsContent value="overview" className="mt-0">
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
                  onReadMoreClick={handleReadMoreClick}
                />
              )}
            </TabsContent>

            <TabsContent value="description" className="mt-0">
              <DescriptionTabContent topic={topic} />
            </TabsContent>

            <TabsContent value="resources" className="mt-0">
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
            </TabsContent>

            {(hasSubtopics || isAdminMode) && (
              <TabsContent value="subtopics" className="mt-0">
                <SubtopicsSection
                  topic={topic}
                  isAdminMode={isAdminMode}
                  onSubtopicClick={onSubtopicClick}
                  onAddSubtopic={onAddSubtopic}
                />
              </TabsContent>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
};
