
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
  const [newLink, setNewLink] = useState({ 
    title: '', 
    url: '', 
    description: '', 
    types: [] as ('Personal' | 'Project')[]
  });
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
      console.log('Adding link with types:', newLink.types); // Debug log
      
      const updatedLinks = [
        ...topic.projectLinks,
        {
          id: Date.now().toString(),
          title: newLink.title,
          url: newLink.url,
          description: newLink.description || undefined,
          types: newLink.types && newLink.types.length > 0 ? newLink.types : undefined
        }
      ];
      
      console.log('Updated links:', updatedLinks); // Debug log
      
      onUpdateTopic(topic.id, { projectLinks: updatedLinks });
      setNewLink({ title: '', url: '', description: '', types: [] });
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

  const handleNewLinkChange = (field: string, value: string | ('Personal' | 'Project')[]) => {
    console.log('Changing field:', field, 'to value:', value); // Debug log
    setNewLink(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0 p-3 md:p-4 lg:p-6 max-w-5xl mx-auto w-full">
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

      <div className="flex-1 overflow-hidden px-3 md:px-4 lg:px-6 max-w-5xl mx-auto w-full">
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
    </div>
  );
};
