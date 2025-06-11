
import { useState, useEffect } from 'react';
import { Topic } from '@/types/Topic';

const STORAGE_KEY = 'learning-paths-topics';

const defaultTopics: Topic[] = [
  {
    id: '1',
    name: 'Web Development',
    description: 'Modern web development technologies and frameworks',
    projectLinks: [
      {
        id: '1',
        title: 'React Documentation',
        url: 'https://react.dev',
        description: 'Official React documentation'
      }
    ],
    childTopics: [
      {
        id: '2',
        name: 'Frontend Frameworks',
        description: 'Client-side JavaScript frameworks',
        projectLinks: [
          {
            id: '2',
            title: 'Vue.js Guide',
            url: 'https://vuejs.org',
            description: 'Vue.js official guide'
          }
        ],
        childTopics: [],
        parentId: '1'
      },
      {
        id: '3',
        name: 'Backend Technologies',
        description: 'Server-side development tools and frameworks',
        projectLinks: [],
        childTopics: [],
        parentId: '1'
      }
    ]
  },
  {
    id: '4',
    name: 'Data Science',
    description: 'Data analysis, machine learning, and AI',
    projectLinks: [
      {
        id: '3',
        title: 'Pandas Documentation',
        url: 'https://pandas.pydata.org',
        description: 'Data manipulation library for Python'
      }
    ],
    childTopics: []
  }
];

export const useTopics = () => {
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTopics(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing stored topics:', error);
        setTopics(defaultTopics);
      }
    } else {
      setTopics(defaultTopics);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(topics));
  }, [topics]);

  const findTopicById = (topics: Topic[], id: string): Topic | null => {
    for (const topic of topics) {
      if (topic.id === id) return topic;
      const found = findTopicById(topic.childTopics, id);
      if (found) return found;
    }
    return null;
  };

  const addTopic = (newTopic: Omit<Topic, 'id'>, parentId?: string) => {
    const topic: Topic = {
      ...newTopic,
      id: Date.now().toString(),
      parentId
    };

    setTopics(prevTopics => {
      if (!parentId) {
        return [...prevTopics, topic];
      }

      const updateTopics = (topics: Topic[]): Topic[] => {
        return topics.map(t => {
          if (t.id === parentId) {
            return {
              ...t,
              childTopics: [...t.childTopics, topic]
            };
          }
          return {
            ...t,
            childTopics: updateTopics(t.childTopics)
          };
        });
      };

      return updateTopics(prevTopics);
    });
  };

  const updateTopic = (topicId: string, updates: Partial<Topic>) => {
    setTopics(prevTopics => {
      const updateTopics = (topics: Topic[]): Topic[] => {
        return topics.map(topic => {
          if (topic.id === topicId) {
            return { ...topic, ...updates };
          }
          return {
            ...topic,
            childTopics: updateTopics(topic.childTopics)
          };
        });
      };

      return updateTopics(prevTopics);
    });
  };

  const deleteTopic = (topicId: string) => {
    setTopics(prevTopics => {
      const removeFromTopics = (topics: Topic[]): Topic[] => {
        return topics
          .filter(topic => topic.id !== topicId)
          .map(topic => ({
            ...topic,
            childTopics: removeFromTopics(topic.childTopics)
          }));
      };

      return removeFromTopics(prevTopics);
    });
  };

  const moveTopic = (topicId: string, newParentId?: string) => {
    setTopics(prevTopics => {
      const topic = findTopicById(prevTopics, topicId);
      if (!topic) return prevTopics;

      // Remove from current location
      const removeFromTopics = (topics: Topic[]): Topic[] => {
        return topics
          .filter(t => t.id !== topicId)
          .map(t => ({
            ...t,
            childTopics: removeFromTopics(t.childTopics)
          }));
      };

      let newTopics = removeFromTopics(prevTopics);
      const updatedTopic = { ...topic, parentId: newParentId };

      // Add to new location
      if (!newParentId) {
        newTopics = [...newTopics, updatedTopic];
      } else {
        const addToTopics = (topics: Topic[]): Topic[] => {
          return topics.map(t => {
            if (t.id === newParentId) {
              return {
                ...t,
                childTopics: [...t.childTopics, updatedTopic]
              };
            }
            return {
              ...t,
              childTopics: addToTopics(t.childTopics)
            };
          });
        };

        newTopics = addToTopics(newTopics);
      }

      return newTopics;
    });
  };

  return {
    topics,
    addTopic,
    updateTopic,
    deleteTopic,
    moveTopic,
    findTopicById: (id: string) => findTopicById(topics, id)
  };
};
