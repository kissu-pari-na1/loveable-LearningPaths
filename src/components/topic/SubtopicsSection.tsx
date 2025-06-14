
import React from 'react';
import { Topic } from '@/types/Topic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SubtopicsSectionProps {
  topic: Topic;
  onSubtopicClick: (subtopicId: string) => void;
}

export const SubtopicsSection: React.FC<SubtopicsSectionProps> = ({
  topic,
  onSubtopicClick
}) => {
  if (topic.childTopics.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg lg:text-xl">Subtopics</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};
