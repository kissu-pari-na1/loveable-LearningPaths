
export interface Topic {
  id: string;
  name: string;
  description: string;
  projectLinks: ProjectLink[];
  childTopics: Topic[];
  parentId?: string;
  embedding?: number[];
}

export interface ProjectLink {
  id: string;
  title: string;
  url: string;
  description?: string;
}

export interface SearchResult extends Topic {
  similarity?: number;
  matchedIn?: 'name' | 'description' | 'projectLinks';
}
