
-- Create a table for shared learning paths
CREATE TABLE public.shared_learning_paths (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  shared_with_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  permission_level TEXT NOT NULL CHECK (permission_level IN ('viewer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(owner_id, shared_with_id)
);

-- Enable Row Level Security
ALTER TABLE public.shared_learning_paths ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for shared learning paths
CREATE POLICY "Users can view shares they own or are shared with" 
  ON public.shared_learning_paths 
  FOR SELECT 
  USING (auth.uid() = owner_id OR auth.uid() = shared_with_id);

CREATE POLICY "Users can create shares for their own learning paths" 
  ON public.shared_learning_paths 
  FOR INSERT 
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update shares they own" 
  ON public.shared_learning_paths 
  FOR UPDATE 
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete shares they own" 
  ON public.shared_learning_paths 
  FOR DELETE 
  USING (auth.uid() = owner_id);

-- Update topics RLS policies to include shared access
DROP POLICY IF EXISTS "Users can view their own topics" ON public.topics;
DROP POLICY IF EXISTS "Users can create their own topics" ON public.topics;
DROP POLICY IF EXISTS "Users can update their own topics" ON public.topics;
DROP POLICY IF EXISTS "Users can delete their own topics" ON public.topics;

-- Create function to check if user has access to a learning path
CREATE OR REPLACE FUNCTION public.has_learning_path_access(_user_id uuid, _owner_id uuid, _required_permission text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT 
    _user_id = _owner_id OR -- Owner has full access
    EXISTS (
      SELECT 1 
      FROM public.shared_learning_paths 
      WHERE owner_id = _owner_id 
        AND shared_with_id = _user_id 
        AND (_required_permission = 'viewer' OR permission_level = 'admin')
    );
$$;

-- New topics RLS policies with shared access
CREATE POLICY "Users can view topics they own or have access to" 
  ON public.topics 
  FOR SELECT 
  USING (public.has_learning_path_access(auth.uid(), user_id, 'viewer'));

CREATE POLICY "Users can create topics they own or have admin access to" 
  ON public.topics 
  FOR INSERT 
  WITH CHECK (public.has_learning_path_access(auth.uid(), user_id, 'admin'));

CREATE POLICY "Users can update topics they own or have admin access to" 
  ON public.topics 
  FOR UPDATE 
  USING (public.has_learning_path_access(auth.uid(), user_id, 'admin'));

CREATE POLICY "Users can delete topics they own or have admin access to" 
  ON public.topics 
  FOR DELETE 
  USING (public.has_learning_path_access(auth.uid(), user_id, 'admin'));

-- Update project links RLS policies
DROP POLICY IF EXISTS "Users can view their own project links" ON public.project_links;
DROP POLICY IF EXISTS "Users can create their own project links" ON public.project_links;
DROP POLICY IF EXISTS "Users can update their own project links" ON public.project_links;
DROP POLICY IF EXISTS "Users can delete their own project links" ON public.project_links;

CREATE POLICY "Users can view project links they have access to" 
  ON public.project_links 
  FOR SELECT 
  USING (
    public.has_learning_path_access(
      auth.uid(), 
      (SELECT user_id FROM public.topics WHERE id = topic_id), 
      'viewer'
    )
  );

CREATE POLICY "Users can create project links they have admin access to" 
  ON public.project_links 
  FOR INSERT 
  WITH CHECK (
    public.has_learning_path_access(
      auth.uid(), 
      (SELECT user_id FROM public.topics WHERE id = topic_id), 
      'admin'
    )
  );

CREATE POLICY "Users can update project links they have admin access to" 
  ON public.project_links 
  FOR UPDATE 
  USING (
    public.has_learning_path_access(
      auth.uid(), 
      (SELECT user_id FROM public.topics WHERE id = topic_id), 
      'admin'
    )
  );

CREATE POLICY "Users can delete project links they have admin access to" 
  ON public.project_links 
  FOR DELETE 
  USING (
    public.has_learning_path_access(
      auth.uid(), 
      (SELECT user_id FROM public.topics WHERE id = topic_id), 
      'admin'
    )
  );
