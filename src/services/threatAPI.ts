import { IOCResult, IOCType, LookupStats } from '@/types/threat';

// Configure your backend URL here
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ThreatAPIService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Lookup IOC
  async lookupIOC(value: string, type: IOCType): Promise<IOCResult> {
    const response = await fetch(`${this.baseUrl}/ioc/lookup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value, type }),
    });

    if (!response.ok) {
      throw new Error('Failed to lookup IOC');
    }

    return response.json();
  }

  // Get recent lookups
  async getRecentLookups(limit: number = 10): Promise<IOCResult[]> {
    const response = await fetch(`${this.baseUrl}/ioc/recent?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch recent lookups');
    }

    return response.json();
  }

  // Get IOC by ID
  async getIOCById(id: string): Promise<IOCResult> {
    const response = await fetch(`${this.baseUrl}/ioc/${id}`);
    
    if (!response.ok) {
      throw new Error('IOC not found');
    }

    return response.json();
  }

  // Get stats
  async getStats(): Promise<LookupStats> {
    const response = await fetch(`${this.baseUrl}/stats`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }

    return response.json();
  }

  // Health check
  async healthCheck(): Promise<{ status: string; mongodb: string }> {
    const response = await fetch(`${this.baseUrl}/health`);
    
    if (!response.ok) {
      throw new Error('Backend is not available');
    }

    return response.json();
  }
}

export const threatAPI = new ThreatAPIService();
