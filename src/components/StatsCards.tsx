import { LookupStats } from '@/types/threat';
import { Activity, AlertTriangle, ShieldAlert, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardsProps {
  stats: LookupStats;
}

const statConfig = [
  {
    key: 'totalLookups' as const,
    label: 'Total Lookups',
    icon: Activity,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
  },
  {
    key: 'threatsDetected' as const,
    label: 'Threats Detected',
    icon: AlertTriangle,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  {
    key: 'criticalThreats' as const,
    label: 'Critical Threats',
    icon: ShieldAlert,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
  {
    key: 'activeSources' as const,
    label: 'Active Sources',
    icon: Zap,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
];

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statConfig.map(({ key, label, icon: Icon, color, bgColor }, index) => (
        <div 
          key={key}
          className="glass rounded-xl p-4 card-glow animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', bgColor)}>
              <Icon className={cn('w-5 h-5', color)} />
            </div>
          </div>
          <p className={cn('text-2xl font-bold font-mono', color)}>
            {stats[key].toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{label}</p>
        </div>
      ))}
    </div>
  );
}
