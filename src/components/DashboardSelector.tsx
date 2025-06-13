
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LearningPathAccess } from '@/hooks/useSharedLearningPaths';

interface DashboardSelectorProps {
  availablePaths: LearningPathAccess[];
  selectedPathUserId: string;
  onPathSelect: (userId: string) => void;
  loading: boolean;
}

export const DashboardSelector: React.FC<DashboardSelectorProps> = ({
  availablePaths,
  selectedPathUserId,
  onPathSelect,
  loading
}) => {
  if (loading || availablePaths.length <= 1) {
    return null;
  }

  return (
    <div className="p-4 border-b border-border">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Dashboard</label>
        <Select value={selectedPathUserId} onValueChange={onPathSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select dashboard" />
          </SelectTrigger>
          <SelectContent>
            {availablePaths.map((path) => (
              <SelectItem key={path.user_id} value={path.user_id}>
                <div className="flex items-center gap-2">
                  <span>{path.user_email}</span>
                  <Badge variant={path.is_owner ? "default" : "secondary"} className="text-xs">
                    {path.is_owner ? "Owner" : path.permission_level}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
