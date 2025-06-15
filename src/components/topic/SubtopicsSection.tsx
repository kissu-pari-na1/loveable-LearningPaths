
import React, { useState } from 'react';
import { Topic } from '@/types/Topic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, FolderOpen, Link, ChevronRight } from 'lucide-react';
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
    <Card className="border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <FolderOpen className="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <CardTitle className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
              Subtopics
            </CardTitle>
            {topic.childTopics.length > 0 && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800 text-xs flex-shrink-0">
                {topic.childTopics.length}
              </Badge>
            )}
          </div>
          {isAdminMode && (
            <Button
              onClick={() => setShowAddForm(true)}
              size={isMobile ? "sm" : "sm"}
              className={`bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex-shrink-0 ${
                isMobile 
                  ? 'px-2 py-1 h-8 text-xs' 
                  : 'px-3 h-9'
              }`}
            >
              <Plus className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} ${isMobile ? '' : 'mr-1'}`} />
              {!isMobile && <span>Add Subtopic</span>}
              {isMobile && <span className="ml-1 hidden xs:inline">Add</span>}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {showAddForm && (
          <div className="mb-6 p-3 md:p-4 border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
            <div className="space-y-3">
              <div>
                <Input
                  placeholder="Enter subtopic name..."
                  value={newSubtopic.name}
                  onChange={(e) => setNewSubtopic(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Add a brief description (optional)..."
                  value={newSubtopic.description}
                  onChange={(e) => setNewSubtopic(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full min-h-[80px] resize-none border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="flex flex-col xs:flex-row gap-2">
                <Button
                  onClick={handleAddSubtopic}
                  size="sm"
                  disabled={!newSubtopic.name.trim()}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-sm flex-1 xs:flex-initial"
                >
                  <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                  Create Subtopic
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 hover:bg-gray-50 text-sm flex-1 xs:flex-initial"
                >
                  <X className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {topic.childTopics.length === 0 ? (
          <div className="text-center py-8 md:py-12 text-muted-foreground">
            <FolderOpen className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-sm md:text-base font-medium mb-1">No subtopics yet</p>
            {isAdminMode && !showAddForm && (
              <p className="text-xs md:text-sm px-4">Create your first subtopic to organize this topic better.</p>
            )}
          </div>
        ) : (
          <div className="grid gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {topic.childTopics.map((child) => (
              <Card 
                key={child.id} 
                className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 hover:border-blue-300 dark:hover:border-blue-600"
                onClick={() => onSubtopicClick(child.id)}
              >
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-start justify-between mb-2 md:mb-3">
                    <h3 className="font-semibold text-xs md:text-sm text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
                      {child.name}
                    </h3>
                    <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 ml-2" />
                  </div>
                  
                  {child.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2 md:mb-3 leading-relaxed">
                      {child.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <Badge 
                      variant="outline" 
                      className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800 px-1.5 py-0.5"
                    >
                      <Link className="w-2.5 h-2.5 md:w-3 md:h-3 mr-0.5 md:mr-1" />
                      {child.projectLinks.length}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="text-xs bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800 px-1.5 py-0.5"
                    >
                      <FolderOpen className="w-2.5 h-2.5 md:w-3 md:h-3 mr-0.5 md:mr-1" />
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
