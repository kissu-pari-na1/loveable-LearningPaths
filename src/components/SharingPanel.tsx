import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Mail } from 'lucide-react';
import { SharedLearningPath, useSharedLearningPaths } from '@/hooks/useSharedLearningPaths';
import { useToast } from '@/hooks/use-toast';

interface SharingPanelProps {
  isOwner: boolean;
}

export const SharingPanel: React.FC<SharingPanelProps> = ({ isOwner }) => {
  const { sharedPaths, shareWithUser, updatePermission, removeShare } = useSharedLearningPaths();
  const { toast } = useToast();
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPermission, setNewUserPermission] = useState<'viewer' | 'admin'>('viewer');
  const [isSharing, setIsSharing] = useState(false);

  if (!isOwner) {
    return null;
  }

  const ownedShares = sharedPaths.filter(share => share.owner_id === share.owner_id);

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
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Mail className="w-4 h-4" />
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
          />
          <Select value={newUserPermission} onValueChange={(value: 'viewer' | 'admin') => setNewUserPermission(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viewer">Viewer (View only)</SelectItem>
              <SelectItem value="admin">Admin (View & Edit)</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={handleShare} 
            className="w-full"
            disabled={isSharing}
          >
            {isSharing ? 'Sharing...' : 'Share'}
          </Button>
        </div>

        {/* Existing shares */}
        {ownedShares.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Shared with:</h4>
            {ownedShares.map((share) => (
              <div key={share.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{share.owner_email}</span>
                  <Badge variant="outline" className="text-xs">
                    {share.permission_level}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Select
                    value={share.permission_level}
                    onValueChange={(value: 'viewer' | 'admin') => handleUpdatePermission(share.id, value)}
                  >
                    <SelectTrigger className="w-20 h-8">
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
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
