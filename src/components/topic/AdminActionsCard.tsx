
import React from 'react';
import { Topic } from '@/types/Topic';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Trash2, Edit3 } from 'lucide-react';

interface AdminActionsCardProps {
  topic: Topic;
  onEdit: () => void;
  onDelete: () => void;
}

export const AdminActionsCard: React.FC<AdminActionsCardProps> = ({
  topic,
  onEdit,
  onDelete
}) => {
  const handleDeleteConfirm = () => {
    onDelete();
  };

  return (
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
                className="w-full sm:w-auto text-sm bg-gradient-to-r from-primary via-purple-600 to-red-500 hover:from-primary/90 hover:via-purple-700 hover:to-red-600 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
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
                  className="bg-gradient-to-r from-primary via-purple-600 to-red-500 hover:from-primary/90 hover:via-purple-700 hover:to-red-600 text-white"
                >
                  Delete Topic
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};
