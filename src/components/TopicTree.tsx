
import React from 'react';
import { Topic, SearchResult } from '@/types/Topic';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TopicTreeProps {
  topics: Topic[] | SearchResult[];
  selectedTopicId: string | null;
  onTopicSelect: (id: string) => void;
  isAdminMode: boolean;
  searchQuery: string;
}

export const TopicTree: React.FC<TopicTreeProps> = ({
  topics,
  selectedTopicId,
  onTopicSelect,
  isAdminMode,
  searchQuery
}) => {
  const isSearchResult = (topic: Topic): topic is SearchResult => {
    return 'similarity' in topic;
  };

  const renderTopic = (topic: Topic | SearchResult, level: number = 0) => {
    const isSelected = topic.id === selectedTopicId;
    const isSearch = searchQuery.trim() !== '';
    
    return (
      <div key={topic.id} className="mb-2">
        <Button
          variant={isSelected ? "default" : "ghost"}
          className={`w-full justify-start text-left h-auto p-3 ${
            isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50'
          }`}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
          onClick={() => onTopicSelect(topic.id)}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium truncate">{topic.name}</span>
              {isSearchResult(topic) && topic.similarity && (
                <Badge variant="secondary" className="text-xs">
                  {Math.round(topic.similarity * 100)}%
                </Badge>
              )}
              {topic.childTopics.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {topic.childTopics.length}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {topic.description}
            </p>
            {topic.projectLinks.length > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <svg className="w-3 h-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="text-xs text-muted-foreground">
                  {topic.projectLinks.length} link{topic.projectLinks.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
            {isSearchResult(topic) && topic.matchedIn && (
              <Badge variant="outline" className="text-xs mt-1">
                Matched in {topic.matchedIn}
              </Badge>
            )}
          </div>
        </Button>
        
        {!isSearch && topic.childTopics.length > 0 && (
          <div className="ml-2">
            {topic.childTopics.map(child => renderTopic(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (topics.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        {searchQuery ? 'No topics found matching your search.' : 'No topics available.'}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {topics.map(topic => renderTopic(topic, 0))}
    </div>
  );
};
