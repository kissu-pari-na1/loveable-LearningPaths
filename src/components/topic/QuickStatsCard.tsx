
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
    <Card className="bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/10 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-md">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-sm font-medium bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent">Quick Stats</h3>
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleResourcesClick}
            className="text-center p-4 bg-gradient-to-br from-white/80 to-blue-50/50 dark:from-white/5 dark:to-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-800 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
          >
            <div className="text-2xl font-medium bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-1">
              {topic.projectLinks.length}
            </div>
            <div className="text-xs font-medium text-blue-700 dark:text-blue-300">Resources</div>
          </button>
          <button
            onClick={handleSubtopicsClick}
            className="text-center p-4 bg-gradient-to-br from-white/80 to-purple-50/50 dark:from-white/5 dark:to-purple-950/20 rounded-xl border border-purple-100 dark:border-purple-800 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
          >
            <div className="text-2xl font-medium bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-1">
              {topic.childTopics.length}
            </div>
            <div className="text-xs font-medium text-purple-700 dark:text-purple-300">Subtopics</div>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
