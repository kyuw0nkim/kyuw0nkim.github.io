import { Link } from "react-router-dom";
import { ExternalLink, FileText, Globe, BookOpen } from "lucide-react";
import { Publication } from "@/data/types";

interface PublicationCardProps {
  publication: Publication;
  showThumbnail?: boolean;
}

export function PublicationCard({ publication, showThumbnail = true }: PublicationCardProps) {
  return (
    <div className="pub-card border-b border-border last:border-b-0">
      {showThumbnail && (
        <div className="pub-thumbnail hidden sm:flex">
          <span>image</span>
        </div>
      )}
      
      <div className="flex-1 space-y-2">
        {/* Title */}
        <h3 className="font-semibold text-foreground leading-snug">
          {publication.title}
        </h3>
        
        {/* Venue and Authors */}
        <div className="text-sm">
          <span className="text-muted-foreground italic">{publication.venue}</span>
          <span className="mx-2 text-muted-foreground">·</span>
          <span className="text-muted-foreground">
            {publication.authors.join(", ")}
          </span>
        </div>
        
        {/* Links and Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {publication.links.acmdl && (
            <a href={publication.links.acmdl} target="_blank" rel="noopener noreferrer" className="link-btn link-btn-primary">
              <BookOpen className="w-3 h-3" />
              ACM DL
            </a>
          )}
          {publication.links.pdf && (
            <a href={publication.links.pdf} target="_blank" rel="noopener noreferrer" className="link-btn link-btn-primary">
              <FileText className="w-3 h-3" />
              PDF
            </a>
          )}
          {publication.links.website && (
            <a href={publication.links.website} target="_blank" rel="noopener noreferrer" className="link-btn">
              <Globe className="w-3 h-3" />
              Website
            </a>
          )}
          {publication.links.arxiv && (
            <a href={publication.links.arxiv} target="_blank" rel="noopener noreferrer" className="link-btn">
              <ExternalLink className="w-3 h-3" />
              arXiv
            </a>
          )}
          
          {/* Tags */}
          {publication.tags.map((tag) => (
            <span key={tag} className="tag-pill">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    role: string;
    summary: string;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const formatDateRange = () => {
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const startStr = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    return `${startStr} - ${endStr}`;
  };

  return (
    <div className="flex gap-6 py-4">
      {/* Thumbnail */}
      <div className="w-48 h-32 bg-muted rounded-md flex-shrink-0 hidden sm:flex items-center justify-center text-muted-foreground">
        <span>image</span>
      </div>
      
      <div className="flex-1 space-y-2">
        {/* Title */}
        <h3 className="font-semibold text-foreground leading-snug">
          {project.title}
        </h3>
        
        {/* Date and Role */}
        <p className="text-sm text-muted-foreground">
          {formatDateRange()}, {project.role}
        </p>
        
        {/* Summary */}
        <p className="text-sm text-foreground">
          {project.summary}
        </p>
        
        {/* See More Button */}
        <Link 
          to={`/projects/${project.id}`}
          className="inline-block mt-2 px-4 py-1.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          See more
        </Link>
      </div>
    </div>
  );
}
