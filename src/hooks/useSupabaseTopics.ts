
import { useState, useEffect } from 'react';
import { Topic } from '@/types/Topic';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { convertSupabaseToTopic, findTopicById } from '@/utils/topicConverters';
import { useTopicOperations } from '@/hooks/useTopicOperations';

export const useSupabaseTopics = () => {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

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

  const { addTopic, updateTopic, deleteTopic, moveTopic } = useTopicOperations(
    user?.id || '',
    'owner',
    fetchTopics
  );

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
