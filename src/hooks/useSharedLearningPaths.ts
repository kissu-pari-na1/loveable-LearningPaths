
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SharedLearningPath {
  id: string;
  owner_id: string;
  shared_with_id: string;
  permission_level: 'viewer' | 'admin';
  created_at: string;
  shared_with_email?: string; // Email of the user the dashboard is shared with
}

export interface LearningPathAccess {
  user_id: string;
  user_email: string;
  permission_level: 'owner' | 'viewer' | 'admin';
  is_owner: boolean;
}

export const useSharedLearningPaths = () => {
  const { user } = useAuth();
  const [sharedPaths, setSharedPaths] = useState<SharedLearningPath[]>([]);
  const [availablePaths, setAvailablePaths] = useState<LearningPathAccess[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSharedPaths = async () => {
    if (!user) {
      setSharedPaths([]);
      setAvailablePaths([]);
      setLoading(false);
      return;
    }

    try {
      // Fetch shared paths where user is involved (owner or shared with)
      const { data: sharedData, error: sharedError } = await supabase
        .from('shared_learning_paths')
        .select('*')
        .or(`owner_id.eq.${user.id},shared_with_id.eq.${user.id}`);

      if (sharedError) throw sharedError;

      // Get all unique user IDs to fetch emails
      const userIds = new Set<string>();
      userIds.add(user.id);
      sharedData?.forEach(path => {
        userIds.add(path.owner_id);
        userIds.add(path.shared_with_id);
      });

      // Fetch user profiles for emails
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', Array.from(userIds));

      if (profilesError) throw profilesError;

      const emailMap = new Map(profiles?.map(p => [p.id, p.email]) || []);

      // Add shared_with emails to shared paths
      const sharedWithEmails: SharedLearningPath[] = sharedData?.map(path => ({
        ...path,
        permission_level: path.permission_level as 'viewer' | 'admin',
        shared_with_email: emailMap.get(path.shared_with_id) // Email of the user the dashboard is shared with
      })) || [];

      setSharedPaths(sharedWithEmails);

      // Build available paths list
      const paths: LearningPathAccess[] = [
        {
          user_id: user.id,
          user_email: emailMap.get(user.id) || user.email || 'Unknown',
          permission_level: 'owner',
          is_owner: true
        }
      ];

      // Add shared paths where current user has access
      sharedData?.forEach(path => {
        if (path.shared_with_id === user.id) {
          paths.push({
            user_id: path.owner_id,
            user_email: emailMap.get(path.owner_id) || 'Unknown',
            permission_level: path.permission_level as 'viewer' | 'admin',
            is_owner: false
          });
        }
      });

      setAvailablePaths(paths);
    } catch (error) {
      console.error('Error fetching shared learning paths:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedPaths();
  }, [user]);

  const shareWithUser = async (email: string, permissionLevel: 'viewer' | 'admin') => {
    if (!user) return { error: 'Not authenticated' };

    try {
      // First, find the user by email
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (profileError || !profiles) {
        return { error: 'User not found with that email' };
      }

      // Create the share
      const { error } = await supabase
        .from('shared_learning_paths')
        .insert({
          owner_id: user.id,
          shared_with_id: profiles.id,
          permission_level: permissionLevel
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          return { error: 'Already shared with this user' };
        }
        throw error;
      }

      await fetchSharedPaths();
      return { error: null };
    } catch (error) {
      console.error('Error sharing learning path:', error);
      return { error: 'Failed to share learning path' };
    }
  };

  const updatePermission = async (shareId: string, permissionLevel: 'viewer' | 'admin') => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('shared_learning_paths')
        .update({ permission_level: permissionLevel })
        .eq('id', shareId)
        .eq('owner_id', user.id);

      if (error) throw error;

      await fetchSharedPaths();
    } catch (error) {
      console.error('Error updating permission:', error);
    }
  };

  const removeShare = async (shareId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('shared_learning_paths')
        .delete()
        .eq('id', shareId)
        .eq('owner_id', user.id);

      if (error) throw error;

      await fetchSharedPaths();
    } catch (error) {
      console.error('Error removing share:', error);
    }
  };

  useEffect(() => {
    fetchSharedPaths();
  }, [user]);

  return {
    sharedPaths,
    availablePaths,
    loading,
    shareWithUser,
    updatePermission,
    removeShare,
    refetch: fetchSharedPaths
  };
};
