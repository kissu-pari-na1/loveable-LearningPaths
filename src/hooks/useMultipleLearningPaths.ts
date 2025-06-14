
import { useState, useEffect } from 'react';
import { Topic } from '@/types/Topic';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { convertSupabaseToTopic, findTopicById } from '@/utils/topicConverters';
import { useTopicOperations } from '@/hooks/useTopicOperations';

export const useMultipleLearningPaths = (selectedPathUserId: string) => {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPermission, setUserPermission] = useState<'owner' | 'viewer' | 'admin'>('viewer');

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

  const { addTopic, updateTopic, deleteTopic, moveTopic } = useTopicOperations(
    selectedPathUserId,
    userPermission,
    fetchTopics
  );

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
