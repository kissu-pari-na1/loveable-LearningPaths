
import React from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  adminPanel?: React.ReactNode;
  showAdminPanel?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  sidebar,
  adminPanel,
  showAdminPanel = false
}) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-800">
        <div className="flex flex-col h-screen">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-800">
      <div className="flex h-screen">
        {user ? (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {sidebar && (
              <>
                <ResizablePanel 
                  defaultSize={showAdminPanel ? 25 : 30} 
                  minSize={15} 
                  maxSize={showAdminPanel ? 35 : 50}
                  className="md:min-w-[280px] lg:min-w-[320px]"
                >
                  {sidebar}
                </ResizablePanel>
                <ResizableHandle withHandle />
              </>
            )}

            <ResizablePanel 
              defaultSize={showAdminPanel ? 50 : 70}
              minSize={30}
              className="md:min-w-[400px] lg:min-w-[500px]"
            >
              {children}
            </ResizablePanel>

            {showAdminPanel && adminPanel && (
              <>
                <ResizableHandle withHandle />
                <ResizablePanel 
                  defaultSize={25} 
                  minSize={15} 
                  maxSize={40}
                  className="md:min-w-[280px] lg:min-w-[320px]"
                >
                  {adminPanel}
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        ) : (
          <div className="flex flex-col h-full w-full">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
