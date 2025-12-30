export type IOCType = 'ip' | 'domain' | 'hash' | 'url';

export type ThreatLevel = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ThreatSource {
  name: string;
  detected: boolean;
  score?: number;
  details?: string;
  lastSeen?: string;
  categories?: string[];
}

export interface GeoLocation {
  country: string;
  countryCode: string;
  city?: string;
  region?: string;
  asn?: string;
  org?: string;
  lat?: number;
  lon?: number;
}

export interface WhoisData {
  registrar?: string;
  registrant?: string;
  createdDate?: string;
  expiresDate?: string;
  updatedDate?: string;
}

export interface IOCResult {
  id: string;
  value: string;
  type: IOCType;
  threatScore: number;
  threatLevel: ThreatLevel;
  confidence: ConfidenceLevel;
  sources: ThreatSource[];
  geo?: GeoLocation;
  whois?: WhoisData;
  tags: string[];
  firstSeen: string;
  lastSeen: string;
  pulseCount?: number;
  malwareFamilies?: string[];
}

export interface LookupStats {
  totalLookups: number;
  threatsDetected: number;
  criticalThreats: number;
  activeSources: number;
}
