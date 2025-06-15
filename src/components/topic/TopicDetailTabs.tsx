
import React from 'react';
import { Topic } from '@/types/Topic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProjectLinksSection } from '@/components/topic/ProjectLinksSection';
import { SubtopicsSection } from '@/components/topic/SubtopicsSection';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2, Edit3, BarChart3, FolderOpen, ChevronRight } from 'lucide-react';

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

  const handleDeleteConfirm = () => {
    onDelete();
  };

  const handleReadMoreClick = () => {
    onTabChange('description');
  };

  // Helper function to truncate description
  const getDescriptionPreview = (text: string, maxLength: number = 120) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const OverviewEditingView = () => (
    <div className="space-y-4">
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-4">
          <div className="space-y-3">
            <Input
              value={editForm.name}
              onChange={(e) => onEditFormChange('name', e.target.value)}
              placeholder="Topic name"
              className="text-lg font-semibold border-2 border-primary/30 focus:border-primary"
            />
            <Textarea
              value={editForm.description}
              onChange={(e) => onEditFormChange('description', e.target.value)}
              placeholder="Topic description"
              rows={3}
              className="border-2 border-primary/30 focus:border-primary text-sm"
            />
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button onClick={onSave} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-sm">
                Save Changes
              </Button>
              <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto text-sm">
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const OverviewDisplayView = () => (
    <div className="space-y-4">
      {/* Admin Actions - Moved to top for better accessibility */}
      {isAdminMode && (
        <Card className="border-orange-200 dark:border-orange-800 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Edit3 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <h3 className="text-sm font-semibold text-orange-900 dark:text-orange-100">Topic Management</h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                onClick={onEdit} 
                size="sm"
                className="w-full sm:w-auto border-orange-300 hover:bg-orange-100 dark:border-orange-700 dark:hover:bg-orange-900/30 text-sm"
              >
                <Edit3 className="w-3 h-3 mr-1" />
                Edit Topic
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="w-full sm:w-auto text-sm"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete Topic
                    {topic.childTopics.length > 0 && (
                      <span className="ml-1 text-xs opacity-75">
                        (+ {topic.childTopics.length} subtopics)
                      </span>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this topic?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the topic "{topic.name}"
                      {topic.childTopics.length > 0 && ` and all ${topic.childTopics.length} subtopic${topic.childTopics.length !== 1 ? 's' : ''}`}
                      {topic.projectLinks.length > 0 && ` along with ${topic.projectLinks.length} resource${topic.projectLinks.length !== 1 ? 's' : ''}`}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteConfirm}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete Topic
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Topic Header Card */}
      <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-4">
          <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg md:text-xl font-bold text-foreground mb-2 break-words leading-tight">
                {topic.name}
              </h1>
              {topic.description && (
                <div className="mb-3">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                    {getDescriptionPreview(topic.description)}
                  </p>
                  {topic.description.length > 120 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleReadMoreClick}
                      className="h-auto p-0 text-primary hover:text-primary/80 text-sm font-medium"
                    >
                      Read more <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">Quick Stats</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white/50 dark:bg-white/5 rounded-lg border border-blue-100 dark:border-blue-800">
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {topic.projectLinks.length}
              </div>
              <div className="text-xs font-medium text-blue-700 dark:text-blue-300">Resources</div>
            </div>
            <div className="text-center p-3 bg-white/50 dark:bg-white/5 rounded-lg border border-blue-100 dark:border-blue-800">
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {topic.childTopics.length}
              </div>
              <div className="text-xs font-medium text-blue-700 dark:text-blue-300">Subtopics</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex flex-col h-full overflow-hidden">
        <TabsList className="grid w-full grid-cols-4 mb-4 bg-muted/50 p-1 rounded-lg h-11 md:h-12 flex-shrink-0">
          <TabsTrigger 
            value="overview" 
            className="relative data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200 rounded-md text-xs md:text-sm font-medium flex items-center justify-center gap-1 px-2 md:px-3"
          >
            <span className="hidden sm:inline text-sm">📋</span>
            <span className="truncate">Overview</span>
          </TabsTrigger>
          <TabsTrigger 
            value="description" 
            className="relative data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200 rounded-md text-xs md:text-sm font-medium flex items-center justify-center gap-1 px-2 md:px-3"
          >
            <span className="hidden sm:inline text-sm">📝</span>
            <span className="truncate">Description</span>
          </TabsTrigger>
          <TabsTrigger 
            value="resources" 
            className="relative data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200 rounded-md text-xs md:text-sm font-medium flex items-center justify-center gap-1 px-2 md:px-3"
          >
            <span className="hidden sm:inline text-sm">🔗</span>
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
            className="relative data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200 rounded-md text-xs md:text-sm font-medium flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed px-2 md:px-3"
          >
            <span className="hidden sm:inline text-sm">📂</span>
            <span className="truncate">Subtopics</span>
            {hasSubtopics && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                {topic.childTopics.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="flex-1 mt-0 focus-visible:outline-none overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-4 p-1 pb-6">
              {isEditing ? <OverviewEditingView /> : <OverviewDisplayView />}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="description" className="flex-1 mt-0 focus-visible:outline-none overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-4 p-1 pb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <FolderOpen className="w-4 h-4 text-primary" />
                      <h3 className="text-sm font-semibold text-foreground">About {topic.name}</h3>
                    </div>
                    {topic.description ? (
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {topic.description}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No description available for this topic.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
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
