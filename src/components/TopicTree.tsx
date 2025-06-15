import React from 'react';
import { Topic, SearchResult } from '@/types/Topic';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen } from 'lucide-react';

interface TopicTreeProps {
  topics: Topic[] | SearchResult[];
  selectedTopicId: string | null;
  onTopicSelect: (id: string) => void;
  isLoading?: boolean;
  expandedTopics: Set<string>;
  onToggleExpanded: (topicId: string) => void;
}

export const TopicTree: React.FC<TopicTreeProps> = ({
  topics,
  selectedTopicId,
  onTopicSelect,
  isLoading = false,
  expandedTopics,
  onToggleExpanded
}) => {
  // Function to find the path to a topic (returns array of parent topic IDs)
  const findPathToTopic = (topics: Topic[], targetId: string, currentPath: string[] = []): string[] | null => {
    for (const topic of topics) {
      const newPath = [...currentPath, topic.id];
      
      if (topic.id === targetId) {
        return newPath;
      }
      
      if (topic.childTopics.length > 0) {
        const result = findPathToTopic(topic.childTopics, targetId, newPath);
        if (result) {
          return result;
        }
      }
    }
    return null;
  };

  // Auto-expand parents when a topic is selected (preserve existing expanded states)
  React.useEffect(() => {
    if (selectedTopicId) {
      const path = findPathToTopic(topics as Topic[], selectedTopicId);
      if (path) {
        // Expand all parent topics (excluding the selected topic itself)
        const parentsToExpand = path.slice(0, -1);
        parentsToExpand.forEach(parentId => {
          if (!expandedTopics.has(parentId)) {
            onToggleExpanded(parentId);
          }
        });
      }
    }
  }, [selectedTopicId, topics, expandedTopics, onToggleExpanded]);

  const isSearchResult = (topic: Topic): topic is SearchResult => {
    return 'similarity' in topic;
  };

  const renderTopic = (topic: Topic | SearchResult, level: number = 0, isLast: boolean = false, parentLines: boolean[] = []) => {
    const isSelected = topic.id === selectedTopicId;
    const hasChildren = topic.childTopics.length > 0;
    const isExpanded = expandedTopics.has(topic.id);
    
    return (
      <div key={topic.id} className="relative">
        {/* Tree lines */}
        {level > 0 && (
          <div className="absolute left-0 top-0 h-full flex">
            {parentLines.map((hasLine, index) => (
              <div key={index} className="w-6 flex justify-center">
                {hasLine && (
                  <div className="w-px bg-gradient-to-b from-violet-300/40 to-blue-300/40 h-full" />
                )}
              </div>
            ))}
            <div className="w-6 flex justify-center relative">
              <div className="w-px bg-gradient-to-b from-violet-300/40 to-blue-300/40 h-6" />
              <div className="absolute top-6 left-3 w-3 h-px bg-gradient-to-r from-violet-300/40 to-blue-300/40" />
              {!isLast && (
                <div className="w-px bg-gradient-to-b from-violet-300/40 to-blue-300/40 h-full top-6 absolute" />
              )}
            </div>
          </div>
        )}
        
        <div 
          className={`mb-1 ${level > 0 ? 'ml-6' : ''}`}
          style={{ paddingLeft: level > 0 ? `${level * 24}px` : '0' }}
        >
          <div className={`relative group rounded-xl transition-all duration-300 ${
            isSelected 
              ? 'bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-blue-500/20 shadow-lg border border-violet-300/30 border-l-4 border-l-violet-500' 
              : 'hover:bg-muted/50 hover:border-l-4 hover:border-l-primary border border-transparent'
          }`}>
            
            <Button
              variant="ghost"
              className={`w-full justify-start text-left h-auto p-4 transition-all duration-300 relative z-10 border-none hover:bg-transparent ${
                isSelected 
                  ? 'text-violet-700 dark:text-violet-300 font-medium' 
                  : 'hover:text-foreground'
              }`}
              onClick={() => onTopicSelect(topic.id)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Expand/Collapse button for topics with children */}
                {hasChildren && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleExpanded(topic.id);
                    }}
                    className={`flex-shrink-0 p-1 rounded-md transition-all duration-200 ${
                      isSelected ? 'hover:bg-violet-200/50' : 'hover:bg-muted'
                    }`}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                )}
                
                {/* Topic icon */}
                <div className={`flex-shrink-0 p-2 rounded-lg transition-all duration-200 ${
                  isSelected 
                    ? 'bg-gradient-to-br from-violet-400/20 to-blue-400/20' 
                    : 'bg-muted/50 group-hover:bg-muted'
                }`}>
                  {hasChildren ? (
                    isExpanded ? (
                      <FolderOpen className="w-5 h-5 text-primary" />
                    ) : (
                      <Folder className="w-5 h-5 text-primary" />
                    )
                  ) : (
                    <FileText className="w-5 h-5 text-primary" />
                  )}
                </div>
                
                {/* Topic content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`font-medium truncate ${
                      isSelected ? 'text-violet-800 dark:text-violet-200' : ''
                    }`}>
                      {topic.name}
                    </span>
                    {isSearchResult(topic) && topic.similarity && (
                      <Badge 
                        variant="outline" 
                        className={`text-xs shrink-0 ${
                          isSelected ? 'border-violet-300/50 bg-violet-100/50 text-violet-700' : 'border-primary/30 bg-primary/10 text-primary'
                        }`}
                      >
                        {Math.round(topic.similarity * 100)}%
                      </Badge>
                    )}
                    {topic.childTopics.length > 0 && (
                      <Badge 
                        variant="outline" 
                        className={`text-xs shrink-0 ${
                          isSelected ? 'border-blue-300/50 bg-blue-100/50 text-blue-700' : 'border-primary/30 bg-primary/10 text-primary'
                        }`}
                      >
                        {topic.childTopics.length}
                      </Badge>
                    )}
                  </div>
                  {topic.description && (
                    <p className={`text-sm line-clamp-2 mb-1 ${
                      isSelected ? 'text-violet-600/80 dark:text-violet-300/80' : 'text-muted-foreground'
                    }`}>
                      {topic.description}
                    </p>
                  )}
                  {topic.projectLinks.length > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <svg 
                        className={`w-3 h-3 shrink-0 ${
                          isSelected ? 'text-violet-500/60' : 'text-muted-foreground'
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span className={`text-xs ${
                        isSelected ? 'text-violet-600/80' : 'text-muted-foreground'
                      }`}>
                        {topic.projectLinks.length} link{topic.projectLinks.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                  {isSearchResult(topic) && topic.matchedIn && (
                    <Badge 
                      variant="outline" 
                      className={`text-xs mt-1 ${
                        isSelected ? 'border-purple-300/50 bg-purple-100/50 text-purple-700' : 'border-primary/30 bg-primary/10 text-primary'
                      }`}
                    >
                      Matched in {topic.matchedIn}
                    </Badge>
                  )}
                </div>
              </div>
            </Button>
          </div>
        </div>
        
        {/* Render children */}
        {hasChildren && isExpanded && (
          <div className="ml-3">
            {topic.childTopics.map((child, index) => {
              const isLastChild = index === topic.childTopics.length - 1;
              const newParentLines = [...parentLines, !isLastChild];
              return renderTopic(child, level + 1, isLastChild, newParentLines);
            })}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <p className="text-lg font-medium">Searching...</p>
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-100 to-blue-100 flex items-center justify-center">
          <FileText className="w-12 h-12 text-violet-400" />
        </div>
        <p className="text-lg font-medium mb-2">No topics found</p>
        <p className="text-sm">Try adjusting your search terms or create your first topic.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-2">
      {/* Tree container with subtle background */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 via-transparent to-blue-50/30 rounded-2xl" />
        <div className="relative z-10 space-y-1 p-2">
          {topics.map((topic, index) => {
            const isLast = index === topics.length - 1;
            return renderTopic(topic, 0, isLast, []);
          })}
        </div>
      </div>
    </div>
  );
};
