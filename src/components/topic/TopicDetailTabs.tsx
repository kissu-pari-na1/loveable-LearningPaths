
import React from 'react';
import { Topic } from '@/types/Topic';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProjectLinksSection } from '@/components/topic/ProjectLinksSection';
import { SubtopicsSection } from '@/components/topic/SubtopicsSection';
import { OverviewEditingView } from '@/components/topic/OverviewEditingView';
import { OverviewDisplayView } from '@/components/topic/OverviewDisplayView';
import { DescriptionTabContent } from '@/components/topic/DescriptionTabContent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, BookOpen, Link, Folder } from 'lucide-react';

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
        {/* Enhanced Fixed Tab Header */}
        <div className="flex-shrink-0 sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border/60 px-6 py-4">
          <TabsList className="h-12 bg-muted/30 backdrop-blur-sm border border-border/40 p-1 rounded-xl shadow-sm w-full lg:w-auto">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/30"
            >
              <FileText className="w-4 h-4 text-muted-foreground data-[state=active]:text-primary" />
              <span className="hidden sm:inline text-sm">Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="description" 
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/30"
            >
              <BookOpen className="w-4 h-4 text-muted-foreground data-[state=active]:text-primary" />
              <span className="hidden sm:inline text-sm">Description</span>
            </TabsTrigger>
            <TabsTrigger 
              value="resources" 
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/30"
            >
              <Link className="w-4 h-4 text-muted-foreground data-[state=active]:text-primary" />
              <span className="hidden sm:inline text-sm">Resources</span>
              {topic.projectLinks.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-primary/10 text-primary border border-primary/20 rounded-full font-medium">
                  {topic.projectLinks.length}
                </span>
              )}
            </TabsTrigger>
            {(hasSubtopics || isAdminMode) && (
              <TabsTrigger 
                value="subtopics" 
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/30"
              >
                <Folder className="w-4 h-4 text-muted-foreground data-[state=active]:text-primary" />
                <span className="hidden sm:inline text-sm">Subtopics</span>
                {hasSubtopics && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-primary/10 text-primary border border-primary/20 rounded-full font-medium">
                    {topic.childTopics.length}
                  </span>
                )}
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 pb-8">
            <TabsContent value="overview" className="mt-0 focus-visible:outline-none">
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

            <TabsContent value="description" className="mt-0 focus-visible:outline-none">
              <DescriptionTabContent topic={topic} />
            </TabsContent>

            <TabsContent value="resources" className="mt-0 focus-visible:outline-none">
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
              <TabsContent value="subtopics" className="mt-0 focus-visible:outline-none">
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
