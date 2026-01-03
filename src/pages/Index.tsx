import { useState } from 'react';
import { Header } from '@/components/Header';
import { IOCLookup } from '@/components/IOCLookup';
import { StatsCards } from '@/components/StatsCards';
import { IOCResultCard } from '@/components/IOCResultCard';
import { RecentLookups } from '@/components/RecentLookups';
import { IOCResult, IOCType, LookupStats } from '@/types/threat';
import { toast } from 'sonner';
import { useStats, useRecentLookups, useIOCLookup, useHealthCheck } from '@/hooks/useThreatAPI';

const Index = () => {
  const [currentResult, setCurrentResult] = useState<IOCResult | null>(null);
  
  // API hooks
  const { data: stats, isLoading: statsLoading, error: statsError } = useStats();
  const { data: recentLookups = [], isLoading: lookupsLoading } = useRecentLookups(5);
  const { data: health } = useHealthCheck();
  const lookupMutation = useIOCLookup();

  // Default stats fallback
  const defaultStats: LookupStats = {
    totalLookups: 0,
    threatsDetected: 0,
    criticalThreats: 0,
    activeSources: 3
  };

  const handleSearch = async (value: string, type: IOCType) => {
    lookupMutation.mutate(
      { value, type },
      {
        onSuccess: (result) => {
          setCurrentResult(result);
          if (result.threatLevel === 'critical' || result.threatLevel === 'high') {
            toast.warning(`Threat detected for ${value}`, {
              description: `Threat Level: ${result.threatLevel.toUpperCase()}`
            });
          } else {
            toast.success(`Analysis complete for ${value}`);
          }
        },
        onError: (error) => {
          toast.error('Failed to analyze IOC', {
            description: error instanceof Error ? error.message : 'Please check your backend connection'
          });
        }
      }
    );
  };

  const handleSelectRecent = (result: IOCResult) => {
    setCurrentResult(result);
  };

  const isBackendConnected = health?.status === 'ok';

  return (
    <div className="min-h-screen grid-pattern">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Backend Status Banner */}
        {statsError && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
            <p className="font-medium">⚠️ Backend not connected</p>
            <p className="text-sm mt-1">
              Start your Express backend at <code className="bg-background px-2 py-1 rounded">http://localhost:5000</code>
            </p>
          </div>
        )}

        {/* Stats Overview */}
        <section className="mb-8">
          <StatsCards stats={stats || defaultStats} isLoading={statsLoading} />
        </section>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Lookup & Results Column */}
          <div className="lg:col-span-3 space-y-6">
            <IOCLookup onSearch={handleSearch} isLoading={lookupMutation.isPending} />
            
            {currentResult && (
              <IOCResultCard result={currentResult} />
            )}

            {!currentResult && (
              <div className="glass rounded-2xl p-12 text-center card-glow">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                    <path d="M11 8v6" />
                    <path d="M8 11h6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Enter an IOC to analyze
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Query IP addresses, domains, file hashes, or URLs against multiple threat intelligence sources including AbuseIPDB, VirusTotal, and AlienVault OTX.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <RecentLookups 
              lookups={recentLookups} 
              onSelect={handleSelectRecent} 
              isLoading={lookupsLoading}
            />

            {/* Quick Actions */}
            <div className="glass rounded-xl p-5 card-glow">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                QUICK ACTIONS
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors text-sm">
                  📊 Export Report (CSV)
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors text-sm">
                  🔄 Bulk IOC Lookup
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors text-sm">
                  📈 View Analytics
                </button>
              </div>
            </div>

            {/* API Status */}
            <div className="glass rounded-xl p-5 card-glow">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                API STATUS
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Backend Server</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-success animate-pulse' : 'bg-destructive'}`} />
                    <span className={`text-xs ${isBackendConnected ? 'text-success' : 'text-destructive'}`}>
                      {isBackendConnected ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
                {[
                  { name: 'AbuseIPDB', status: 'online' },
                  { name: 'VirusTotal', status: 'online' },
                  { name: 'AlienVault OTX', status: 'online' },
                ].map((api) => (
                  <div key={api.name} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{api.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      <span className="text-xs text-success">Online</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Threat Intelligence Aggregator — Built for SOC Analysts</p>
          <p className="mt-1">Integrates AbuseIPDB, VirusTotal, and AlienVault OTX</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
