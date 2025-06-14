
import React, { useState, useEffect } from 'react';
import { Topic } from '@/types/Topic';
import { TopicDetailHeader } from '@/components/topic/TopicDetailHeader';
import { TopicDetailTabs } from '@/components/topic/TopicDetailTabs';

interface TopicDetailContentProps {
  topic: Topic;
  isAdminMode: boolean;
  onUpdateTopic: (topicId: string, updates: Partial<Topic>) => void;
  onDeleteTopic: (topicId: string) => void;
  onAddSubtopic?: (newSubtopic: Omit<Topic, 'id'>, parentId: string) => void;
  onTopicSelect?: (topicId: string) => void;
}

export const TopicDetailContent: React.FC<TopicDetailContentProps> = ({
  topic,
  isAdminMode,
  onUpdateTopic,
  onDeleteTopic,
  onAddSubtopic,
  onTopicSelect
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [newLink, setNewLink] = useState({ title: '', url: '', description: '', type: undefined as 'Personal' | 'Project' | undefined });
  const [showAddLink, setShowAddLink] = useState(false);
  const [activeTab, setActiveTab] = useState('links');

  // Reset to links tab when topic changes
  useEffect(() => {
    setActiveTab('links');
  }, [topic.id]);

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
          description: newLink.description,
          type: newLink.type
        }
      ];
      
      onUpdateTopic(topic.id, { projectLinks: updatedLinks });
      setNewLink({ title: '', url: '', description: '', type: undefined });
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
    <div className="p-3 md:p-4 lg:p-6 max-w-5xl mx-auto">
      <div className="mb-4 md:mb-6">
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

      <TopicDetailTabs
        topic={topic}
        isAdminMode={isAdminMode}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showAddLink={showAddLink}
        newLink={newLink}
        onToggleAddLink={() => setShowAddLink(!showAddLink)}
        onAddLink={handleAddLink}
        onRemoveLink={handleRemoveLink}
        onNewLinkChange={handleNewLinkChange}
        onSubtopicClick={handleSubtopicClick}
        onAddSubtopic={onAddSubtopic}
      />
    </div>
  );
};
