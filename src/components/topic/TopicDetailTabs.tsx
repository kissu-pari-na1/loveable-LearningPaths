
import React from 'react';
import { Topic } from '@/types/Topic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProjectLinksSection } from '@/components/topic/ProjectLinksSection';
import { SubtopicsSection } from '@/components/topic/SubtopicsSection';

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
  onAddSubtopic
}) => {
  const hasSubtopics = topic.childTopics.length > 0;
  const hasLinks = topic.projectLinks.length > 0 || isAdminMode;

  if (!hasSubtopics && !hasLinks) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4 flex-shrink-0">
          <span>🔗</span>
          <span>Resources</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-4 p-1 pb-8">
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
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex flex-col h-full overflow-hidden">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50 p-1 rounded-lg h-12 md:h-14 flex-shrink-0">
          <TabsTrigger 
            value="links" 
            className="relative data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200 rounded-md text-sm md:text-base font-medium flex items-center justify-center gap-2 px-2 md:px-4"
          >
            <span className="hidden sm:inline text-base md:text-lg">🔗</span>
            <span className="truncate">Resources</span>
            {topic.projectLinks.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                {topic.projectLinks.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="subtopics" 
            disabled={!hasSubtopics && !isAdminMode}
            className="relative data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200 rounded-md text-sm md:text-base font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed px-2 md:px-4"
          >
            <span className="hidden sm:inline text-base md:text-lg">📂</span>
            <span className="truncate">Subtopics</span>
            {hasSubtopics && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                {topic.childTopics.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="links" className="flex-1 mt-0 focus-visible:outline-none overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-4 p-1 pb-8">
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
            <div className="space-y-4 p-1 pb-8">
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
