
import React, { useState } from 'react';
import { Topic, ProjectLink } from '@/types/Topic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TopicDetailProps {
  topicId: string;
  topics: Topic[];
  isAdminMode: boolean;
  onUpdateTopic: (topicId: string, updates: Partial<Topic>) => void;
  onDeleteTopic: (topicId: string) => void;
}

export const TopicDetail: React.FC<TopicDetailProps> = ({
  topicId,
  topics,
  isAdminMode,
  onUpdateTopic,
  onDeleteTopic
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [newLink, setNewLink] = useState({ title: '', url: '', description: '' });
  const [showAddLink, setShowAddLink] = useState(false);

  const findTopicById = (topics: Topic[], id: string): Topic | null => {
    for (const topic of topics) {
      if (topic.id === id) return topic;
      const found = findTopicById(topic.childTopics, id);
      if (found) return found;
    }
    return null;
  };

  const topic = findTopicById(topics, topicId);

  if (!topic) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Topic not found</h2>
          <p className="text-muted-foreground">The selected topic could not be found.</p>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setEditForm({ name: topic.name, description: topic.description });
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdateTopic(topic.id, {
      name: editForm.name,
      description: editForm.description
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ name: '', description: '' });
  };

  const handleAddLink = () => {
    if (newLink.title && newLink.url) {
      const updatedLinks: ProjectLink[] = [
        ...topic.projectLinks,
        {
          id: Date.now().toString(),
          title: newLink.title,
          url: newLink.url,
          description: newLink.description
        }
      ];
      
      onUpdateTopic(topic.id, { projectLinks: updatedLinks });
      setNewLink({ title: '', url: '', description: '' });
      setShowAddLink(false);
    }
  };

  const handleRemoveLink = (linkId: string) => {
    const updatedLinks = topic.projectLinks.filter(link => link.id !== linkId);
    onUpdateTopic(topic.id, { projectLinks: updatedLinks });
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-4 lg:p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          {isEditing ? (
            <div className="space-y-4">
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Topic name"
                className="text-xl lg:text-2xl font-bold"
              />
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Topic description"
                rows={3}
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleSave} className="w-full sm:w-auto">Save</Button>
                <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">Cancel</Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-4 gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2 break-words">{topic.name}</h1>
                  <p className="text-base lg:text-lg text-muted-foreground break-words">{topic.description}</p>
                </div>
                {isAdminMode && (
                  <div className="flex flex-col sm:flex-row gap-2 lg:ml-4">
                    <Button variant="outline" onClick={handleEdit} className="w-full sm:w-auto">Edit</Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => onDeleteTopic(topic.id)}
                      disabled={topic.childTopics.length > 0}
                      className="w-full sm:w-auto"
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>{topic.projectLinks.length} project links</span>
                <span>{topic.childTopics.length} subtopics</span>
              </div>
            </div>
          )}
        </div>

        {/* Project Links */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <CardTitle className="text-lg lg:text-xl">Project Links</CardTitle>
              {isAdminMode && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAddLink(!showAddLink)}
                  className="w-full sm:w-auto"
                >
                  Add Link
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {showAddLink && (
              <div className="mb-4 p-4 border border-dashed border-border rounded-lg">
                <div className="space-y-3">
                  <Input
                    placeholder="Link title"
                    value={newLink.title}
                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  />
                  <Input
                    placeholder="URL"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  />
                  <Input
                    placeholder="Description (optional)"
                    value={newLink.description}
                    onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={handleAddLink} className="w-full sm:w-auto">Add</Button>
                    <Button variant="outline" onClick={() => setShowAddLink(false)} className="w-full sm:w-auto">Cancel</Button>
                  </div>
                </div>
              </div>
            )}
            
            {topic.projectLinks.length === 0 ? (
              <p className="text-muted-foreground">No project links added yet.</p>
            ) : (
              <div className="space-y-3">
                {topic.projectLinks.map((link) => (
                  <div key={link.id} className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-medium break-words"
                        >
                          {link.title}
                        </a>
                        {link.description && (
                          <p className="text-sm text-muted-foreground mt-1 break-words">{link.description}</p>
                        )}
                      </div>
                      {isAdminMode && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveLink(link.id)}
                          className="text-destructive hover:text-destructive w-full sm:w-auto mt-2 sm:mt-0"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Child Topics */}
        {topic.childTopics.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">Subtopics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {topic.childTopics.map((child) => (
                  <div key={child.id} className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                    <h3 className="font-medium mb-1 break-words">{child.name}</h3>
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
        )}
      </div>
    </div>
  );
};
