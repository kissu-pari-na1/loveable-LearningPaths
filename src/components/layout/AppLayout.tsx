
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
                <ResizablePanel defaultSize={28} minSize={20} maxSize={75}>
                  {sidebar}
                </ResizablePanel>
                <ResizableHandle withHandle />
              </>
            )}

            <ResizablePanel defaultSize={showAdminPanel ? 50 : 75}>
              {children}
            </ResizablePanel>

            {showAdminPanel && adminPanel && (
              <>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
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
