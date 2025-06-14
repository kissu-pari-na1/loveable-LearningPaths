
import React from 'react';
import { Topic } from '@/types/Topic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectLinksSection } from '@/components/topic/ProjectLinksSection';
import { SubtopicsSection } from '@/components/topic/SubtopicsSection';

interface NewLinkData {
  title: string;
  url: string;
  description: string;
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
  onNewLinkChange: (field: keyof NewLinkData, value: string) => void;
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
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <span>🔗</span>
          <span>Project Links</span>
        </div>
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
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50 p-1 rounded-lg h-12">
        <TabsTrigger 
          value="links" 
          className="relative data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200 rounded-md text-sm font-medium flex items-center justify-center gap-2"
        >
          <span className="hidden sm:inline">🔗</span>
          Project Links
          {topic.projectLinks.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
              {topic.projectLinks.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger 
          value="subtopics" 
          disabled={!hasSubtopics && !isAdminMode}
          className="relative data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200 rounded-md text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="hidden sm:inline">📂</span>
          Subtopics
          {hasSubtopics && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
              {topic.childTopics.length}
            </span>
          )}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="links" className="mt-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg">
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
      
      <TabsContent value="subtopics" className="mt-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg">
        <SubtopicsSection
          topic={topic}
          isAdminMode={isAdminMode}
          onSubtopicClick={onSubtopicClick}
          onAddSubtopic={onAddSubtopic}
        />
      </TabsContent>
    </Tabs>
  );
};
