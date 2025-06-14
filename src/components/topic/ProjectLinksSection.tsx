
import React from 'react';
import { Topic, ProjectLink } from '@/types/Topic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface NewLinkData {
  title: string;
  url: string;
  description: string;
  type?: 'Personal' | 'Project';
}

interface ProjectLinksSectionProps {
  topic: Topic;
  isAdminMode: boolean;
  showAddLink: boolean;
  newLink: NewLinkData;
  onToggleAddLink: () => void;
  onAddLink: () => void;
  onRemoveLink: (linkId: string) => void;
  onNewLinkChange: (field: keyof NewLinkData, value: string) => void;
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
              <Select value={newLink.type || ''} onValueChange={(value) => onNewLinkChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Resource type (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Project">Project</SelectItem>
                </SelectContent>
              </Select>
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
                      {link.type && (
                        <Badge variant="secondary" className="text-xs">
                          {link.type}
                        </Badge>
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
