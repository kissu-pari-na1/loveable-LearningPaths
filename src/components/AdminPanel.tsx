import React, { useState } from 'react';
import { Topic } from '@/types/Topic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    <div className="w-80 bg-card border-l border-border shadow-lg p-4 overflow-auto">
      <h2 className="text-lg font-semibold mb-4">Admin Panel</h2>
      
      {/* Add Topic */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Add New Topic</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Topic name"
            value={newTopic.name}
            onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
          />
          <Textarea
            placeholder="Description"
            value={newTopic.description}
            onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
            rows={3}
          />
          <Select value={newTopic.parentId} onValueChange={(value) => setNewTopic({ ...newTopic, parentId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select parent (optional)" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              <SelectItem value="root">🏠 Root Level</SelectItem>
              {flatTopics.map(({ topic, level }) => (
                <SelectItem key={topic.id} value={topic.id}>
                  <span className="font-mono text-sm">
                    {renderTopicOption(topic, level)}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddTopic} className="w-full">
            Add Topic
          </Button>
        </CardContent>
      </Card>

      {/* Move Topic */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Move Topic</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select value={moveTopicId} onValueChange={setMoveTopicId}>
            <SelectTrigger>
              <SelectValue placeholder="Select topic to move" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {flatTopics.map(({ topic, level }) => (
                <SelectItem key={topic.id} value={topic.id}>
                  <span className="font-mono text-sm">
                    {renderTopicOption(topic, level)}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={moveToParentId} onValueChange={setMoveToParentId}>
            <SelectTrigger>
              <SelectValue placeholder="Select new parent" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              <SelectItem value="root">🏠 Root Level</SelectItem>
              {flatTopics
                .filter(({ topic }) => topic.id !== moveTopicId)
                .map(({ topic, level }) => (
                  <SelectItem key={topic.id} value={topic.id}>
                    <span className="font-mono text-sm">
                      {renderTopicOption(topic, level)}
                    </span>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          
          <Button 
            onClick={handleMoveTopic} 
            className="w-full"
            disabled={!moveTopicId}
          >
            Move Topic
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
