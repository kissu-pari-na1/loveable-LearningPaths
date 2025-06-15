
import React, { useState } from 'react';
import { Topic } from '@/types/Topic';
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
import { Trash2 } from 'lucide-react';

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteConfirm = () => {
    onDelete();
    setShowDeleteDialog(false);
  };

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
      <div className="flex flex-col xl:flex-row xl:items-start justify-between mb-4 gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-2 break-words">{topic.name}</h1>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground break-words">{topic.description}</p>
        </div>
        {isAdminMode && (
          <div className="flex flex-col sm:flex-row gap-2 xl:ml-4 shrink-0">
            <Button variant="outline" onClick={onEdit} className="w-full sm:w-auto text-sm">Edit</Button>
            
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="w-full sm:w-auto text-sm flex items-center gap-2 bg-gradient-to-r from-red-500 via-red-600 to-purple-600 hover:from-red-600 hover:via-red-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
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
                    className="bg-gradient-to-r from-red-500 via-red-600 to-purple-600 hover:from-red-600 hover:via-red-700 hover:to-purple-700 text-white"
                  >
                    Delete Topic
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-4 text-xs md:text-sm text-muted-foreground">
        <span>{topic.projectLinks.length} project links</span>
        <span>{topic.childTopics.length} subtopics</span>
      </div>
    </div>
  );
};
