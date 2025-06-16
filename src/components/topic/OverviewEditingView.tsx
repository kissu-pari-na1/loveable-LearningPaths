
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit3 } from 'lucide-react';

interface OverviewEditingViewProps {
  editForm: { name: string; description: string };
  onSave: () => void;
  onCancel: () => void;
  onEditFormChange: (field: 'name' | 'description', value: string) => void;
}

export const OverviewEditingView: React.FC<OverviewEditingViewProps> = ({
  editForm,
  onSave,
  onCancel,
  onEditFormChange
}) => {
  return (
    <div className="space-y-4">
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-white to-purple-50/30 dark:bg-slate-800 dark:border-primary/40 shadow-lg">
        <CardContent className="p-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Edit3 className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-medium bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-purple-400 bg-clip-text text-transparent">Edit Topic</h3>
            </div>
            <Input
              value={editForm.name}
              onChange={(e) => onEditFormChange('name', e.target.value)}
              placeholder="Topic name"
              className="text-lg font-medium border-2 border-primary/30 focus:border-primary focus:ring-primary/20 bg-white/80 dark:bg-slate-700 dark:border-slate-500 shadow-sm"
            />
            <Textarea
              value={editForm.description}
              onChange={(e) => onEditFormChange('description', e.target.value)}
              placeholder="Topic description"
              rows={3}
              className="border-2 border-primary/30 focus:border-primary focus:ring-primary/20 text-sm bg-white/80 dark:bg-slate-700 dark:border-slate-500 shadow-sm"
            />
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button onClick={onSave} className="w-full sm:w-auto bg-gradient-to-r from-primary to-green-500 hover:from-primary/90 hover:to-green-600 text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                Save Changes
              </Button>
              <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200">
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
