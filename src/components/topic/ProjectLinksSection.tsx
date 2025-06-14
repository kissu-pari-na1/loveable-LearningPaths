
import React from 'react';
import { Topic, ProjectLink } from '@/types/Topic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

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
    <Card className="mb-6">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="text-lg lg:text-xl">Resources</CardTitle>
          {isAdminMode && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onToggleAddLink}
              className="w-full sm:w-auto"
            >
              Add Resource
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showAddLink && (
          <div className="mb-4 p-4 border border-dashed border-border rounded-lg">
            <div className="space-y-3">
              <Input
                placeholder="Resource title"
                value={newLink.title}
                onChange={(e) => onNewLinkChange('title', e.target.value)}
              />
              <Input
                placeholder="URL"
                value={newLink.url}
                onChange={(e) => onNewLinkChange('url', e.target.value)}
              />
              <Input
                placeholder="Description (optional)"
                value={newLink.description}
                onChange={(e) => onNewLinkChange('description', e.target.value)}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">Resource types (optional):</label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="personal"
                      checked={newLink.types?.includes('Personal') || false}
                      onCheckedChange={(checked) => handleTypeToggle('Personal', checked as boolean)}
                    />
                    <label htmlFor="personal" className="text-sm">Personal</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="project"
                      checked={newLink.types?.includes('Project') || false}
                      onCheckedChange={(checked) => handleTypeToggle('Project', checked as boolean)}
                    />
                    <label htmlFor="project" className="text-sm">Project</label>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={onAddLink} className="w-full sm:w-auto">Add</Button>
                <Button variant="outline" onClick={onToggleAddLink} className="w-full sm:w-auto">Cancel</Button>
              </div>
            </div>
          </div>
        )}
        
        {topic.projectLinks.length === 0 ? (
          <p className="text-muted-foreground">No resources added yet.</p>
        ) : (
          <div className="space-y-3">
            {topic.projectLinks.map((link) => (
              <div key={link.id} className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium break-words"
                      >
                        {link.title}
                      </a>
                      {link.types && link.types.length > 0 && (
                        <div className="flex gap-1">
                          {link.types.map((type) => (
                            <Badge key={type} variant="secondary" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    {link.description && (
                      <p className="text-sm text-muted-foreground mt-1 break-words">{link.description}</p>
                    )}
                  </div>
                  {isAdminMode && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onRemoveLink(link.id)}
                      className="text-destructive hover:text-destructive w-full sm:w-auto mt-2 sm:mt-0"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
