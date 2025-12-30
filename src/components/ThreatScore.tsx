import { ThreatLevel, ConfidenceLevel } from '@/types/threat';
import { cn } from '@/lib/utils';
import { Shield, ShieldAlert, ShieldCheck, ShieldX, Info } from 'lucide-react';

interface ThreatScoreProps {
  score: number;
  level: ThreatLevel;
  confidence: ConfidenceLevel;
  size?: 'sm' | 'md' | 'lg';
}

const levelConfig = {
  critical: {
    color: 'text-threat-critical',
    bg: 'bg-threat-critical/10',
    border: 'border-threat-critical/30',
    glow: 'shadow-[0_0_20px_hsl(var(--threat-critical)/0.3)]',
    icon: ShieldX,
    label: 'CRITICAL',
  },
  high: {
    color: 'text-threat-high',
    bg: 'bg-threat-high/10',
    border: 'border-threat-high/30',
    glow: 'shadow-[0_0_20px_hsl(var(--threat-high)/0.3)]',
    icon: ShieldAlert,
    label: 'HIGH',
  },
  medium: {
    color: 'text-threat-medium',
    bg: 'bg-threat-medium/10',
    border: 'border-threat-medium/30',
    glow: 'shadow-[0_0_15px_hsl(var(--threat-medium)/0.2)]',
    icon: Shield,
    label: 'MEDIUM',
  },
  low: {
    color: 'text-threat-low',
    bg: 'bg-threat-low/10',
    border: 'border-threat-low/30',
    glow: 'shadow-[0_0_15px_hsl(var(--threat-low)/0.2)]',
    icon: ShieldCheck,
    label: 'LOW',
  },
  info: {
    color: 'text-threat-info',
    bg: 'bg-threat-info/10',
    border: 'border-threat-info/30',
    glow: '',
    icon: Info,
    label: 'INFO',
  },
};

const sizeConfig = {
  sm: {
    container: 'w-16 h-16',
    text: 'text-lg',
    label: 'text-[10px]',
    iconSize: 'w-3 h-3',
  },
  md: {
    container: 'w-24 h-24',
    text: 'text-2xl',
    label: 'text-xs',
    iconSize: 'w-4 h-4',
  },
  lg: {
    container: 'w-32 h-32',
    text: 'text-4xl',
    label: 'text-sm',
    iconSize: 'w-5 h-5',
  },
};

export function ThreatScore({ score, level, confidence, size = 'md' }: ThreatScoreProps) {
  const config = levelConfig[level];
  const sizes = sizeConfig[size];
  const Icon = config.icon;

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn('relative', sizes.container)}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-muted/30"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={cn(config.color, 'transition-all duration-1000 ease-out')}
            style={{
              filter: level === 'critical' || level === 'high' ? 'drop-shadow(0 0 6px currentColor)' : undefined,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('font-mono font-bold', sizes.text, config.color)}>
            {score}
          </span>
        </div>
      </div>
      
      <div className={cn(
        'flex items-center gap-1.5 px-3 py-1 rounded-full border',
        config.bg,
        config.border,
        config.glow
      )}>
        <Icon className={cn(sizes.iconSize, config.color)} />
        <span className={cn('font-semibold tracking-wider', sizes.label, config.color)}>
          {config.label}
        </span>
      </div>

      <span className="text-xs text-muted-foreground">
        Confidence: <span className="font-semibold">{confidence}</span>
      </span>
    </div>
  );
}
