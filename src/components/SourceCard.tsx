import { ThreatSource } from '@/types/threat';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, AlertTriangle, ExternalLink } from 'lucide-react';

interface SourceCardProps {
  source: ThreatSource;
}

const sourceLogos: Record<string, { color: string; shortName: string }> = {
  'AbuseIPDB': { color: 'text-orange-400', shortName: 'ABUSE' },
  'VirusTotal': { color: 'text-blue-400', shortName: 'VT' },
  'AlienVault OTX': { color: 'text-purple-400', shortName: 'OTX' },
};

export function SourceCard({ source }: SourceCardProps) {
  const logo = sourceLogos[source.name] || { color: 'text-muted-foreground', shortName: source.name.slice(0, 3).toUpperCase() };

  return (
    <div className={cn(
      'glass rounded-lg p-4 transition-all duration-300 hover:scale-[1.02]',
      source.detected ? 'card-glow-danger' : 'card-glow'
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-xs',
            'bg-muted/50 border border-border/50',
            logo.color
          )}>
            {logo.shortName}
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{source.name}</h4>
            {source.lastSeen && (
              <p className="text-xs text-muted-foreground">
                Last: {new Date(source.lastSeen).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        
        {source.detected ? (
          <div className="flex items-center gap-1 text-destructive">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-semibold">DETECTED</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-success">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-semibold">CLEAN</span>
          </div>
        )}
      </div>

      {source.score !== undefined && (
        <div className="mb-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Score</span>
            <span className={cn(
              'font-mono font-bold',
              source.score > 50 ? 'text-destructive' : source.score > 20 ? 'text-warning' : 'text-success'
            )}>
              {source.score}
            </span>
          </div>
          <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
            <div 
              className={cn(
                'h-full rounded-full transition-all duration-500',
                source.score > 50 ? 'bg-destructive' : source.score > 20 ? 'bg-warning' : 'bg-success'
              )}
              style={{ width: `${Math.min(source.score, 100)}%` }}
            />
          </div>
        </div>
      )}

      {source.details && (
        <p className="text-sm text-muted-foreground mb-2">{source.details}</p>
      )}

      {source.categories && source.categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {source.categories.map((cat) => (
            <span 
              key={cat}
              className="px-2 py-0.5 text-xs rounded-full bg-muted/50 text-muted-foreground border border-border/50"
            >
              {cat}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
