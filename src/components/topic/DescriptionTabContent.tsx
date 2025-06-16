
import React from 'react';
import { Topic } from '@/types/Topic';
import { Card, CardContent } from '@/components/ui/card';
import { FolderOpen } from 'lucide-react';

interface DescriptionTabContentProps {
  topic: Topic;
}

export const DescriptionTabContent: React.FC<DescriptionTabContentProps> = ({ topic }) => {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600">
      <CardContent className="p-5">
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30">
              <FolderOpen className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-primary">About {topic.name}</h3>
          </div>
          {topic.description ? (
            <p className="text-sm text-gray-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
              {topic.description}
            </p>
          ) : (
            <p className="text-sm text-gray-500 dark:text-slate-400 italic">
              No description available for this topic.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
