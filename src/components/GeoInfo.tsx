import { GeoLocation, WhoisData } from '@/types/threat';
import { MapPin, Globe, Building2, Server, Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GeoInfoProps {
  geo?: GeoLocation;
  whois?: WhoisData;
}

const flagEmoji = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export function GeoInfo({ geo, whois }: GeoInfoProps) {
  if (!geo && !whois) return null;

  return (
    <div className="glass rounded-xl p-5 card-glow">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
        <Globe className="w-4 h-4 text-secondary" />
        ENRICHMENT DATA
      </h3>

      {geo && (
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{flagEmoji(geo.countryCode)}</span>
            <div>
              <p className="font-semibold text-foreground">{geo.country}</p>
              <p className="text-sm text-muted-foreground">
                {[geo.city, geo.region].filter(Boolean).join(', ')}
              </p>
            </div>
          </div>

          {geo.asn && (
            <div className="flex items-center gap-2 text-sm">
              <Server className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">ASN:</span>
              <span className="font-mono text-foreground">{geo.asn}</span>
            </div>
          )}

          {geo.org && (
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Org:</span>
              <span className="text-foreground">{geo.org}</span>
            </div>
          )}

          {geo.lat && geo.lon && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono text-xs text-muted-foreground">
                {geo.lat.toFixed(4)}, {geo.lon.toFixed(4)}
              </span>
            </div>
          )}
        </div>
      )}

      {whois && (
        <div className="border-t border-border/50 pt-4 space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground mb-2">WHOIS</h4>
          
          {whois.registrar && (
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Registrar:</span>
              <span className="text-foreground">{whois.registrar}</span>
            </div>
          )}

          {whois.createdDate && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Created:</span>
              <span className="font-mono text-foreground">{whois.createdDate}</span>
            </div>
          )}

          {whois.expiresDate && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Expires:</span>
              <span className="font-mono text-foreground">{whois.expiresDate}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
