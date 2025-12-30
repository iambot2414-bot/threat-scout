import { IOCResult } from '@/types/threat';
import { ThreatScore } from './ThreatScore';
import { SourceCard } from './SourceCard';
import { GeoInfo } from './GeoInfo';
import { cn } from '@/lib/utils';
import { 
  Server, Globe, Hash, Link2, Clock, Calendar, 
  Tag, Bug, Copy, ExternalLink, ChevronDown, ChevronUp 
} from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

interface IOCResultCardProps {
  result: IOCResult;
}

const typeIcons = {
  ip: Server,
  domain: Globe,
  hash: Hash,
  url: Link2,
};

export function IOCResultCard({ result }: IOCResultCardProps) {
  const [showAllSources, setShowAllSources] = useState(false);
  const TypeIcon = typeIcons[result.type];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.value);
    toast.success('Copied to clipboard');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="glass rounded-2xl overflow-hidden card-glow animate-fade-in">
      {/* Header */}
      <div className={cn(
        'p-6 border-b border-border/50',
        result.threatLevel === 'critical' && 'bg-destructive/5',
        result.threatLevel === 'high' && 'bg-threat-high/5',
      )}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                <TypeIcon className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {result.type}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <code className="text-xl lg:text-2xl font-mono font-bold text-foreground truncate">
                {result.value}
              </code>
              <Button variant="ghost" size="icon" onClick={copyToClipboard} className="shrink-0">
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>First seen: {formatDate(result.firstSeen)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Last seen: {formatDate(result.lastSeen)}</span>
              </div>
            </div>
          </div>

          <ThreatScore 
            score={result.threatScore} 
            level={result.threatLevel} 
            confidence={result.confidence}
            size="lg"
          />
        </div>
      </div>

      {/* Tags & Malware */}
      <div className="p-6 border-b border-border/50">
        <div className="flex flex-wrap gap-4">
          {result.tags.length > 0 && (
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary border border-primary/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.malwareFamilies && result.malwareFamilies.length > 0 && (
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <Bug className="w-4 h-4 text-destructive" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">Malware Families</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.malwareFamilies.map((family) => (
                  <span 
                    key={family}
                    className="px-3 py-1 text-sm rounded-full bg-destructive/10 text-destructive border border-destructive/20"
                  >
                    {family}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.pulseCount !== undefined && result.pulseCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/20">
              <span className="text-accent font-bold text-lg">{result.pulseCount}</span>
              <span className="text-sm text-muted-foreground">OTX Pulses</span>
            </div>
          )}
        </div>
      </div>

      {/* Sources & Geo */}
      <div className="p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              THREAT INTELLIGENCE SOURCES
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {result.sources
                .slice(0, showAllSources ? undefined : 3)
                .map((source) => (
                  <SourceCard key={source.name} source={source} />
                ))}
            </div>
            {result.sources.length > 3 && (
              <Button 
                variant="ghost" 
                className="w-full mt-4"
                onClick={() => setShowAllSources(!showAllSources)}
              >
                {showAllSources ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Show More Sources
                  </>
                )}
              </Button>
            )}
          </div>

          <div>
            <GeoInfo geo={result.geo} whois={result.whois} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Activity({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
    </svg>
  );
}
