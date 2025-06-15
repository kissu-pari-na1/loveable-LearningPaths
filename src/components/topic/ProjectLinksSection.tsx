
import React, { useState } from 'react';
import { Topic, ProjectLink } from '@/types/Topic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
} from '@/components/ui/alert-dialog';
import { ExternalLink, Plus, X, Link as LinkIcon, Globe, User, Briefcase } from 'lucide-react';

interface NewLinkData {
  title: string;
  url: string;
  description: string;
  types: ('Personal' | 'Project')[];
}

interface ProjectLinksSectionProps {
  topic: Topic;
  isAdminMode: boolean;
  showAddLink: boolean;
  newLink: NewLinkData;
  onToggleAddLink: () => void;
  onAddLink: () => void;
  onRemoveLink: (linkId: string) => void;
  onNewLinkChange: (field: keyof NewLinkData, value: string | ('Personal' | 'Project')[]) => void;
}

export const ProjectLinksSection: React.FC<ProjectLinksSectionProps> = ({
  topic,
  isAdminMode,
  showAddLink,
  newLink,
  onToggleAddLink,
  onAddLink,
  onRemoveLink,
  onNewLinkChange
}) => {
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; linkId: string; linkTitle: string }>({
    isOpen: false,
    linkId: '',
    linkTitle: ''
  });

  const handleDeleteClick = (linkId: string, linkTitle: string) => {
    setDeleteDialog({ isOpen: true, linkId, linkTitle });
  };

  const handleDeleteConfirm = () => {
    onRemoveLink(deleteDialog.linkId);
    setDeleteDialog({ isOpen: false, linkId: '', linkTitle: '' });
  };

  const handleTypeToggle = (type: 'Personal' | 'Project', checked: boolean) => {
    const currentTypes = newLink.types || [];
    let newTypes: ('Personal' | 'Project')[];
    
    if (checked) {
      newTypes = [...currentTypes, type];
    } else {
      newTypes = currentTypes.filter(t => t !== type);
    }
    
    onNewLinkChange('types', newTypes);
  };

  const getTypeIcon = (type: 'Personal' | 'Project') => {
    return type === 'Personal' ? User : Briefcase;
  };

  const getTypeColor = (type: 'Personal' | 'Project') => {
    return type === 'Personal' 
      ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-700' 
      : 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-700';
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
            <LinkIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Resources</h3>
            <p className="text-sm text-muted-foreground">
              {topic.projectLinks.length} resource{topic.projectLinks.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>
        {isAdminMode && (
          <Button 
            onClick={onToggleAddLink}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Resource
          </Button>
        )}
      </div>

      {/* Add Resource Form */}
      {showAddLink && (
        <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-3 text-foreground">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Plus className="w-4 h-4 text-primary" />
              </div>
              Add New Resource
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" />
                  Title *
                </label>
                <Input
                  placeholder="Enter resource title"
                  value={newLink.title}
                  onChange={(e) => onNewLinkChange('title', e.target.value)}
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5" />
                  URL *
                </label>
                <Input
                  placeholder="https://example.com"
                  value={newLink.url}
                  onChange={(e) => onNewLinkChange('url', e.target.value)}
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <Input
                placeholder="Brief description of the resource (optional)"
                value={newLink.description}
                onChange={(e) => onNewLinkChange('description', e.target.value)}
                className="bg-background border-input text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Resource Types</label>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="personal-new"
                    checked={newLink.types?.includes('Personal') || false}
                    onCheckedChange={(checked) => handleTypeToggle('Personal', checked as boolean)}
                  />
                  <label htmlFor="personal-new" className="text-sm font-medium cursor-pointer flex items-center gap-2 text-foreground">
                    <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    Personal
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="project-new"
                    checked={newLink.types?.includes('Project') || false}
                    onCheckedChange={(checked) => handleTypeToggle('Project', checked as boolean)}
                  />
                  <label htmlFor="project-new" className="text-sm font-medium cursor-pointer flex items-center gap-2 text-foreground">
                    <Briefcase className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                    Project
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <Button 
                onClick={onAddLink} 
                className="flex items-center gap-2"
                disabled={!newLink.title || !newLink.url}
              >
                <Plus className="w-4 h-4" />
                Add Resource
              </Button>
              <Button 
                variant="outline" 
                onClick={onToggleAddLink}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Resources List */}
      {topic.projectLinks.length === 0 ? (
        <Card className="border-dashed border-2 border-muted-foreground/20">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-4">
              <LinkIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">No resources yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md leading-relaxed">
              Start building your resource collection by adding links to helpful materials, documentation, or projects.
            </p>
            {isAdminMode && (
              <Button 
                onClick={onToggleAddLink} 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add First Resource
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {topic.projectLinks.map((link) => (
            <Card key={link.id} className="group hover:shadow-md transition-all duration-300 hover:border-primary/30 bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        onClick={() => window.open(link.url, '_blank', 'noopener noreferrer')}
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
                      >
                        <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/20">
                          <ExternalLink className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-primary hover:text-primary/80 transition-colors break-words group-hover:underline">
                          {link.title}
                        </span>
                      </div>
                    </div>
                    
                    {link.description && (
                      <p className="text-sm text-muted-foreground mb-3 break-words leading-relaxed pl-7">
                        {link.description}
                      </p>
                    )}
                    
                    {link.types && link.types.length > 0 && (
                      <div className="flex gap-2 flex-wrap pl-7">
                        {link.types.map((type) => {
                          const IconComponent = getTypeIcon(type);
                          return (
                            <Badge 
                              key={type} 
                              className={`text-xs font-medium px-2 py-1 border ${getTypeColor(type)} flex items-center gap-1`}
                            >
                              <IconComponent className="w-2.5 h-2.5" />
                              {type}
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  {isAdminMode && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(link.id, link.title);
                      }}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0 h-8 w-8 rounded-full p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.isOpen} onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, isOpen: open }))}>
        <AlertDialogContent className="bg-background border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Are you sure you want to delete this resource?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. This will permanently delete the resource "{deleteDialog.linkTitle}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-background text-foreground border-border hover:bg-muted">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Resource
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
