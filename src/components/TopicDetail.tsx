import React, { useState, useEffect } from 'react';
import { Topic } from '@/types/Topic';
import { TopicDetailHeader } from '@/components/topic/TopicDetailHeader';
import { ProjectLinksSection } from '@/components/topic/ProjectLinksSection';
import { SubtopicsSection } from '@/components/topic/SubtopicsSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TopicDetailProps {
  topicId: string;
  topics: Topic[];
  isAdminMode: boolean;
  onUpdateTopic: (topicId: string, updates: Partial<Topic>) => void;
  onDeleteTopic: (topicId: string) => void;
  onTopicSelect?: (topicId: string) => void;
}

export const TopicDetail: React.FC<TopicDetailProps> = ({
  topicId,
  topics,
  isAdminMode,
  onUpdateTopic,
  onDeleteTopic,
  onTopicSelect
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [newLink, setNewLink] = useState({ title: '', url: '', description: '' });
  const [showAddLink, setShowAddLink] = useState(false);
  const [activeTab, setActiveTab] = useState('links');

  // Reset to links tab when topic changes
  useEffect(() => {
    setActiveTab('links');
  }, [topicId]);

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
      const updatedLinks = [
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

  const handleSubtopicClick = (subtopicId: string) => {
    if (onTopicSelect) {
      onTopicSelect(subtopicId);
    }
  };

  const handleEditFormChange = (field: 'name' | 'description', value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleNewLinkChange = (field: 'title' | 'url' | 'description', value: string) => {
    setNewLink(prev => ({ ...prev, [field]: value }));
  };

  const hasSubtopics = topic.childTopics.length > 0;
  const hasLinks = topic.projectLinks.length > 0 || isAdminMode;

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-4 lg:p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <TopicDetailHeader
            topic={topic}
            isEditing={isEditing}
            editForm={editForm}
            isAdminMode={isAdminMode}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            onDelete={() => onDeleteTopic(topic.id)}
            onEditFormChange={handleEditFormChange}
          />
        </div>

        {hasSubtopics || hasLinks ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50 p-1 rounded-lg h-12">
              <TabsTrigger 
                value="links" 
                className="relative data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200 rounded-md text-sm font-medium flex items-center justify-center gap-2"
              >
                <span className="hidden sm:inline">🔗</span>
                Project Links
                {topic.projectLinks.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                    {topic.projectLinks.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="subtopics" 
                disabled={!hasSubtopics}
                className="relative data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200 rounded-md text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">📂</span>
                Subtopics
                {hasSubtopics && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                    {topic.childTopics.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="links" className="mt-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg">
              <ProjectLinksSection
                topic={topic}
                isAdminMode={isAdminMode}
                showAddLink={showAddLink}
                newLink={newLink}
                onToggleAddLink={() => setShowAddLink(!showAddLink)}
                onAddLink={handleAddLink}
                onRemoveLink={handleRemoveLink}
                onNewLinkChange={handleNewLinkChange}
              />
            </TabsContent>
            
            {hasSubtopics && (
              <TabsContent value="subtopics" className="mt-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg">
                <SubtopicsSection
                  topic={topic}
                  onSubtopicClick={handleSubtopicClick}
                />
              </TabsContent>
            )}
          </Tabs>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span>🔗</span>
              <span>Project Links</span>
            </div>
            <ProjectLinksSection
              topic={topic}
              isAdminMode={isAdminMode}
              showAddLink={showAddLink}
              newLink={newLink}
              onToggleAddLink={() => setShowAddLink(!showAddLink)}
              onAddLink={handleAddLink}
              onRemoveLink={handleRemoveLink}
              onNewLinkChange={handleNewLinkChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};
