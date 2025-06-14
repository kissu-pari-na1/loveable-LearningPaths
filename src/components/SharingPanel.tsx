
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2, Mail, Share2 } from 'lucide-react';
import { SharedLearningPath, useSharedLearningPaths } from '@/hooks/useSharedLearningPaths';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface SharingPanelProps {
  isOwner: boolean;
}

export const SharingPanel: React.FC<SharingPanelProps> = ({ isOwner }) => {
  const { user } = useAuth();
  const { sharedPaths, shareWithUser, updatePermission, removeShare } = useSharedLearningPaths();
  const { toast } = useToast();
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPermission, setNewUserPermission] = useState<'viewer' | 'admin'>('viewer');
  const [isSharing, setIsSharing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const [permissionWarningOpen, setPermissionWarningOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'share' | 'update';
    shareId?: string;
    email?: string;
    permission: 'viewer' | 'admin';
    currentPermission?: 'viewer' | 'admin';
  } | null>(null);

  if (!isOwner) {
    return null;
  }

  // Filter to show only shares where current user is the owner (shares they created)
  const ownedShares = sharedPaths.filter(share => share.owner_id === user?.id);

  const handleShare = async () => {
    if (!newUserEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    // Show warning for both viewer and admin permissions
    setPendingAction({ 
      type: 'share', 
      email: newUserEmail.trim(), 
      permission: newUserPermission 
    });
    setPermissionWarningOpen(true);
  };

  const executeShare = async (email: string, permission: 'viewer' | 'admin') => {
    setIsSharing(true);
    const { error } = await shareWithUser(email, permission);
    
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Learning path shared successfully",
      });
      setNewUserEmail('');
      setNewUserPermission('viewer');
    }
    setIsSharing(false);
  };

  const handleUpdatePermission = async (shareId: string, permission: 'viewer' | 'admin') => {
    const currentShare = ownedShares.find(share => share.id === shareId);
    const currentPermission = currentShare?.permission_level;
    
    // Show warning for both viewer and admin permission changes
    setPendingAction({ 
      type: 'update', 
      shareId, 
      permission, 
      currentPermission 
    });
    setPermissionWarningOpen(true);
  };

  const handlePermissionConfirm = async () => {
    if (pendingAction) {
      if (pendingAction.type === 'share' && pendingAction.email) {
        await executeShare(pendingAction.email, pendingAction.permission);
      } else if (pendingAction.type === 'update' && pendingAction.shareId) {
        await updatePermission(pendingAction.shareId, pendingAction.permission);
        toast({
          title: "Success",
          description: "Permission updated successfully",
        });
      }
    }
    setPermissionWarningOpen(false);
    setPendingAction(null);
  };

  const handleRemoveShare = async (shareId: string) => {
    await removeShare(shareId);
    setDeleteDialogOpen(null);
    toast({
      title: "Success",
      description: "Share removed successfully",
    });
  };

  const getPermissionWarningContent = () => {
    if (!pendingAction) return { title: '', description: '', buttonText: '', buttonClass: '' };

    const isUpdate = pendingAction.type === 'update';
    const isAdminPermission = pendingAction.permission === 'admin';
    const isDowngradeFromAdmin = isUpdate && pendingAction.currentPermission === 'admin' && pendingAction.permission === 'viewer';

    if (isAdminPermission) {
      return {
        title: isUpdate ? 'Change to Admin Access?' : 'Grant Admin Access?',
        description: (
          <>
            {isUpdate ? 'You are about to change this user\'s access to admin.' : 'You are about to grant admin access to this user.'} Admin users will be able to:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Add new topics and subtopics</li>
              <li>Edit existing topics and descriptions</li>
              <li>Delete topics and all their subtopics</li>
              <li>Add, edit, and delete resources</li>
              <li>Move topics within the learning path</li>
            </ul>
            This gives them full control over your learning path content. Are you sure you want to proceed?
          </>
        ),
        buttonText: isUpdate ? 'Change to Admin' : 'Grant Admin Access',
        buttonClass: 'bg-orange-500 text-white hover:bg-orange-600'
      };
    } else if (isDowngradeFromAdmin) {
      return {
        title: 'Downgrade to Viewer Access?',
        description: (
          <>
            You are about to downgrade this user from admin to viewer access. They will lose the ability to:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Add new topics and subtopics</li>
              <li>Edit existing topics and descriptions</li>
              <li>Delete topics and all their subtopics</li>
              <li>Add, edit, and delete resources</li>
              <li>Move topics within the learning path</li>
            </ul>
            They will only have read-only access to your learning path content. Are you sure you want to proceed?
          </>
        ),
        buttonText: 'Downgrade to Viewer',
        buttonClass: 'bg-yellow-500 text-white hover:bg-yellow-600'
      };
    } else {
      return {
        title: isUpdate ? 'Confirm Viewer Access' : 'Grant Viewer Access?',
        description: (
          <>
            {isUpdate ? 'This user will have viewer access.' : 'You are about to grant viewer access to this user.'} Viewer users will be able to:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>View all topics and subtopics in your learning path</li>
              <li>View topic descriptions and details</li>
              <li>View all resources and project links</li>
              <li>Browse through your learning path structure</li>
            </ul>
            They will have read-only access to your learning path content. Are you sure you want to proceed?
          </>
        ),
        buttonText: isUpdate ? 'Confirm Viewer Access' : 'Grant Viewer Access',
        buttonClass: 'bg-blue-500 text-white hover:bg-blue-600'
      };
    }
  };

  const warningContent = getPermissionWarningContent();

  return (
    <>
      <Card className="border border-emerald-200/50 bg-gradient-to-br from-emerald-50/50 to-green-50/50 dark:from-emerald-900/20 dark:to-green-900/20 shadow-lg backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
            <Share2 className="w-3 h-3" />
            Share Learning Path
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Add new share */}
          <div className="space-y-2">
            <Input
              placeholder="Email address"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              type="email"
              className="border-emerald-200/50 focus:border-emerald-400 text-xs h-8"
            />
            <Select value={newUserPermission} onValueChange={(value: 'viewer' | 'admin') => setNewUserPermission(value)}>
              <SelectTrigger className="border-emerald-200/50 focus:border-emerald-400 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Viewer (View only)</SelectItem>
                <SelectItem value="admin">Admin (View & Edit)</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={handleShare} 
              className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-md h-8 text-xs"
              disabled={isSharing}
            >
              <Mail className="w-3 h-3 mr-1" />
              {isSharing ? 'Sharing...' : 'Share'}
            </Button>
          </div>

          {/* Existing shares */}
          {ownedShares.length > 0 && (
            <div className="space-y-2 pt-1">
              <h4 className="text-xs font-medium text-emerald-700 dark:text-emerald-300 border-t border-emerald-200/30 pt-2">
                Shared with:
              </h4>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {ownedShares.map((share) => (
                  <div key={share.id} className="flex items-center justify-between p-2 border border-emerald-200/50 rounded-md bg-white/50 dark:bg-black/20 backdrop-blur-sm">
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1 mr-2">
                      <span className="text-xs font-medium truncate">
                        {share.shared_with_email || 'Unknown User'}
                      </span>
                      <Badge variant="outline" className="text-xs w-fit border-emerald-300/50 bg-emerald-50/50 text-emerald-600 px-1 py-0">
                        {share.permission_level}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Select
                        value={share.permission_level}
                        onValueChange={(value: 'viewer' | 'admin') => handleUpdatePermission(share.id, value)}
                      >
                        <SelectTrigger className="w-16 h-6 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="viewer">Viewer</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <AlertDialog open={deleteDialogOpen === share.id} onOpenChange={(open) => setDeleteDialogOpen(open ? share.id : null)}>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove access for this user?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently revoke access to your learning path for "{share.shared_with_email || 'Unknown User'}". 
                              They will no longer be able to view or edit your topics and resources.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleRemoveShare(share.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Remove Access
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Permission Warning Dialog */}
      <AlertDialog open={permissionWarningOpen} onOpenChange={setPermissionWarningOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{warningContent.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {warningContent.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingAction(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handlePermissionConfirm}
              className={warningContent.buttonClass}
            >
              {warningContent.buttonText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
