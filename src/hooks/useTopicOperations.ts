
import { useState } from 'react';
import { Topic } from '@/types/Topic';
import { supabase } from '@/integrations/supabase/client';
import { getAllDescendantIds } from '@/utils/topicConverters';
import { toast } from '@/hooks/use-toast';

export const useTopicOperations = (selectedPathUserId: string, userPermission: 'owner' | 'viewer' | 'admin', refetchTopics: () => Promise<void>) => {
  const [loading, setLoading] = useState(false);

  const addTopic = async (newTopic: Omit<Topic, 'id'>, parentId?: string) => {
    if (userPermission === 'viewer') return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('topics')
        .insert({
          user_id: selectedPathUserId,
          name: newTopic.name,
          description: newTopic.description,
          parent_id: parentId
        });

      if (error) throw error;
      await refetchTopics();
      
      toast({
        title: "Topic created",
        description: `"${newTopic.name}" has been successfully created.`,
      });
    } catch (error) {
      console.error('Error adding topic:', error);
      toast({
        title: "Error",
        description: "Failed to create topic. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTopic = async (topicId: string, updates: Partial<Topic>) => {
    if (userPermission === 'viewer') return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('topics')
        .update({
          name: updates.name,
          description: updates.description
        })
        .eq('id', topicId);

      if (error) throw error;

      // Handle project links updates
      if (updates.projectLinks) {
        const { data: currentLinks } = await supabase
          .from('project_links')
          .select('*')
          .eq('topic_id', topicId);

        const currentLinkIds = currentLinks?.map(link => link.id) || [];
        const updatedLinkIds = updates.projectLinks.map(link => link.id);
        const linksToDelete = currentLinkIds.filter(id => !updatedLinkIds.includes(id));

        if (linksToDelete.length > 0) {
          await supabase
            .from('project_links')
            .delete()
            .in('id', linksToDelete);
        }

        const newLinks = updates.projectLinks.filter(link => !currentLinkIds.includes(link.id));
        if (newLinks.length > 0) {
          await supabase
            .from('project_links')
            .insert(newLinks.map(link => ({
              topic_id: topicId,
              title: link.title,
              url: link.url,
              description: link.description,
              types: link.types // Now properly saving types to database
            })));
        }
      }

      await refetchTopics();
      
      toast({
        title: "Topic updated",
        description: "Changes have been saved successfully.",
      });
    } catch (error) {
      console.error('Error updating topic:', error);
      toast({
        title: "Error",
        description: "Failed to update topic. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteTopic = async (topicId: string) => {
    if (userPermission === 'viewer') return;

    try {
      setLoading(true);
      // First, get all topics to find descendants
      const { data: allTopicsData, error: fetchError } = await supabase
        .from('topics')
        .select('*')
        .eq('user_id', selectedPathUserId);

      if (fetchError) throw fetchError;

      // Find all descendant topic IDs
      const descendantIds = getAllDescendantIds(topicId, allTopicsData || []);
      const allTopicIdsToDelete = [topicId, ...descendantIds];

      console.log('Deleting topics:', allTopicIdsToDelete);

      // Delete all topics (including descendants) in one operation
      const { error } = await supabase
        .from('topics')
        .delete()
        .in('id', allTopicIdsToDelete);

      if (error) throw error;
      await refetchTopics();
      
      const deletedCount = allTopicIdsToDelete.length;
      toast({
        title: "Topic deleted",
        description: `Successfully deleted ${deletedCount} topic${deletedCount > 1 ? 's' : ''}.`,
      });
    } catch (error) {
      console.error('Error deleting topic:', error);
      toast({
        title: "Error",
        description: "Failed to delete topic. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const moveTopic = async (topicId: string, newParentId?: string) => {
    if (userPermission === 'viewer') return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('topics')
        .update({ parent_id: newParentId })
        .eq('id', topicId);

      if (error) throw error;
      await refetchTopics();
      
      toast({
        title: "Topic moved",
        description: "Topic has been moved successfully.",
      });
    } catch (error) {
      console.error('Error moving topic:', error);
      toast({
        title: "Error",
        description: "Failed to move topic. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    addTopic,
    updateTopic,
    deleteTopic,
    moveTopic,
    loading
  };
};
