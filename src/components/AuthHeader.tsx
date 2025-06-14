
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, LogIn, Crown, Shield } from 'lucide-react';

export const AuthHeader: React.FC = () => {
  const { user, userRole, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleSignIn = () => {
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6 border-t border-gradient-to-r from-violet-200/30 via-purple-200/30 to-blue-200/30">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-violet-200/50 to-blue-200/50 animate-pulse rounded-full"></div>
          <div className="space-y-2 flex-1">
            <div className="w-full max-w-32 h-4 bg-gradient-to-r from-violet-200/50 to-blue-200/50 animate-pulse rounded"></div>
            <div className="w-full max-w-20 h-3 bg-gradient-to-r from-violet-200/50 to-blue-200/50 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden border-t border-gradient-to-r from-violet-200/30 via-purple-200/30 to-blue-200/30">
      {/* Background gradient and effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-blue-500/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,69,19,0.1),transparent_50%)]" />
      
      <div className="relative z-10 p-4 lg:p-6">
        {user ? (
          <div className="space-y-4">
            {/* User info section */}
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-3 lg:space-x-4 bg-white/70 dark:bg-black/20 backdrop-blur-xl rounded-2xl p-3 lg:p-4 border border-white/20 shadow-xl w-full max-w-sm">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-violet-400 via-purple-400 to-blue-400 rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  {/* Role indicator */}
                  {userRole === 'admin' && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 lg:w-6 lg:h-6 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-md">
                      <Crown className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" />
                    </div>
                  )}
                  {userRole === 'owner' && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 lg:w-6 lg:h-6 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full flex items-center justify-center shadow-md">
                      <Shield className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" />
                    </div>
                  )}
                </div>
                
                {/* User details */}
                <div className="flex-1 min-w-0 text-center">
                  <div className="text-xs lg:text-sm font-semibold text-gray-800 dark:text-gray-100 truncate max-w-full mb-1">
                    {user.email}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sign out button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="w-full bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/30 hover:bg-white/70 dark:hover:bg-black/30 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <LogOut className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Welcome section for non-authenticated users */}
            <div className="text-center">
              <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 bg-gradient-to-br from-violet-400 via-purple-400 to-blue-400 rounded-full flex items-center justify-center shadow-xl">
                <User className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-300 mb-1 font-medium">
                Welcome to Learning Paths
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Sign in to unlock all features
              </p>
            </div>
            
            {/* Sign in button */}
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleSignIn}
              className="w-full bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 hover:from-violet-600 hover:via-purple-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <LogIn className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
              Sign In
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
