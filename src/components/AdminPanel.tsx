
import React, { useState } from 'react';
import { Topic } from '@/types/Topic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Move, Settings } from 'lucide-react';

interface AdminPanelProps {
  topics: Topic[];
  onAddTopic: (topic: Omit<Topic, 'id'>, parentId?: string) => void;
  onMoveTopic: (topicId: string, newParentId?: string) => void;
  selectedTopicId: string | null;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  topics,
  onAddTopic,
  onMoveTopic,
  selectedTopicId
}) => {
  const [newTopic, setNewTopic] = useState({
    name: '',
    description: '',
    parentId: 'root'
  });
  const [moveTopicId, setMoveTopicId] = useState('');
  const [moveToParentId, setMoveToParentId] = useState('root');

  const flattenTopics = (topics: Topic[], level: number = 0): Array<{ topic: Topic, level: number }> => {
    const result: Array<{ topic: Topic, level: number }> = [];
    
    for (const topic of topics) {
      result.push({ topic, level });
      if (topic.childTopics.length > 0) {
        result.push(...flattenTopics(topic.childTopics, level + 1));
      }
    }
    
    return result;
  };

  const flatTopics = flattenTopics(topics);

  const renderTopicOption = (topic: Topic, level: number) => {
    const indent = '│  '.repeat(level);
    const connector = level > 0 ? '├─ ' : '';
    return `${indent}${connector}${topic.name}`;
  };

  const handleAddTopic = () => {
    if (newTopic.name.trim()) {
      onAddTopic(
        {
          name: newTopic.name,
          description: newTopic.description,
          projectLinks: [],
          childTopics: []
        },
        newTopic.parentId === 'root' ? undefined : newTopic.parentId
      );
      
      setNewTopic({ name: '', description: '', parentId: 'root' });
    }
  };

  const handleMoveTopic = () => {
    if (moveTopicId) {
      onMoveTopic(moveTopicId, moveToParentId === 'root' ? undefined : moveToParentId);
      setMoveTopicId('');
      setMoveToParentId('root');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-4 h-4 text-primary" />
        <h2 className="text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Admin Panel
        </h2>
      </div>
      
      {/* Add Topic */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-white to-primary/5 dark:from-primary/10 dark:via-slate-800 dark:to-primary/10 shadow-lg backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-primary font-semibold">
            <Plus className="w-3 h-3" />
            <span>Add New Topic</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Topic name"
            value={newTopic.name}
            onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
            className="border-primary/30 focus:border-primary h-8 text-xs"
          />
          <Textarea
            placeholder="Description"
            value={newTopic.description}
            onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
            rows={2}
            className="border-primary/30 focus:border-primary resize-none text-xs"
          />
          <Select value={newTopic.parentId} onValueChange={(value) => setNewTopic({ ...newTopic, parentId: value })}>
            <SelectTrigger className="border-primary/30 focus:border-primary h-8 text-xs">
              <SelectValue placeholder="Select parent (optional)" />
            </SelectTrigger>
            <SelectContent className="max-h-32 z-50 overflow-hidden rounded-lg border border-violet-200/50 bg-gradient-to-br from-white via-violet-50/50 to-purple-50/30 shadow-xl shadow-violet-500/10 dark:border-violet-800/50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-violet-950/80 dark:to-purple-950/50 dark:shadow-violet-900/20">
              <SelectItem value="root"><span className="text-xs">🏠 Root Level</span></SelectItem>
              {flatTopics.map(({ topic, level }) => (
                <SelectItem key={topic.id} value={topic.id}>
                  <span className="text-xs truncate max-w-full">
                    {renderTopicOption(topic, level)}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleAddTopic} 
            className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white shadow-md h-8 text-xs font-medium"
          >
            <Plus className="w-3 h-3 mr-1" />
            <span>Add Topic</span>
          </Button>
        </CardContent>
      </Card>

      {/* Move Topic */}
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/3 to-purple-50/30 dark:from-primary/5 dark:to-purple-950/20 shadow-lg backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-primary font-semibold">
            <Move className="w-3 h-3" />
            <span>Move Topic</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select value={moveTopicId} onValueChange={setMoveTopicId}>
            <SelectTrigger className="border-primary/30 focus:border-primary h-8 text-xs">
              <SelectValue placeholder="Select topic to move" />
            </SelectTrigger>
            <SelectContent className="max-h-32 z-50 overflow-hidden rounded-lg border border-violet-200/50 bg-gradient-to-br from-white via-violet-50/50 to-purple-50/30 shadow-xl shadow-violet-500/10 dark:border-violet-800/50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-violet-950/80 dark:to-purple-950/50 dark:shadow-violet-900/20">
              {flatTopics.map(({ topic, level }) => (
                <SelectItem key={topic.id} value={topic.id}>
                  <span className="text-xs truncate max-w-full">
                    {renderTopicOption(topic, level)}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={moveToParentId} onValueChange={setMoveToParentId}>
            <SelectTrigger className="border-primary/30 focus:border-primary h-8 text-xs">
              <SelectValue placeholder="Select new parent" />
            </SelectTrigger>
            <SelectContent className="max-h-32 z-50 overflow-hidden rounded-lg border border-violet-200/50 bg-gradient-to-br from-white via-violet-50/50 to-purple-50/30 shadow-xl shadow-violet-500/10 dark:border-violet-800/50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-violet-950/80 dark:to-purple-950/50 dark:shadow-violet-900/20">
              <SelectItem value="root"><span className="text-xs">🏠 Root Level</span></SelectItem>
              {flatTopics
                .filter(({ topic }) => topic.id !== moveTopicId)
                .map(({ topic, level }) => (
                  <SelectItem key={topic.id} value={topic.id}>
                    <span className="text-xs truncate max-w-full">
                      {renderTopicOption(topic, level)}
                    </span>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          
          <Button 
            onClick={handleMoveTopic} 
            className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white shadow-md h-8 text-xs font-medium"
            disabled={!moveTopicId}
          >
            <Move className="w-3 h-3 mr-1" />
            <span>Move Topic</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
