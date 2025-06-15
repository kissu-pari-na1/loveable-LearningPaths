
import React from 'react';
import { Topic } from '@/types/Topic';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ChevronRight } from 'lucide-react';

interface TopicHeaderCardProps {
  topic: Topic;
  onReadMoreClick: () => void;
}

export const TopicHeaderCard: React.FC<TopicHeaderCardProps> = ({
  topic,
  onReadMoreClick
}) => {
  // Helper function to truncate description
  const getDescriptionPreview = (text: string, maxLength: number = 120) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <Card className="border-l-4 border-l-primary bg-gradient-to-br from-primary/5 via-white to-blue-50/30 dark:from-primary/10 dark:via-slate-800 dark:to-blue-950/20 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-amber-500" />
              <h1 className="text-xl md:text-2xl font-medium bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent break-words leading-tight">
                {topic.name}
              </h1>
            </div>
            {topic.description && (
              <div className="mb-3">
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                  {getDescriptionPreview(topic.description)}
                </p>
                {topic.description.length > 120 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onReadMoreClick}
                    className="h-auto p-0 text-primary hover:text-primary/80 text-sm font-medium hover:bg-primary/5 transition-all duration-200"
                  >
                    Read more <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
