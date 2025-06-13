-- Create a security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY INVOKER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;


-- Create function to check if user has access to a learning path
CREATE OR REPLACE FUNCTION public.has_learning_path_access(_user_id uuid, _owner_id uuid, _required_permission text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY INVOKER
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