
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';

interface AuthHeaderProps {
  onSignOut?: () => void;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ onSignOut }) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="p-4 border-t border-border space-y-3">
      {/* Theme Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Theme</span>
        <ThemeToggle />
      </div>
      
      {/* User Info and Sign Out */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm text-muted-foreground truncate">
            {user.email}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSignOut}
          className="flex-shrink-0 h-8 w-8 p-0"
        >
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Sign out</span>
        </Button>
      </div>
    </div>
  );
};
