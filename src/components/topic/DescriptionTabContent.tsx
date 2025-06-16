
import React from 'react';
import { Topic } from '@/types/Topic';
import { Card, CardContent } from '@/components/ui/card';
import { FolderOpen } from 'lucide-react';

interface DescriptionTabContentProps {
  topic: Topic;
}

export const DescriptionTabContent: React.FC<DescriptionTabContentProps> = ({ topic }) => {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50/30 dark:bg-slate-800 dark:border-slate-600">
      <CardContent className="p-5">
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-purple-600 shadow-md">
              <FolderOpen className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-medium bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-purple-400 bg-clip-text text-transparent">About {topic.name}</h3>
          </div>
          {topic.description ? (
            <p className="text-sm text-muted-foreground dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {topic.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground dark:text-slate-400 italic">
              No description available for this topic.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
