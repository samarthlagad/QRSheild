export type ThreatLevel = 'safe' | 'suspicious' | 'critical';
export type ScanMethod = 'camera' | 'upload' | 'manual';

export interface ThreatEvidence {
  id: string;
  category: 'protocol' | 'domain' | 'ip' | 'redirect' | 'keywords' | 'structure' | 'reputation';
  rule: string;
  description: string;
  severity: ThreatLevel;
  points: number; // impact on risk score (0-100)
  details?: string;
}

export interface ParsedUrlDetails {
  raw: string;
  protocol: string;
  hostname: string;
  pathname: string;
  search: string;
  port?: string;
  isRawIp: boolean;
  isLookalike: boolean;
  targetBrand?: string;
  isShortener: boolean;
  tld: string;
  isHighRiskTld: boolean;
  matchedKeywords: string[];
  entropy: number;
}

export interface ScanReport {
  id: string;
  url: string;
  timestamp: number;
  riskScore: number; // 0 (safest) to 100 (most dangerous)
  verdict: ThreatLevel;
  verdictTitle: string;
  verdictSummary: string;
  method: ScanMethod;
  evidence: ThreatEvidence[];
  parsedUrl: ParsedUrlDetails;
  recommendations: string[];
  threatVector?: string;
  scanDurationMs: number;
}

export interface SampleAttackScenario {
  id: string;
  title: string;
  tag: string;
  category: string;
  context: string;
  url: string;
  expectedVerdict: ThreatLevel;
  physicalVector: string;
  description: string;
}
