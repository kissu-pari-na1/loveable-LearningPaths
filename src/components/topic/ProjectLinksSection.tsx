
import React from 'react';
import { Topic, ProjectLink } from '@/types/Topic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Plus, X, Link as LinkIcon } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <LinkIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">Resources</h3>
            <p className="text-sm text-muted-foreground">
              {topic.projectLinks.length} resource{topic.projectLinks.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>
        {isAdminMode && (
          <Button 
            onClick={onToggleAddLink}
            className="flex items-center gap-2"
            size="sm"
          >
            <Plus className="w-4 h-4" />
            Add Resource
          </Button>
        )}
      </div>

      {/* Add Resource Form */}
      {showAddLink && (
        <Card className="border-2 border-dashed border-primary/20 bg-primary/5">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Resource
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Title *</label>
                <Input
                  placeholder="Enter resource title"
                  value={newLink.title}
                  onChange={(e) => onNewLinkChange('title', e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">URL *</label>
                <Input
                  placeholder="https://example.com"
                  value={newLink.url}
                  onChange={(e) => onNewLinkChange('url', e.target.value)}
                  className="bg-background"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <Input
                placeholder="Brief description of the resource (optional)"
                value={newLink.description}
                onChange={(e) => onNewLinkChange('description', e.target.value)}
                className="bg-background"
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
                  <label htmlFor="personal-new" className="text-sm font-medium cursor-pointer">
                    Personal
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="project-new"
                    checked={newLink.types?.includes('Project') || false}
                    onCheckedChange={(checked) => handleTypeToggle('Project', checked as boolean)}
                  />
                  <label htmlFor="project-new" className="text-sm font-medium cursor-pointer">
                    Project
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
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
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <LinkIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No resources yet</h3>
            <p className="text-muted-foreground mb-4 max-w-sm">
              Start building your resource collection by adding links to helpful materials, documentation, or projects.
            </p>
            {isAdminMode && (
              <Button onClick={onToggleAddLink} variant="outline" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add First Resource
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {topic.projectLinks.map((link) => (
            <Card key={link.id} className="group hover:shadow-md transition-all duration-200 hover:border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-primary hover:text-primary/80 transition-colors break-words group-hover:underline"
                      >
                        {link.title}
                      </a>
                    </div>
                    
                    {link.description && (
                      <p className="text-muted-foreground mb-3 break-words leading-relaxed">
                        {link.description}
                      </p>
                    )}
                    
                    {link.types && link.types.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {link.types.map((type) => (
                          <Badge 
                            key={type} 
                            variant="secondary" 
                            className="text-xs font-medium px-2 py-1"
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {isAdminMode && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onRemoveLink(link.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
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
    </div>
  );
};
