
import React from 'react';
import { Topic } from '@/types/Topic';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, Sparkles } from 'lucide-react';

interface QuickStatsCardProps {
  topic: Topic;
  onTabChange?: (tab: string) => void;
}

export const QuickStatsCard: React.FC<QuickStatsCardProps> = ({ topic, onTabChange }) => {
  const handleResourcesClick = () => {
    if (onTabChange) {
      onTabChange('resources');
    }
  };

  const handleSubtopicsClick = () => {
    if (onTabChange) {
      onTabChange('subtopics');
    }
  };

  return (
    <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700">
            <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">Quick Stats</h3>
          <Sparkles className="w-4 h-4 text-amber-500" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleResourcesClick}
            className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600 shadow-sm hover:shadow-md hover:bg-gray-100 dark:hover:bg-slate-600 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
          >
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-300 mb-1">
              {topic.projectLinks.length}
            </div>
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Resources</div>
          </button>
          <button
            onClick={handleSubtopicsClick}
            className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600 shadow-sm hover:shadow-md hover:bg-gray-100 dark:hover:bg-slate-600 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
          >
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-300 mb-1">
              {topic.childTopics.length}
            </div>
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Subtopics</div>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
