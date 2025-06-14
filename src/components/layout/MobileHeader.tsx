
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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
  return (
    <div className="bg-card/95 backdrop-blur-xl border-b border-border/50 shadow-lg p-4 flex items-center justify-between">
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          {sidebarContent}
        </SheetContent>
      </Sheet>

      <h1 className="text-lg font-semibold">Learning Paths</h1>

      {showAdminButton && adminPanelContent && setIsAdminPanelOpen && (
        <Sheet open={isAdminPanelOpen} onOpenChange={setIsAdminPanelOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              Admin
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 p-0">
            {adminPanelContent}
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};
