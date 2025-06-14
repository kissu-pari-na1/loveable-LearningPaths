
import { useState, useCallback } from 'react';
import { pipeline } from '@huggingface/transformers';
import { Topic, SearchResult } from '@/types/Topic';

// Cache the model to avoid reloading
let modelCache: any = null;

export const useSemanticSearch = (topics: Topic[]) => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      // First, do a fast text-based search
      const textResults = performTextSearch(query, topics);
      
      // If we have good text matches, use those immediately
      if (textResults.length > 0) {
        setSearchResults(textResults);
        setIsSearching(false);
        return;
      }

      // Only use semantic search as fallback for complex queries
      if (query.length > 3) {
        const semanticResults = await performSemanticSearch(query, topics);
        setSearchResults(semanticResults);
      } else {
        setSearchResults(textResults);
      }
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to text search if semantic search fails
      const textResults = performTextSearch(query, topics);
      setSearchResults(textResults);
    }
    
    setIsSearching(false);
  }, [topics]);

  return {
    searchResults,
    search,
    isSearching
  };
};

// Fast text-based search
function performTextSearch(query: string, topics: Topic[]): SearchResult[] {
  const getAllTopics = (topics: Topic[]): Topic[] => {
    const result: Topic[] = [];
    for (const topic of topics) {
      result.push(topic);
      if (topic.childTopics.length > 0) {
        result.push(...getAllTopics(topic.childTopics));
      }
    }
    return result;
  };

  const allTopics = getAllTopics(topics);
  const results: SearchResult[] = [];
  const queryLower = query.toLowerCase();

  for (const topic of allTopics) {
    let matchedIn: 'name' | 'description' | 'projectLinks' = 'description';
    let similarity = 0;

    // Check name match (highest priority)
    if (topic.name.toLowerCase().includes(queryLower)) {
      matchedIn = 'name';
      similarity = 0.9;
    }
    // Check description match
    else if (topic.description.toLowerCase().includes(queryLower)) {
      matchedIn = 'description';
      similarity = 0.7;
    }
    // Check project links match
    else if (topic.projectLinks.some(link => 
      link.title.toLowerCase().includes(queryLower) ||
      link.description?.toLowerCase().includes(queryLower)
    )) {
      matchedIn = 'projectLinks';
      similarity = 0.6;
    }

    if (similarity > 0) {
      results.push({
        ...topic,
        similarity,
        matchedIn
      });
    }
  }

  // Sort by similarity score
  results.sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
  return results;
}

// Semantic search as fallback
async function performSemanticSearch(query: string, topics: Topic[]): Promise<SearchResult[]> {
  try {
    // Load or reuse cached model
    if (!modelCache) {
      modelCache = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    
    // Get embedding for the search query
    const queryEmbedding = await modelCache(query, { pooling: 'mean', normalize: true });
    const queryVector = Array.from(queryEmbedding.data) as number[];
    
    // Function to get all topics flattened
    const getAllTopics = (topics: Topic[]): Topic[] => {
      const result: Topic[] = [];
      for (const topic of topics) {
        result.push(topic);
        if (topic.childTopics.length > 0) {
          result.push(...getAllTopics(topic.childTopics));
        }
      }
      return result;
    };

    const allTopics = getAllTopics(topics);
    const results: SearchResult[] = [];

    for (const topic of allTopics) {
      // Generate embeddings for topic if not exists
      if (!topic.embedding) {
        const topicText = `${topic.name} ${topic.description}`;
        const topicEmbedding = await modelCache(topicText, { pooling: 'mean', normalize: true });
        topic.embedding = Array.from(topicEmbedding.data) as number[];
      }

      // Calculate cosine similarity
      const similarity = cosineSimilarity(queryVector, topic.embedding);
      
      // Check if query matches in name, description, or project links
      let matchedIn: 'name' | 'description' | 'projectLinks' = 'description';
      
      if (topic.name.toLowerCase().includes(query.toLowerCase())) {
        matchedIn = 'name';
      } else if (topic.projectLinks.some(link => 
        link.title.toLowerCase().includes(query.toLowerCase()) ||
        link.description?.toLowerCase().includes(query.toLowerCase())
      )) {
        matchedIn = 'projectLinks';
      }

      // Only include results with similarity above threshold
      if (similarity > 0.3) {
        results.push({
          ...topic,
          similarity,
          matchedIn
        });
      }
    }

    // Sort by similarity score
    results.sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
    return results;
  } catch (error) {
    console.error('Semantic search error:', error);
    return [];
  }
}

// Helper function to calculate cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
