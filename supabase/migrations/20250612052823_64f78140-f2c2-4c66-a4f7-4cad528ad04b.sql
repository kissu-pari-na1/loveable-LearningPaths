
-- Create a table for topics in Supabase
CREATE TABLE public.topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for project links
CREATE TABLE public.project_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_links ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for topics
CREATE POLICY "Users can view their own topics" 
  ON public.topics 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own topics" 
  ON public.topics 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own topics" 
  ON public.topics 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own topics" 
  ON public.topics 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for project links
CREATE POLICY "Users can view their own project links" 
  ON public.project_links 
  FOR SELECT 
  USING (auth.uid() = (SELECT user_id FROM public.topics WHERE id = topic_id));

CREATE POLICY "Users can create their own project links" 
  ON public.project_links 
  FOR INSERT 
  WITH CHECK (auth.uid() = (SELECT user_id FROM public.topics WHERE id = topic_id));

CREATE POLICY "Users can update their own project links" 
  ON public.project_links 
  FOR UPDATE 
  USING (auth.uid() = (SELECT user_id FROM public.topics WHERE id = topic_id));

CREATE POLICY "Users can delete their own project links" 
  ON public.project_links 
  FOR DELETE 
  USING (auth.uid() = (SELECT user_id FROM public.topics WHERE id = topic_id));
