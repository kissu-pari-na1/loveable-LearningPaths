
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

export const AuthHeader: React.FC = () => {
  const { user, userRole, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleSignIn = () => {
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="p-4 border-b border-border">
        <div className="w-20 h-6 bg-muted animate-pulse rounded mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="p-4 border-b border-border">
      {user ? (
        <div className="space-y-2">
          <div className="flex items-center justify-center">
            <div className="text-sm font-medium text-center truncate max-w-full">
              {user.email}
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSignOut}
            className="w-full"
          >
            Sign Out
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground text-center">
            Sign in to access admin features
          </p>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleSignIn}
            className="w-full"
          >
            Sign In
          </Button>
        </div>
      )}
    </div>
  );
};
