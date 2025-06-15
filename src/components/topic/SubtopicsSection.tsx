
import React, { useState } from 'react';
import { Topic } from '@/types/Topic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, FolderOpen, Link, ChevronRight, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SubtopicsSectionProps {
  topic: Topic;
  isAdminMode: boolean;
  onSubtopicClick: (subtopicId: string) => void;
  onAddSubtopic?: (newSubtopic: Omit<Topic, 'id'>, parentId: string) => void;
}

export const SubtopicsSection: React.FC<SubtopicsSectionProps> = ({
  topic,
  isAdminMode,
  onSubtopicClick,
  onAddSubtopic
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubtopic, setNewSubtopic] = useState({ name: '', description: '' });
  const isMobile = useIsMobile();

  const handleAddSubtopic = () => {
    if (newSubtopic.name.trim() && onAddSubtopic) {
      onAddSubtopic({
        name: newSubtopic.name,
        description: newSubtopic.description,
        projectLinks: [],
        childTopics: []
      }, topic.id);
      setNewSubtopic({ name: '', description: '' });
      setShowAddForm(false);
    }
  };

  const handleCancel = () => {
    setNewSubtopic({ name: '', description: '' });
    setShowAddForm(false);
  };

  return (
    <Card className="border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900/50 dark:via-slate-800/50 dark:to-blue-950/20 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-50/50 to-purple-50/30 dark:from-blue-950/20 dark:to-purple-950/10 rounded-t-lg">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <FolderOpen className="w-3 h-3 md:w-4 md:h-4 text-white" />
            </div>
            <CardTitle className="text-base md:text-lg font-bold bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent truncate">
              Subtopics
            </CardTitle>
            {topic.childTopics.length > 0 && (
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 flex-shrink-0 text-xs font-semibold">
                {topic.childTopics.length}
              </Badge>
            )}
            {topic.childTopics.length === 0 && (
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-amber-500 animate-pulse" />
            )}
          </div>
          {isAdminMode && (
            <Button
              onClick={() => setShowAddForm(true)}
              size={isMobile ? "sm" : "sm"}
              className={`bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex-shrink-0 border-0 ${
                isMobile 
                  ? 'px-2 py-1 h-7 text-xs' 
                  : 'px-3 h-8'
              }`}
            >
              <Plus className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} ${isMobile ? '' : 'mr-1'}`} />
              {!isMobile && <span className="font-semibold">Add Subtopic</span>}
              {isMobile && <span className="ml-1 hidden xs:inline font-semibold">Add</span>}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {showAddForm && (
          <div className="mb-6 p-4 md:p-5 border-2 border-dashed border-blue-300/50 dark:border-blue-700/50 rounded-xl bg-gradient-to-br from-blue-50/80 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/20 shadow-inner">
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Enter subtopic name..."
                  value={newSubtopic.name}
                  onChange={(e) => setNewSubtopic(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border-blue-200 dark:border-blue-700 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-2 text-sm bg-white/80 dark:bg-slate-800/80 shadow-sm transition-all duration-200"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Add a brief description (optional)..."
                  value={newSubtopic.description}
                  onChange={(e) => setNewSubtopic(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full min-h-[80px] resize-none border-blue-200 dark:border-blue-700 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-2 text-sm bg-white/80 dark:bg-slate-800/80 shadow-sm transition-all duration-200"
                />
              </div>
              <div className="flex flex-col xs:flex-row gap-2">
                <Button
                  onClick={handleAddSubtopic}
                  size="sm"
                  disabled={!newSubtopic.name.trim()}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 text-white text-sm flex-1 xs:flex-initial shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 border-0 font-semibold"
                >
                  <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                  Create Subtopic
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm flex-1 xs:flex-initial transition-all duration-200 hover:shadow-md"
                >
                  <X className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {topic.childTopics.length === 0 ? (
          <div className="text-center py-8 md:py-12">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full animate-pulse"></div>
              </div>
              <FolderOpen className="relative w-10 h-10 md:w-12 md:h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-sm md:text-base font-semibold mb-2 bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-300 dark:to-gray-100 bg-clip-text text-transparent">No subtopics yet</p>
            {isAdminMode && !showAddForm && (
              <p className="text-xs md:text-sm px-4 text-gray-500 dark:text-gray-400">Create your first subtopic to organize this topic better.</p>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {topic.childTopics.map((child, index) => (
              <Card 
                key={child.id} 
                className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30 dark:from-gray-900/80 dark:via-gray-800/50 dark:to-blue-950/20 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-purple-50/30 dark:hover:from-blue-950/30 dark:hover:to-purple-950/20 shadow-md backdrop-blur-sm"
                onClick={() => onSubtopicClick(child.id)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-gray-100 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 line-clamp-2 leading-tight">
                      {child.name}
                    </h3>
                    <div className="flex-shrink-0 ml-3">
                      <div className="p-1.5 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 group-hover:from-blue-200 group-hover:to-purple-200 dark:group-hover:from-blue-800/60 dark:group-hover:to-purple-800/60 transition-all duration-300 group-hover:scale-110">
                        <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
                      </div>
                    </div>
                  </div>
                  
                  {child.description && (
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                      {child.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gradient-to-r from-emerald-400 to-green-500 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200 px-2 py-1 text-xs font-semibold">
                      <Link className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1" />
                      {child.projectLinks.length}
                    </Badge>
                    <Badge className="bg-gradient-to-r from-purple-400 to-pink-500 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200 px-2 py-1 text-xs font-semibold">
                      <FolderOpen className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1" />
                      {child.childTopics.length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
