
import { useState } from 'react';
import { pipeline } from '@huggingface/transformers';
import { Topic, SearchResult } from '@/types/Topic';

export const useSemanticSearch = (topics: Topic[]) => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const search = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      // Load the sentence transformer model
      const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      
      // Get embedding for the search query
      const queryEmbedding = await extractor(query, { pooling: 'mean', normalize: true });
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
          const topicEmbedding = await extractor(topicText, { pooling: 'mean', normalize: true });
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
      
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
    
    setIsSearching(false);
  };

  return {
    searchResults,
    search,
    isSearching
  };
};

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
