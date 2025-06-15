
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
import { Trash2, Edit3, BarChart3, FolderOpen, ChevronRight, Sparkles, Star } from 'lucide-react';

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
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-white to-purple-50/30 dark:from-primary/10 dark:via-slate-800 dark:to-purple-950/20 shadow-lg">
        <CardContent className="p-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Edit3 className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-medium bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Edit Topic</h3>
            </div>
            <Input
              value={editForm.name}
              onChange={(e) => onEditFormChange('name', e.target.value)}
              placeholder="Topic name"
              className="text-lg font-medium border-2 border-primary/30 focus:border-primary focus:ring-primary/20 bg-white/80 dark:bg-slate-800/80 shadow-sm"
            />
            <Textarea
              value={editForm.description}
              onChange={(e) => onEditFormChange('description', e.target.value)}
              placeholder="Topic description"
              rows={3}
              className="border-2 border-primary/30 focus:border-primary focus:ring-primary/20 text-sm bg-white/80 dark:bg-slate-800/80 shadow-sm"
            />
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button onClick={onSave} className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                Save Changes
              </Button>
              <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const OverviewDisplayView = () => (
    <div className="space-y-5">
      {/* Admin Actions */}
      {isAdminMode && (
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-white to-primary/5 dark:from-primary/10 dark:via-slate-800 dark:to-primary/10 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-purple-600 shadow-md">
                <Edit3 className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-medium bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Topic Management</h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                onClick={onEdit} 
                size="sm"
                className="w-full sm:w-auto border-primary/30 hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-50/50 dark:border-primary/40 dark:hover:bg-primary/20 text-sm font-medium transition-all duration-200 hover:shadow-md"
              >
                <Edit3 className="w-3 h-3 mr-1" />
                Edit Topic
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="w-full sm:w-auto text-sm bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
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
                <AlertDialogContent className="bg-gradient-to-br from-white to-red-50/30 dark:from-slate-900 dark:to-red-950/20">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-700 dark:text-red-300">Are you sure you want to delete this topic?</AlertDialogTitle>
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
                      className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white"
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
      <Card className="border-l-4 border-l-primary bg-gradient-to-br from-primary/5 via-white to-blue-50/30 dark:from-primary/10 dark:via-slate-800 dark:to-blue-950/20 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-amber-500" />
                <h1 className="text-xl md:text-2xl font-medium bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent break-words leading-tight">
                  {topic.name}
                </h1>
              </div>
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
                      className="h-auto p-0 text-primary hover:text-primary/80 text-sm font-medium hover:bg-primary/5 transition-all duration-200"
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
      <Card className="bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/10 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-md">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-medium bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent">Quick Stats</h3>
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-white/80 to-blue-50/50 dark:from-white/5 dark:to-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-800 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="text-2xl font-medium bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-1">
                {topic.projectLinks.length}
              </div>
              <div className="text-xs font-medium text-blue-700 dark:text-blue-300">Resources</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-white/80 to-purple-50/50 dark:from-white/5 dark:to-purple-950/20 rounded-xl border border-purple-100 dark:border-purple-800 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="text-2xl font-medium bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-1">
                {topic.childTopics.length}
              </div>
              <div className="text-xs font-medium text-purple-700 dark:text-purple-300">Subtopics</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

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
            className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-white data-[state=active]:to-green-50/50 dark:data-[state=active]:from-slate-800 dark:data-[state=active]:to-green-950/30 data-[state=active]:text-foreground data-[state=active]:shadow-md transition-all duration-300 rounded-lg text-xs md:text-sm font-medium flex items-center justify-center gap-1 px-2 md:px-3 hover:bg-white/50 dark:hover:bg-slate-800/50"
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
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-gray-500 dark:bg-gray-400 text-white rounded-full shadow-sm">
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
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-gray-500 dark:bg-gray-400 text-white rounded-full shadow-sm">
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
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-green-50/30 dark:from-slate-900 dark:to-green-950/20">
                <CardContent className="p-5">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-md">
                        <FolderOpen className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-sm font-medium bg-gradient-to-r from-green-700 to-emerald-700 dark:from-green-300 dark:to-emerald-300 bg-clip-text text-transparent">About {topic.name}</h3>
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
