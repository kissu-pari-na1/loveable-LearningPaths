
import { Topic } from '@/types/Topic';

export const convertSupabaseToTopic = (supabaseTopics: any[], projectLinks: any[]): Topic[] => {
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
        description: link.description,
        types: link.types // Now properly mapping the types from database
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

export const findTopicById = (topics: Topic[], id: string): Topic | null => {
  for (const topic of topics) {
    if (topic.id === id) return topic;
    const found = findTopicById(topic.childTopics, id);
    if (found) return found;
  }
  return null;
};

export const getAllDescendantIds = (topicId: string, allTopicsFlat: any[]): string[] => {
  const descendants: string[] = [];
  
  const findChildren = (parentId: string) => {
    const children = allTopicsFlat.filter(topic => topic.parent_id === parentId);
    for (const child of children) {
      descendants.push(child.id);
      // Recursively find children of this child
      findChildren(child.id);
    }
  };
  
  findChildren(topicId);
  return descendants;
};
