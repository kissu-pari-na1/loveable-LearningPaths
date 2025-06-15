
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
    <div className="relative p-4 border-t border-border/50 bg-gradient-to-r from-primary/5 to-purple-100/30 dark:from-primary/10 dark:to-purple-950/30 backdrop-blur-sm">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
      
      <div className="relative space-y-4">
        {/* Theme Toggle Section */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-background/60 to-muted/30 border border-primary/20 shadow-sm hover:shadow-md transition-all duration-200">
          <span className="text-sm font-medium text-foreground/80">Theme</span>
          <ThemeToggle />
        </div>
        
        {/* User Info and Sign Out Section */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-background/60 to-muted/30 border border-primary/20 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center shadow-sm">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-medium text-foreground truncate block">
                {user.email}
              </span>
              <span className="text-xs text-muted-foreground">Signed in</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onSignOut}
            className="h-8 w-8 p-0 border-destructive/30 hover:border-destructive bg-gradient-to-r from-background/80 to-background/60 hover:from-destructive/10 hover:to-red-50/30 dark:hover:to-red-950/30 transition-all duration-200 shadow-sm hover:shadow-md group"
          >
            <LogOut className="h-4 w-4 text-destructive group-hover:text-destructive transition-colors" />
            <span className="sr-only">Sign out</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
