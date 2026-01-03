const axios = require('axios');

class ThreatIntelService {
  constructor() {
    this.abuseipdbKey = process.env.ABUSEIPDB_API_KEY;
    this.virusTotalKey = process.env.VIRUSTOTAL_API_KEY;
    this.alienVaultKey = process.env.ALIENVAULT_API_KEY;
  }

  // AbuseIPDB - Check IP reputation
  async checkAbuseIPDB(ip) {
    if (!this.abuseipdbKey) {
      return { name: 'AbuseIPDB', detected: false, details: 'API key not configured' };
    }
    
    try {
      const response = await axios.get(`https://api.abuseipdb.com/api/v2/check`, {
        params: { ipAddress: ip, maxAgeInDays: 90 },
        headers: { 'Key': this.abuseipdbKey, 'Accept': 'application/json' }
      });
      
      const data = response.data.data;
      return {
        name: 'AbuseIPDB',
        detected: data.abuseConfidenceScore > 0,
        score: data.abuseConfidenceScore,
        details: `Reported ${data.totalReports} times`,
        categories: data.usageType ? [data.usageType] : []
      };
    } catch (error) {
      console.error('AbuseIPDB Error:', error.message);
      return { name: 'AbuseIPDB', detected: false, details: 'API error' };
    }
  }

  // VirusTotal - Check IP/Domain/Hash
  async checkVirusTotal(ioc, type) {
    if (!this.virusTotalKey) {
      return { name: 'VirusTotal', detected: false, details: 'API key not configured' };
    }

    try {
      let endpoint;
      if (type === 'ip') endpoint = `https://www.virustotal.com/api/v3/ip_addresses/${ioc}`;
      else if (type === 'domain') endpoint = `https://www.virustotal.com/api/v3/domains/${ioc}`;
      else if (type === 'hash') endpoint = `https://www.virustotal.com/api/v3/files/${ioc}`;
      else return { name: 'VirusTotal', detected: false, details: 'Unsupported type' };

      const response = await axios.get(endpoint, {
        headers: { 'x-apikey': this.virusTotalKey }
      });

      const stats = response.data.data.attributes.last_analysis_stats;
      const malicious = stats?.malicious || 0;
      const total = Object.values(stats || {}).reduce((a, b) => a + b, 0);

      return {
        name: 'VirusTotal',
        detected: malicious > 0,
        score: malicious,
        details: `${malicious}/${total} engines detected`
      };
    } catch (error) {
      console.error('VirusTotal Error:', error.message);
      return { name: 'VirusTotal', detected: false, details: 'Not found or API error' };
    }
  }

  // AlienVault OTX - Check IOC
  async checkAlienVault(ioc, type) {
    try {
      let endpoint;
      if (type === 'ip') endpoint = `https://otx.alienvault.com/api/v1/indicators/IPv4/${ioc}/general`;
      else if (type === 'domain') endpoint = `https://otx.alienvault.com/api/v1/indicators/domain/${ioc}/general`;
      else if (type === 'hash') endpoint = `https://otx.alienvault.com/api/v1/indicators/file/${ioc}/general`;
      else return { name: 'AlienVault OTX', detected: false, details: 'Unsupported type' };

      const headers = this.alienVaultKey ? { 'X-OTX-API-KEY': this.alienVaultKey } : {};
      const response = await axios.get(endpoint, { headers });

      const pulseCount = response.data.pulse_info?.count || 0;
      return {
        name: 'AlienVault OTX',
        detected: pulseCount > 0,
        details: `Found in ${pulseCount} pulses`,
        categories: response.data.pulse_info?.pulses?.slice(0, 3).map(p => p.name) || []
      };
    } catch (error) {
      console.error('AlienVault Error:', error.message);
      return { name: 'AlienVault OTX', detected: false, details: 'Not found or API error' };
    }
  }

  // Get geolocation for IP
  async getGeoLocation(ip) {
    try {
      const response = await axios.get(`http://ip-api.com/json/${ip}`);
      const data = response.data;
      
      if (data.status === 'success') {
        return {
          country: data.country,
          countryCode: data.countryCode,
          city: data.city,
          region: data.regionName,
          asn: data.as?.split(' ')[0],
          org: data.isp,
          lat: data.lat,
          lon: data.lon
        };
      }
      return null;
    } catch (error) {
      console.error('GeoIP Error:', error.message);
      return null;
    }
  }

  // Calculate threat level based on score
  calculateThreatLevel(score) {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    if (score >= 20) return 'low';
    return 'info';
  }

  // Aggregate all sources and calculate final score
  async analyzeIOC(value, type) {
    const sources = [];
    let totalScore = 0;
    let detectingSourcesCount = 0;

    // Run all checks in parallel
    const checks = [
      this.checkVirusTotal(value, type),
      this.checkAlienVault(value, type)
    ];

    // Add AbuseIPDB only for IPs
    if (type === 'ip') {
      checks.unshift(this.checkAbuseIPDB(value));
    }

    const results = await Promise.all(checks);
    
    results.forEach(result => {
      sources.push(result);
      if (result.detected) {
        detectingSourcesCount++;
        totalScore += result.score || 30; // Default weight if no score
      }
    });

    // Normalize score to 0-100
    const threatScore = Math.min(100, Math.round(totalScore / Math.max(sources.length, 1)));
    const threatLevel = this.calculateThreatLevel(threatScore);
    
    // Determine confidence
    let confidence = 'LOW';
    if (detectingSourcesCount >= 2) confidence = 'HIGH';
    else if (detectingSourcesCount === 1) confidence = 'MEDIUM';

    // Get geo data for IPs
    let geo = null;
    if (type === 'ip') {
      geo = await this.getGeoLocation(value);
    }

    return {
      value,
      type,
      threatScore,
      threatLevel,
      confidence,
      sources,
      geo,
      tags: this.generateTags(sources, threatLevel),
      firstSeen: new Date(),
      lastSeen: new Date(),
      pulseCount: sources.find(s => s.name === 'AlienVault OTX')?.details?.match(/\d+/)?.[0] || 0
    };
  }

  generateTags(sources, threatLevel) {
    const tags = [];
    sources.forEach(source => {
      if (source.categories) tags.push(...source.categories);
    });
    if (threatLevel === 'critical' || threatLevel === 'high') tags.push('malicious');
    return [...new Set(tags.map(t => t.toLowerCase().replace(/\s+/g, '-')))].slice(0, 5);
  }
}

module.exports = new ThreatIntelService();
