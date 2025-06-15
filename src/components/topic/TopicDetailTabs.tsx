
import React from 'react';
import { Topic } from '@/types/Topic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProjectLinksSection } from '@/components/topic/ProjectLinksSection';
import { SubtopicsSection } from '@/components/topic/SubtopicsSection';
import { OverviewEditingView } from '@/components/topic/OverviewEditingView';
import { OverviewDisplayView } from '@/components/topic/OverviewDisplayView';
import { DescriptionTabContent } from '@/components/topic/DescriptionTabContent';

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
    <div className="flex flex-col h-full overflow-hidden">
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex flex-col h-full overflow-hidden">
        <TabsList className="grid w-full grid-cols-4 mb-4 bg-gradient-to-r from-muted/50 to-muted/30 p-1 rounded-xl h-11 md:h-12 flex-shrink-0 shadow-sm border border-border/50">
          <TabsTrigger 
            value="overview" 
            className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-white data-[state=active]:to-blue-50/50 dark:data-[state=active]:from-slate-800 dark:data-[state=active]:to-blue-950/30 data-[state=active]:text-foreground data-[state=active]:shadow-md transition-all duration-300 rounded-lg text-xs md:text-sm font-medium flex items-center justify-center gap-1 px-2 md:px-3 hover:bg-white/50 dark:hover:bg-slate-800/50"
          >
            <span className="hidden sm:inline text-sm">📋</span>
            <span className="truncate">Overview</span>
          </TabsTrigger>
          <TabsTrigger 
            value="description" 
            className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-white data-[state=active]:to-purple-50/50 dark:data-[state=active]:from-slate-800 dark:data-[state=active]:to-purple-950/30 data-[state=active]:text-foreground data-[state=active]:shadow-md transition-all duration-300 rounded-lg text-xs md:text-sm font-medium flex items-center justify-center gap-1 px-2 md:px-3 hover:bg-white/50 dark:hover:bg-slate-800/50"
          >
            <span className="hidden sm:inline text-sm">📝</span>
            <span className="truncate">Description</span>
          </TabsTrigger>
          <TabsTrigger 
            value="resources" 
            className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-white data-[state=active]:to-purple-50/50 dark:data-[state=active]:from-slate-800 dark:data-[state=active]:to-purple-950/30 data-[state=active]:text-foreground data-[state=active]:shadow-md transition-all duration-300 rounded-lg text-xs md:text-sm font-medium flex items-center justify-center gap-1 px-2 md:px-3 hover:bg-white/50 dark:hover:bg-slate-800/50"
          >
            <span className="hidden sm:inline text-sm">🔗</span>
            <span className="truncate">Resources</span>
            {topic.projectLinks.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-gradient-to-r from-primary to-purple-600 text-primary-foreground rounded-full shadow-sm">
                {topic.projectLinks.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="subtopics" 
            disabled={!hasSubtopics && !isAdminMode}
            className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-white data-[state=active]:to-slate-50/50 dark:data-[state=active]:from-slate-800 dark:data-[state=active]:to-slate-950/30 data-[state=active]:text-foreground data-[state=active]:shadow-md transition-all duration-300 rounded-lg text-xs md:text-sm font-medium flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed px-2 md:px-3 hover:bg-white/50 dark:hover:bg-slate-800/50"
          >
            <span className="hidden sm:inline text-sm">📂</span>
            <span className="truncate">Subtopics</span>
            {hasSubtopics && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-gradient-to-r from-primary to-purple-600 text-primary-foreground rounded-full shadow-sm">
                {topic.childTopics.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="flex-1 mt-0 focus-visible:outline-none overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-4 p-1 pb-6">
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
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="description" className="flex-1 mt-0 focus-visible:outline-none overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-4 p-1 pb-6">
              <DescriptionTabContent topic={topic} />
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="resources" className="flex-1 mt-0 focus-visible:outline-none overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-4 p-1 pb-6">
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
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="subtopics" className="flex-1 mt-0 focus-visible:outline-none overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-4 p-1 pb-6">
              <SubtopicsSection
                topic={topic}
                isAdminMode={isAdminMode}
                onSubtopicClick={onSubtopicClick}
                onAddSubtopic={onAddSubtopic}
              />
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
