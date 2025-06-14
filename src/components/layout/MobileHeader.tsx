
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsTablet } from '@/hooks/use-mobile';

interface MobileHeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  sidebarContent: React.ReactNode;
  adminPanelContent?: React.ReactNode;
  showAdminButton?: boolean;
  isAdminPanelOpen?: boolean;
  setIsAdminPanelOpen?: (open: boolean) => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  sidebarContent,
  adminPanelContent,
  showAdminButton = false,
  isAdminPanelOpen = false,
  setIsAdminPanelOpen
}) => {
  const isTablet = useIsTablet();

  // Close admin panel when sidebar opens (mutual exclusion)
  const handleSidebarOpen = (open: boolean) => {
    setIsSidebarOpen(open);
    if (open && setIsAdminPanelOpen) {
      setIsAdminPanelOpen(false);
    }
  };

  // Close sidebar when admin panel opens (mutual exclusion)
  const handleAdminPanelOpen = (open: boolean) => {
    if (setIsAdminPanelOpen) {
      setIsAdminPanelOpen(open);
      if (open) {
        setIsSidebarOpen(false);
      }
    }
  };

  return (
    <div className="bg-card/95 backdrop-blur-xl border-b border-border/50 shadow-lg p-3 md:p-4 flex items-center justify-between">
      <Sheet open={isSidebarOpen} onOpenChange={handleSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="xl:hidden">
            <Menu className="h-5 w-5 md:h-6 md:w-6" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="left" 
          className={`p-0 ${isTablet ? 'w-96 max-w-[50vw]' : 'w-80'}`}
        >
          {sidebarContent}
        </SheetContent>
      </Sheet>

      <h1 className="text-base md:text-lg font-semibold">Learning Paths</h1>

      {showAdminButton && adminPanelContent && setIsAdminPanelOpen && (
        <Sheet open={isAdminPanelOpen} onOpenChange={handleAdminPanelOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs md:text-sm">
              Admin
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="right" 
            className={`p-0 ${isTablet ? 'w-96 max-w-[50vw]' : 'w-80'}`}
          >
            {adminPanelContent}
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};
