import React from 'react';
import { Topic } from '@/types/Topic';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProjectLinksSection } from '@/components/topic/ProjectLinksSection';
import { SubtopicsSection } from '@/components/topic/SubtopicsSection';
import { OverviewEditingView } from '@/components/topic/OverviewEditingView';
import { OverviewDisplayView } from '@/components/topic/OverviewDisplayView';
import { DescriptionTabContent } from '@/components/topic/DescriptionTabContent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileText, BookOpen, Link, Folder, ArrowUp } from 'lucide-react';

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
  onParentTopicClick?: (parentId: string) => void;
  allTopics: Topic[];
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
  onEditFormChange,
  onParentTopicClick,
  allTopics
}) => {
  const hasSubtopics = topic.childTopics.length > 0;

  const handleReadMoreClick = () => {
    onTabChange('description');
  };

  // Find parent topic with proper error handling
  const findParentTopic = (topics: Topic[], targetTopic: Topic): Topic | null => {
    // Add defensive checks
    if (!topics || !Array.isArray(topics) || !targetTopic) {
      return null;
    }
    
    try {
      for (const t of topics) {
        if (t.childTopics && Array.isArray(t.childTopics) && t.childTopics.some(child => child.id === targetTopic.id)) {
          return t;
        }
        if (t.childTopics && Array.isArray(t.childTopics)) {
          const found = findParentTopic(t.childTopics, targetTopic);
          if (found) return found;
        }
      }
    } catch (error) {
      console.error('Error finding parent topic:', error);
      return null;
    }
    
    return null;
  };

  const parentTopic = findParentTopic(allTopics || [], topic);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex flex-col h-full">
        {/* Tab Header with Parent Button */}
        <div className="flex-shrink-0 sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <TabsList className="h-11 bg-gray-50 dark:bg-slate-800 p-1 rounded-lg flex-1 lg:flex-initial gap-2">
              <TabsTrigger 
                value="overview" 
                className="flex items-center gap-3 px-5 py-2 rounded-md font-medium text-sm transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="description" 
                className="flex items-center gap-3 px-5 py-2 rounded-md font-medium text-sm transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Description</span>
              </TabsTrigger>
              <TabsTrigger 
                value="resources" 
                className="flex items-center gap-3 px-5 py-2 rounded-md font-medium text-sm transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50"
              >
                <Link className="w-4 h-4" />
                <span className="hidden sm:inline">Resources</span>
                {topic.projectLinks.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs bg-primary text-white rounded-full font-medium">
                    {topic.projectLinks.length}
                  </span>
                )}
              </TabsTrigger>
              {(hasSubtopics || isAdminMode) && (
                <TabsTrigger 
                  value="subtopics" 
                  className="flex items-center gap-3 px-5 py-2 rounded-md font-medium text-sm transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50"
                >
                  <Folder className="w-4 h-4" />
                  <span className="hidden sm:inline">Subtopics</span>
                  {hasSubtopics && (
                    <span className="ml-1 px-2 py-0.5 text-xs bg-primary text-white rounded-full font-medium">
                      {topic.childTopics.length}
                    </span>
                  )}
                </TabsTrigger>
              )}
            </TabsList>
            
            {/* Parent Topic Button with improved responsive design */}
            {parentTopic && onParentTopicClick && (
              <div className="flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onParentTopicClick(parentTopic.id)}
                  className="flex items-center gap-2 h-11 px-4 bg-white/80 dark:bg-slate-800/80 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 min-w-[44px]"
                >
                  <ArrowUp className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden md:inline font-medium whitespace-nowrap">Parent</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Clean Tab Content */}
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
