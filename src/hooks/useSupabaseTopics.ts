
import { useState, useEffect } from 'react';
import { Topic, ProjectLink } from '@/types/Topic';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useSupabaseTopics = () => {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  // Convert Supabase data to Topic format
  const convertSupabaseToTopic = (supabaseTopics: any[], projectLinks: any[]): Topic[] => {
    const topicMap = new Map<string, Topic>();

    // First pass: create all topics
    supabaseTopics.forEach(topic => {
      const topicLinks = projectLinks.filter(link => link.topic_id === topic.id);
      topicMap.set(topic.id, {
        id: topic.id,
        name: topic.name,
        description: topic.description || '',
        projectLinks: topicLinks.map(link => ({
          id: link.id,
          title: link.title,
          url: link.url,
          description: link.description
        })),
        childTopics: [],
        parentId: topic.parent_id
      });
    });

    // Second pass: build hierarchy
    const rootTopics: Topic[] = [];
    topicMap.forEach(topic => {
      if (topic.parentId && topicMap.has(topic.parentId)) {
        const parent = topicMap.get(topic.parentId)!;
        parent.childTopics.push(topic);
      } else {
        rootTopics.push(topic);
      }
    });

    return rootTopics;
  };

  const fetchTopics = async () => {
    if (!user) {
      setTopics([]);
      setLoading(false);
      return;
    }

    try {
      // Fetch topics
      const { data: topicsData, error: topicsError } = await supabase
        .from('topics')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at');

      if (topicsError) throw topicsError;

      // Fetch project links
      const { data: linksData, error: linksError } = await supabase
        .from('project_links')
        .select('*');

      if (linksError) throw linksError;

      const convertedTopics = convertSupabaseToTopic(topicsData || [], linksData || []);
      setTopics(convertedTopics);
    } catch (error) {
      console.error('Error fetching topics:', error);
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [user]);

  const findTopicById = (topics: Topic[], id: string): Topic | null => {
    for (const topic of topics) {
      if (topic.id === id) return topic;
      const found = findTopicById(topic.childTopics, id);
      if (found) return found;
    }
    return null;
  };

  const addTopic = async (newTopic: Omit<Topic, 'id'>, parentId?: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('topics')
        .insert({
          user_id: user.id,
          name: newTopic.name,
          description: newTopic.description,
          parent_id: parentId
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh topics
      await fetchTopics();
    } catch (error) {
      console.error('Error adding topic:', error);
    }
  };

  const updateTopic = async (topicId: string, updates: Partial<Topic>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('topics')
        .update({
          name: updates.name,
          description: updates.description
        })
        .eq('id', topicId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Handle project links updates
      if (updates.projectLinks) {
        // Get current links
        const { data: currentLinks } = await supabase
          .from('project_links')
          .select('*')
          .eq('topic_id', topicId);

        // Delete removed links
        const currentLinkIds = currentLinks?.map(link => link.id) || [];
        const updatedLinkIds = updates.projectLinks.map(link => link.id);
        const linksToDelete = currentLinkIds.filter(id => !updatedLinkIds.includes(id));

        if (linksToDelete.length > 0) {
          await supabase
            .from('project_links')
            .delete()
            .in('id', linksToDelete);
        }

        // Add new links
        const newLinks = updates.projectLinks.filter(link => !currentLinkIds.includes(link.id));
        if (newLinks.length > 0) {
          await supabase
            .from('project_links')
            .insert(newLinks.map(link => ({
              topic_id: topicId,
              title: link.title,
              url: link.url,
              description: link.description
            })));
        }
      }

      // Refresh topics
      await fetchTopics();
    } catch (error) {
      console.error('Error updating topic:', error);
    }
  };

  const deleteTopic = async (topicId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('topics')
        .delete()
        .eq('id', topicId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh topics
      await fetchTopics();
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  const moveTopic = async (topicId: string, newParentId?: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('topics')
        .update({ parent_id: newParentId })
        .eq('id', topicId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh topics
      await fetchTopics();
    } catch (error) {
      console.error('Error moving topic:', error);
    }
  };

  return {
    topics,
    loading,
    addTopic,
    updateTopic,
    deleteTopic,
    moveTopic,
    findTopicById: (id: string) => findTopicById(topics, id),
    refetchTopics: fetchTopics
  };
};
