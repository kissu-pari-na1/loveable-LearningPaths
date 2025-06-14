
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

interface WelcomeScreenProps {
  user: any;
  userPermission?: string;
  onSignIn?: () => void;
  isMobile?: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  user,
  userPermission,
  onSignIn,
  isMobile = false
}) => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background/50 to-muted/30 backdrop-blur-sm p-6">
      <div className={`text-center max-w-md mx-auto ${isMobile ? '' : 'p-8'}`}>
        <div className={`mx-auto mb-6 bg-gradient-to-br from-violet-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl ${
          isMobile ? 'w-24 h-24' : 'w-32 h-32'
        }`}>
          <svg className={`text-white ${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h2 className={`font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent mb-4 ${
          isMobile ? 'text-2xl' : 'text-3xl'
        }`}>
          Welcome to Learning Paths
        </h2>
        <p className={`text-muted-foreground leading-relaxed ${isMobile ? '' : 'text-lg'} ${!user ? 'mb-6' : ''}`}>
          {user ? (
            isMobile ? (
              <>Tap the menu to explore topics and begin your learning journey.</>
            ) : (
              <>Discover knowledge through beautifully organized learning paths. Select a topic to begin your journey of exploration.</>
            )
          ) : (
            <>Join our community of learners. Sign in to unlock {isMobile ? 'personalized learning paths' : 'the full potential of personalized learning paths'}.</>
          )}
        </p>
        {!user && onSignIn && (
          <Button 
            variant="default" 
            size="lg" 
            onClick={onSignIn}
            className="bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 hover:from-violet-600 hover:via-purple-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <LogIn className={`mr-2 group-hover:translate-x-1 transition-transform duration-300 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
            Sign In
          </Button>
        )}
        {user && userPermission && userPermission !== 'owner' && (
          <p className="text-sm text-violet-600 dark:text-violet-400 mt-4 px-4 py-2 bg-violet-50 dark:bg-violet-900/30 rounded-full">
            You have {userPermission} access{isMobile ? '' : ' to this learning path'}
          </p>
        )}
      </div>
    </div>
  );
};
