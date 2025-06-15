
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
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg font-semibold">Subtopics</CardTitle>
            {topic.childTopics.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {topic.childTopics.length}
              </Badge>
            )}
          </div>
          {isAdminMode && (
            <Button
              onClick={() => setShowAddForm(true)}
              size={isMobile ? "sm" : "default"}
              className="shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <Plus className="h-4 w-4 mr-1" />
              {isMobile ? "Add" : "Add Subtopic"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showAddForm && (
          <div className="mb-6 p-4 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/30">
            <div className="space-y-3">
              <Input
                placeholder="Enter subtopic name..."
                value={newSubtopic.name}
                onChange={(e) => setNewSubtopic(prev => ({ ...prev, name: e.target.value }))}
                className="shadow-sm"
              />
              <Textarea
                placeholder="Add a brief description (optional)..."
                value={newSubtopic.description}
                onChange={(e) => setNewSubtopic(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-[80px] resize-none shadow-sm"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleAddSubtopic}
                  size="sm"
                  disabled={!newSubtopic.name.trim()}
                  className="shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  className="shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {topic.childTopics.length === 0 ? (
          <div className="text-center py-8">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">No subtopics yet</p>
            {isAdminMode && !showAddForm && (
              <p className="text-sm text-muted-foreground/70 mt-1">
                Create your first subtopic to organize this topic better.
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {topic.childTopics.map((child) => (
              <Card 
                key={child.id} 
                className="cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border-muted-foreground/20 hover:border-primary/50"
                onClick={() => onSubtopicClick(child.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm line-clamp-2 flex-1">
                      {child.name}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
                  </div>
                  
                  {child.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {child.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Link className="w-3 h-3 mr-1" />
                      {child.projectLinks.length}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <FolderOpen className="w-3 h-3 mr-1" />
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
