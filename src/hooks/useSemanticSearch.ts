
import { useState, useEffect, useCallback } from 'react';
import { pipeline } from '@huggingface/transformers';
import { Topic, SearchResult } from '@/types/Topic';

export const useSemanticSearch = (topics: Topic[]) => {
  const [extractor, setExtractor] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeExtractor = async () => {
      try {
        console.log('Initializing semantic search model...');
        const extractorPipeline = await pipeline(
          'feature-extraction',
          'Xenova/all-MiniLM-L6-v2',
          { device: 'webgpu' }
        );
        setExtractor(extractorPipeline);
        console.log('Semantic search model initialized successfully');
      } catch (error) {
        console.error('Failed to initialize semantic search:', error);
        // Fallback to CPU if WebGPU fails
        try {
          const extractorPipeline = await pipeline(
            'feature-extraction',
            'Xenova/all-MiniLM-L6-v2'
          );
          setExtractor(extractorPipeline);
          console.log('Semantic search model initialized with CPU fallback');
        } catch (cpuError) {
          console.error('Failed to initialize semantic search with CPU:', cpuError);
        }
      } finally {
        setIsInitializing(false);
      }
    };

    initializeExtractor();
  }, []);

  const flattenTopics = useCallback((topics: Topic[]): Topic[] => {
    const result: Topic[] = [];
    
    const traverse = (topicList: Topic[]) => {
      for (const topic of topicList) {
        result.push(topic);
        if (topic.childTopics.length > 0) {
          traverse(topic.childTopics);
        }
      }
    };
    
    traverse(topics);
    return result;
  }, []);

  const getTopicEmbedding = async (topic: Topic): Promise<number[]> => {
    if (!extractor) return [];
    
    const text = `${topic.name} ${topic.description} ${topic.projectLinks.map(link => `${link.title} ${link.description}`).join(' ')}`;
    
    try {
      const embedding = await extractor(text, { pooling: 'mean', normalize: true });
      return Array.from(embedding.data);
    } catch (error) {
      console.error('Error generating embedding:', error);
      return [];
    }
  };

  const calculateSimilarity = (embedding1: number[], embedding2: number[]): number => {
    if (embedding1.length !== embedding2.length || embedding1.length === 0) {
      return 0;
    }

    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      magnitude1 += embedding1[i] * embedding1[i];
      magnitude2 += embedding2[i] * embedding2[i];
    }

    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);

    if (magnitude1 === 0 || magnitude2 === 0) {
      return 0;
    }

    return dotProduct / (magnitude1 * magnitude2);
  };

  const search = async (query: string) => {
    if (!extractor || !query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const queryEmbedding = await extractor(query, { pooling: 'mean', normalize: true });
      const queryVector = Array.from(queryEmbedding.data);
      
      const flatTopics = flattenTopics(topics);
      const results: SearchResult[] = [];

      for (const topic of flatTopics) {
        const topicEmbedding = await getTopicEmbedding(topic);
        const similarity = calculateSimilarity(queryVector, topicEmbedding);
        
        // Also check for exact text matches for better results
        const textMatch = (
          topic.name.toLowerCase().includes(query.toLowerCase()) ||
          topic.description.toLowerCase().includes(query.toLowerCase()) ||
          topic.projectLinks.some(link => 
            link.title.toLowerCase().includes(query.toLowerCase()) ||
            (link.description && link.description.toLowerCase().includes(query.toLowerCase()))
          )
        );

        const finalSimilarity = textMatch ? Math.max(similarity, 0.8) : similarity;

        if (finalSimilarity > 0.3) { // Threshold for relevance
          results.push({
            ...topic,
            similarity: finalSimilarity,
            matchedIn: textMatch 
              ? (topic.name.toLowerCase().includes(query.toLowerCase()) ? 'name' : 'description')
              : undefined
          });
        }
      }

      results.sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
      setSearchResults(results.slice(0, 20)); // Limit to top 20 results

    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchResults,
    search,
    isSearching,
    isInitializing,
    isReady: !isInitializing && extractor !== null
  };
};
