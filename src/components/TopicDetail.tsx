
import React, { useState } from 'react';
import { Topic } from '@/types/Topic';
import { TopicDetailHeader } from '@/components/topic/TopicDetailHeader';
import { ProjectLinksSection } from '@/components/topic/ProjectLinksSection';
import { SubtopicsSection } from '@/components/topic/SubtopicsSection';

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

        <SubtopicsSection
          topic={topic}
          onSubtopicClick={handleSubtopicClick}
        />
      </div>
    </div>
  );
};
