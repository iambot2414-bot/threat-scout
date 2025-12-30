import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, Globe, Hash, Link2, Server } from 'lucide-react';
import { IOCType } from '@/types/threat';
import { cn } from '@/lib/utils';

interface IOCLookupProps {
  onSearch: (value: string, type: IOCType) => void;
  isLoading?: boolean;
}

const iocTypes: { type: IOCType; label: string; icon: React.ComponentType<{ className?: string }>; placeholder: string }[] = [
  { type: 'ip', label: 'IP Address', icon: Server, placeholder: '185.234.217.59' },
  { type: 'domain', label: 'Domain', icon: Globe, placeholder: 'malware-domain.xyz' },
  { type: 'hash', label: 'File Hash', icon: Hash, placeholder: 'MD5, SHA1, or SHA256' },
  { type: 'url', label: 'URL', icon: Link2, placeholder: 'https://suspicious.site/payload' },
];

export function IOCLookup({ onSearch, isLoading }: IOCLookupProps) {
  const [value, setValue] = useState('');
  const [selectedType, setSelectedType] = useState<IOCType>('ip');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim(), selectedType);
    }
  };

  const selectedConfig = iocTypes.find(t => t.type === selectedType)!;

  return (
    <div className="glass rounded-2xl p-6 card-glow">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Search className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">IOC Lookup</h2>
          <p className="text-sm text-muted-foreground">Query threat intelligence feeds</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {iocTypes.map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              selectedType === type
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'bg-muted/30 text-muted-foreground border border-transparent hover:bg-muted/50 hover:text-foreground'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <selectedConfig.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={selectedConfig.placeholder}
            className="pl-11 h-12 text-base"
            disabled={isLoading}
          />
        </div>
        <Button 
          type="submit" 
          variant="cyber" 
          size="lg"
          disabled={!value.trim() || isLoading}
          className="px-6"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Search className="w-5 h-5" />
              Analyze
            </>
          )}
        </Button>
      </form>

      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span>Querying AbuseIPDB, VirusTotal, AlienVault OTX</span>
      </div>
    </div>
  );
}
