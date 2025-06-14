
import React from 'react';
import { Topic } from '@/types/Topic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TopicDetailHeaderProps {
  topic: Topic;
  isEditing: boolean;
  editForm: { name: string; description: string };
  isAdminMode: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onEditFormChange: (field: 'name' | 'description', value: string) => void;
}

export const TopicDetailHeader: React.FC<TopicDetailHeaderProps> = ({
  topic,
  isEditing,
  editForm,
  isAdminMode,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onEditFormChange
}) => {
  if (isEditing) {
    return (
      <div className="space-y-4">
        <Input
          value={editForm.name}
          onChange={(e) => onEditFormChange('name', e.target.value)}
          placeholder="Topic name"
          className="text-xl lg:text-2xl font-bold"
        />
        <Textarea
          value={editForm.description}
          onChange={(e) => onEditFormChange('description', e.target.value)}
          placeholder="Topic description"
          rows={3}
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={onSave} className="w-full sm:w-auto">Save</Button>
          <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto">Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-4 gap-4">
        <div className="flex-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2 break-words">{topic.name}</h1>
          <p className="text-base lg:text-lg text-muted-foreground break-words">{topic.description}</p>
        </div>
        {isAdminMode && (
          <div className="flex flex-col sm:flex-row gap-2 lg:ml-4">
            <Button variant="outline" onClick={onEdit} className="w-full sm:w-auto">Edit</Button>
            <Button 
              variant="destructive" 
              onClick={onDelete}
              disabled={topic.childTopics.length > 0}
              className="w-full sm:w-auto"
            >
              Delete
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span>{topic.projectLinks.length} project links</span>
        <span>{topic.childTopics.length} subtopics</span>
      </div>
    </div>
  );
};
