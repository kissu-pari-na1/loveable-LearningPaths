
import React from 'react';
import { Topic, ProjectLink } from '@/types/Topic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
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
    return type === 'Personal' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-green-100 text-green-800 border-green-200';
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/10">
            <LinkIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-1">Resources</h3>
            <p className="text-muted-foreground">
              {topic.projectLinks.length} resource{topic.projectLinks.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>
        {isAdminMode && (
          <Button 
            onClick={onToggleAddLink}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            <Plus className="w-5 h-5" />
            Add Resource
          </Button>
        )}
      </div>

      {/* Add Resource Form */}
      {showAddLink && (
        <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-primary/2 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-3 text-primary">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Plus className="w-5 h-5" />
              </div>
              Add New Resource
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Title *
                </label>
                <Input
                  placeholder="Enter resource title"
                  value={newLink.title}
                  onChange={(e) => onNewLinkChange('title', e.target.value)}
                  className="bg-background border-2 focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  URL *
                </label>
                <Input
                  placeholder="https://example.com"
                  value={newLink.url}
                  onChange={(e) => onNewLinkChange('url', e.target.value)}
                  className="bg-background border-2 focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Description</label>
              <Input
                placeholder="Brief description of the resource (optional)"
                value={newLink.description}
                onChange={(e) => onNewLinkChange('description', e.target.value)}
                className="bg-background border-2 focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-semibold text-foreground">Resource Types</label>
              <div className="flex gap-8">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="personal-new"
                    checked={newLink.types?.includes('Personal') || false}
                    onCheckedChange={(checked) => handleTypeToggle('Personal', checked as boolean)}
                    className="border-2"
                  />
                  <label htmlFor="personal-new" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    Personal
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="project-new"
                    checked={newLink.types?.includes('Project') || false}
                    onCheckedChange={(checked) => handleTypeToggle('Project', checked as boolean)}
                    className="border-2"
                  />
                  <label htmlFor="project-new" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-green-600" />
                    Project
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                onClick={onAddLink} 
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
                disabled={!newLink.title || !newLink.url}
                size="lg"
              >
                <Plus className="w-4 h-4" />
                Add Resource
              </Button>
              <Button 
                variant="outline" 
                onClick={onToggleAddLink}
                className="flex items-center gap-2 border-2"
                size="lg"
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
        <Card className="border-dashed border-2 border-muted-foreground/20 bg-gradient-to-br from-muted/20 to-muted/10">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-muted/50 to-muted/30 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <LinkIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">No resources yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
              Start building your resource collection by adding links to helpful materials, documentation, or projects.
            </p>
            {isAdminMode && (
              <Button 
                onClick={onToggleAddLink} 
                variant="outline" 
                className="flex items-center gap-2 border-2 hover:bg-primary/5"
                size="lg"
              >
                <Plus className="w-5 h-5" />
                Add First Resource
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {topic.projectLinks.map((link) => (
            <Card key={link.id} className="group hover:shadow-xl transition-all duration-300 hover:border-primary/30 border-2 bg-gradient-to-br from-card to-card/80">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <ExternalLink className="w-5 h-5 text-primary" />
                      </div>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xl font-bold text-primary hover:text-primary/80 transition-colors break-words group-hover:underline flex-1"
                      >
                        {link.title}
                      </a>
                    </div>
                    
                    {link.description && (
                      <p className="text-muted-foreground mb-4 break-words leading-relaxed pl-12">
                        {link.description}
                      </p>
                    )}
                    
                    {link.types && link.types.length > 0 && (
                      <div className="flex gap-3 flex-wrap pl-12">
                        {link.types.map((type) => {
                          const IconComponent = getTypeIcon(type);
                          return (
                            <Badge 
                              key={type} 
                              className={`text-sm font-medium px-3 py-1.5 border ${getTypeColor(type)} flex items-center gap-2`}
                            >
                              <IconComponent className="w-3.5 h-3.5" />
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
                      onClick={() => onRemoveLink(link.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0 h-10 w-10 rounded-full"
                    >
                      <X className="w-5 h-5" />
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
