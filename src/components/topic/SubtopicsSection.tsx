
import React, { useState } from 'react';
import { Topic } from '@/types/Topic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from 'lucide-react';

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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg lg:text-xl">Subtopics</CardTitle>
          {isAdminMode && (
            <Button
              onClick={() => setShowAddForm(true)}
              size="sm"
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Subtopic
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showAddForm && (
          <div className="mb-4 p-4 border border-border rounded-lg bg-muted/20">
            <div className="space-y-3">
              <div>
                <Input
                  placeholder="Subtopic name"
                  value={newSubtopic.name}
                  onChange={(e) => setNewSubtopic(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Description (optional)"
                  value={newSubtopic.description}
                  onChange={(e) => setNewSubtopic(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full min-h-[80px] resize-none"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAddSubtopic}
                  size="sm"
                  disabled={!newSubtopic.name.trim()}
                >
                  Add Subtopic
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {topic.childTopics.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No subtopics yet.</p>
            {isAdminMode && !showAddForm && (
              <p className="text-sm mt-2">Click "Add Subtopic" to create the first one.</p>
            )}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {topic.childTopics.map((child) => (
              <div 
                key={child.id} 
                className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer group"
                onClick={() => onSubtopicClick(child.id)}
              >
                <h3 className="font-medium mb-1 break-words group-hover:text-primary transition-colors">{child.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 break-words">{child.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {child.projectLinks.length} links
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {child.childTopics.length} subtopics
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
