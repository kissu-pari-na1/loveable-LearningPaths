
import React from 'react';
import { Topic } from '@/types/Topic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProjectLinksSection } from '@/components/topic/ProjectLinksSection';
import { SubtopicsSection } from '@/components/topic/SubtopicsSection';
import { Card, CardContent } from '@/components/ui/card';
import { TopicDetailHeader } from '@/components/topic/TopicDetailHeader';

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

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex flex-col h-full overflow-hidden">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50 p-1 rounded-lg h-12 md:h-14 flex-shrink-0">
          <TabsTrigger 
            value="topic" 
            className="relative data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200 rounded-md text-sm md:text-base font-medium flex items-center justify-center gap-2 px-2 md:px-4"
          >
            <span className="hidden sm:inline text-base md:text-lg">📋</span>
            <span className="truncate">Topic</span>
          </TabsTrigger>
          <TabsTrigger 
            value="resources" 
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
        
        <TabsContent value="topic" className="flex-1 mt-0 focus-visible:outline-none overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-6 p-1 pb-8">
              <TopicDetailHeader
                topic={topic}
                isEditing={isEditing}
                editForm={editForm}
                isAdminMode={isAdminMode}
                onEdit={onEdit}
                onSave={onSave}
                onCancel={onCancel}
                onDelete={onDelete}
                onEditFormChange={onEditFormChange}
              />
              
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-foreground">About this topic</h3>
                      {topic.description ? (
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {topic.description}
                        </p>
                      ) : (
                        <p className="text-muted-foreground italic">
                          No description available for this topic.
                        </p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{topic.projectLinks.length}</div>
                        <div className="text-sm text-muted-foreground">Resources</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{topic.childTopics.length}</div>
                        <div className="text-sm text-muted-foreground">Subtopics</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="resources" className="flex-1 mt-0 focus-visible:outline-none overflow-hidden">
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
