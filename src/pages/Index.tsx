import { useState } from 'react';
import { Header } from '@/components/Header';
import { IOCLookup } from '@/components/IOCLookup';
import { StatsCards } from '@/components/StatsCards';
import { IOCResultCard } from '@/components/IOCResultCard';
import { RecentLookups } from '@/components/RecentLookups';
import { mockIOCResults, mockStats } from '@/data/mockData';
import { IOCResult, IOCType } from '@/types/threat';
import { toast } from 'sonner';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<IOCResult | null>(null);
  const [recentLookups, setRecentLookups] = useState<IOCResult[]>(mockIOCResults.slice(0, 5));

  const handleSearch = async (value: string, type: IOCType) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Find mock result or generate a demo one
    const foundResult = mockIOCResults.find(
      r => r.value.toLowerCase() === value.toLowerCase() || r.type === type
    );
    
    if (foundResult) {
      const result = { ...foundResult, value, type };
      setCurrentResult(result);
      setRecentLookups(prev => [result, ...prev.filter(r => r.id !== result.id)].slice(0, 5));
      toast.success(`Analysis complete for ${value}`);
    } else {
      // Generate a clean result for unknown IOCs
      const cleanResult: IOCResult = {
        id: Date.now().toString(),
        value,
        type,
        threatScore: Math.floor(Math.random() * 30),
        threatLevel: 'low',
        confidence: 'MEDIUM',
        sources: [
          { name: 'AbuseIPDB', detected: false },
          { name: 'VirusTotal', detected: false },
          { name: 'AlienVault OTX', detected: false },
        ],
        tags: ['unknown'],
        firstSeen: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        pulseCount: 0,
      };
      setCurrentResult(cleanResult);
      toast.info(`No known threats found for ${value}`);
    }
    
    setIsLoading(false);
  };

  const handleSelectRecent = (result: IOCResult) => {
    setCurrentResult(result);
  };

  return (
    <div className="min-h-screen grid-pattern">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <section className="mb-8">
          <StatsCards stats={mockStats} />
        </section>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Lookup & Results Column */}
          <div className="lg:col-span-3 space-y-6">
            <IOCLookup onSearch={handleSearch} isLoading={isLoading} />
            
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
            <RecentLookups lookups={recentLookups} onSelect={handleSelectRecent} />

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
