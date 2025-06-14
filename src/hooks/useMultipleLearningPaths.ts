import { useState, useEffect } from 'react';
import { Topic } from '@/types/Topic';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { LearningPathAccess } from '@/hooks/useSharedLearningPaths';

export const useMultipleLearningPaths = (selectedPathUserId: string) => {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPermission, setUserPermission] = useState<'owner' | 'viewer' | 'admin'>('viewer');

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
    if (!user || !selectedPathUserId) {
      setTopics([]);
      setLoading(false);
      return;
    }

    try {
      // Determine user permission for this learning path
      if (selectedPathUserId === user.id) {
        setUserPermission('owner');
      } else {
        // Check if user has shared access
        const { data: shareData, error: shareError } = await supabase
          .from('shared_learning_paths')
          .select('permission_level')
          .eq('owner_id', selectedPathUserId)
          .eq('shared_with_id', user.id)
          .single();

        if (shareError || !shareData) {
          setUserPermission('viewer');
        } else {
          setUserPermission(shareData.permission_level as 'viewer' | 'admin');
        }
      }

      // Fetch topics for the selected user
      const { data: topicsData, error: topicsError } = await supabase
        .from('topics')
        .select('*')
        .eq('user_id', selectedPathUserId)
        .order('created_at');

      if (topicsError) throw topicsError;

      // Fetch project links for these topics
      const topicIds = topicsData?.map(t => t.id) || [];
      let linksData = [];
      
      if (topicIds.length > 0) {
        const { data: links, error: linksError } = await supabase
          .from('project_links')
          .select('*')
          .in('topic_id', topicIds);

        if (linksError) throw linksError;
        linksData = links || [];
      }

      const convertedTopics = convertSupabaseToTopic(topicsData || [], linksData);
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
  }, [user, selectedPathUserId]);

  const findTopicById = (topics: Topic[], id: string): Topic | null => {
    for (const topic of topics) {
      if (topic.id === id) return topic;
      const found = findTopicById(topic.childTopics, id);
      if (found) return found;
    }
    return null;
  };

  const addTopic = async (newTopic: Omit<Topic, 'id'>, parentId?: string) => {
    if (!user || userPermission === 'viewer') return;

    try {
      const { data, error } = await supabase
        .from('topics')
        .insert({
          user_id: selectedPathUserId,
          name: newTopic.name,
          description: newTopic.description,
          parent_id: parentId
        })
        .select()
        .single();

      if (error) throw error;
      await fetchTopics();
    } catch (error) {
      console.error('Error adding topic:', error);
    }
  };

  const updateTopic = async (topicId: string, updates: Partial<Topic>) => {
    if (!user || userPermission === 'viewer') return;

    try {
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
              description: link.description
            })));
        }
      }

      await fetchTopics();
    } catch (error) {
      console.error('Error updating topic:', error);
    }
  };

  const getAllDescendantIds = (topicId: string, allTopics: Topic[]): string[] => {
    const descendants: string[] = [];
    
    const findDescendants = (topics: Topic[]) => {
      for (const topic of topics) {
        if (topic.parentId === topicId) {
          descendants.push(topic.id);
          // Recursively find descendants of this topic
          findDescendants(allTopics);
        }
        // Also check children of current topic
        findDescendants(topic.childTopics);
      }
    };
    
    findDescendants(allTopics);
    return descendants;
  };

  const deleteTopic = async (topicId: string) => {
    if (!user || userPermission === 'viewer') return;

    try {
      // First, get all topics to find descendants
      const { data: allTopicsData, error: fetchError } = await supabase
        .from('topics')
        .select('*')
        .eq('user_id', selectedPathUserId);

      if (fetchError) throw fetchError;

      // Find all descendant topic IDs
      const allTopics = convertSupabaseToTopic(allTopicsData || [], []);
      const descendantIds = getAllDescendantIds(topicId, allTopics);
      const allTopicIdsToDelete = [topicId, ...descendantIds];

      console.log('Deleting topics:', allTopicIdsToDelete);

      // Delete all topics (including descendants) in one operation
      // The foreign key constraints will handle deleting related project_links
      const { error } = await supabase
        .from('topics')
        .delete()
        .in('id', allTopicIdsToDelete);

      if (error) throw error;
      await fetchTopics();
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  const moveTopic = async (topicId: string, newParentId?: string) => {
    if (!user || userPermission === 'viewer') return;

    try {
      const { error } = await supabase
        .from('topics')
        .update({ parent_id: newParentId })
        .eq('id', topicId);

      if (error) throw error;
      await fetchTopics();
    } catch (error) {
      console.error('Error moving topic:', error);
    }
  };

  return {
    topics,
    loading,
    userPermission,
    addTopic,
    updateTopic,
    deleteTopic,
    moveTopic,
    findTopicById: (id: string) => findTopicById(topics, id),
    refetchTopics: fetchTopics
  };
};
