import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
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

    setIsSharing(true);
    const { error } = await shareWithUser(newUserEmail.trim(), newUserPermission);
    
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
    await updatePermission(shareId, permission);
    toast({
      title: "Success",
      description: "Permission updated successfully",
    });
  };

  const handleRemoveShare = async (shareId: string) => {
    await removeShare(shareId);
    toast({
      title: "Success",
      description: "Share removed successfully",
    });
  };

  return (
    <Card className="border border-emerald-200/50 bg-gradient-to-br from-emerald-50/50 to-green-50/50 dark:from-emerald-900/20 dark:to-green-900/20 shadow-lg backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
          <Share2 className="w-4 h-4" />
          Share Learning Path
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new share */}
        <div className="space-y-3">
          <Input
            placeholder="Email address"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            type="email"
            className="border-emerald-200/50 focus:border-emerald-400 text-sm"
          />
          <Select value={newUserPermission} onValueChange={(value: 'viewer' | 'admin') => setNewUserPermission(value)}>
            <SelectTrigger className="border-emerald-200/50 focus:border-emerald-400">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viewer">Viewer (View only)</SelectItem>
              <SelectItem value="admin">Admin (View & Edit)</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={handleShare} 
            className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-md"
            disabled={isSharing}
          >
            <Mail className="w-4 h-4 mr-2" />
            {isSharing ? 'Sharing...' : 'Share'}
          </Button>
        </div>

        {/* Existing shares */}
        {ownedShares.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-medium text-emerald-700 dark:text-emerald-300 border-t border-emerald-200/30 pt-3">
              Shared with:
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {ownedShares.map((share) => (
                <div key={share.id} className="flex items-center justify-between p-3 border border-emerald-200/50 rounded-lg bg-white/50 dark:bg-black/20 backdrop-blur-sm">
                  <div className="flex flex-col gap-1 min-w-0 flex-1 mr-2">
                    <span className="text-sm font-medium truncate">
                      {share.shared_with_email || 'Unknown User'}
                    </span>
                    <Badge variant="outline" className="text-xs w-fit border-emerald-300/50 bg-emerald-50/50 text-emerald-600">
                      {share.permission_level}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Select
                      value={share.permission_level}
                      onValueChange={(value: 'viewer' | 'admin') => handleUpdatePermission(share.id, value)}
                    >
                      <SelectTrigger className="w-20 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">Viewer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveShare(share.id)}
                      className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
