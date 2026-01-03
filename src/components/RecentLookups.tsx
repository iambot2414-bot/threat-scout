import { IOCResult } from '@/types/threat';
import { cn } from '@/lib/utils';
import { Server, Globe, Hash, Link2, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface RecentLookupsProps {
  lookups: IOCResult[];
  onSelect: (result: IOCResult) => void;
  isLoading?: boolean;
}

const typeIcons = {
  ip: Server,
  domain: Globe,
  hash: Hash,
  url: Link2,
};

const levelColors = {
  critical: 'bg-threat-critical',
  high: 'bg-threat-high',
  medium: 'bg-threat-medium',
  low: 'bg-threat-low',
  info: 'bg-threat-info',
};

export function RecentLookups({ lookups, onSelect, isLoading }: RecentLookupsProps) {
  if (isLoading) {
    return (
      <div className="glass rounded-xl p-5 card-glow">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">
          RECENT LOOKUPS
        </h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (lookups.length === 0) {
    return (
      <div className="glass rounded-xl p-5 card-glow">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">
          RECENT LOOKUPS
        </h3>
        <p className="text-sm text-muted-foreground text-center py-4">
          No recent lookups yet
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-5 card-glow">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4">
        RECENT LOOKUPS
      </h3>
      
      <div className="space-y-2">
        {lookups.map((lookup) => {
          const TypeIcon = typeIcons[lookup.type];
          
          return (
            <button
              key={lookup.id}
              onClick={() => onSelect(lookup)}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200',
                'bg-muted/20 hover:bg-muted/40 border border-transparent hover:border-border/50',
                'text-left group'
              )}
            >
              <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                <TypeIcon className="w-4 h-4 text-muted-foreground" />
              </div>
              
              <div className="flex-1 min-w-0">
                <code className="text-sm font-mono text-foreground truncate block">
                  {lookup.value}
                </code>
                <span className="text-xs text-muted-foreground">
                  Score: {lookup.threatScore}
                </span>
              </div>

              <div className={cn(
                'w-2 h-2 rounded-full shrink-0',
                levelColors[lookup.threatLevel]
              )} />

              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
