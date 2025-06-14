
-- Add types column to project_links table to store resource types
ALTER TABLE public.project_links 
ADD COLUMN types TEXT[];

-- Add a comment to document the column
COMMENT ON COLUMN public.project_links.types IS 'Array of resource types: Personal, Project';
