import { ParsedUrlDetails, ScanMethod, ScanReport, ThreatEvidence, ThreatLevel } from '../types';

// High risk TLDs frequently abused in quishing campaigns
const HIGH_RISK_TLDS = new Set([
  'xyz', 'top', 'vip', 'buzz', 'click', 'cfd', 'icu', 'sbs', 'rest', 'tk', 'ml', 'ga', 'cf', 'gq', 'work', 'loan', 'online', 'casa', 'surf', 'cam'
]);

// URL shorteners that obscure genuine destinations on physical QR stickers
const URL_SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'cutt.ly', 'is.gd', 'ow.ly', 'rb.gy', 'rebrand.ly', 'shorturl.at', 'bl.ink'
]);

// Target brands frequently spoofed in QR code attacks
const BRAND_TARGETS: Record<string, { brand: string; legitDomain: string; keywords: string[] }> = {
  parking: { brand: 'Municipal Parking / ParkMobile', legitDomain: 'parkmobile.io', keywords: ['park', 'meter', 'parking', 'citypay', 'flowbird', 'paybyphone'] },
  usps: { brand: 'USPS / Postal Delivery', legitDomain: 'usps.com', keywords: ['usps', 'postal', 'package', 'redelivery', 'post-office', 'tracking'] },
  paypal: { brand: 'PayPal', legitDomain: 'paypal.com', keywords: ['paypal', 'pay-pal', 'pp-account'] },
  chase: { brand: 'Chase Bank', legitDomain: 'chase.com', keywords: ['chase', 'jpmorgan', 'chase-security'] },
  wells: { brand: 'Wells Fargo', legitDomain: 'wellsfargo.com', keywords: ['wellsfargo', 'wf-alert'] },
  apple: { brand: 'Apple ID', legitDomain: 'apple.com', keywords: ['appleid', 'icloud-verify', 'apple-security'] },
  fedex: { brand: 'FedEx', legitDomain: 'fedex.com', keywords: ['fedex', 'fedx-parcel'] },
  ups: { brand: 'UPS', legitDomain: 'ups.com', keywords: ['ups-delivery', 'ups-tracking'] },
  bank: { brand: 'Banking Portal', legitDomain: 'bank.com', keywords: ['onlinebank', 'ebank', 'wire-transfer'] },
};

const URGENCY_KEYWORDS = [
  'urgent', 'immediate', 'expire', 'suspend', 'overdue', 'penalty', 'fine', 'late-fee', 'action-required', 'restricted', 'unauthorized', 'cancel-fee'
];

const CREDENTIAL_KEYWORDS = [
  'login', 'signin', 'auth', 'verify', 'update', 'confirm', 'password', 'pin', 'ssn', 'card', 'cvv', 'wallet', 'security-check'
];

const PAYMENT_KEYWORDS = [
  'pay', 'payment', 'billing', 'invoice', 'checkout', 'settle', 'transfer', 'crypto', 'deposit', 'toll'
];

/**
 * Calculate Shannon Entropy of a string to detect randomized subdomains/obfuscation
 */
function calculateEntropy(str: string): number {
  const frequencies: Record<string, number> = {};
  for (const char of str) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  return Object.values(frequencies).reduce((sum, count) => {
    const p = count / str.length;
    return sum - p * Math.log2(p);
  }, 0);
}

/**
 * Deterministic link parser & heuristic extractor
 */
export function parseAndAnalyzeUrl(inputUrl: string): ParsedUrlDetails {
  let cleanInput = inputUrl.trim();
  if (!/^https?:\/\//i.test(cleanInput) && !cleanInput.startsWith('WIFI:') && !cleanInput.startsWith('mailto:')) {
    cleanInput = 'https://' + cleanInput;
  }

  try {
    const urlObj = new URL(cleanInput);
    const hostname = urlObj.hostname.toLowerCase();
    const parts = hostname.split('.');
    const tld = parts.length > 1 ? parts[parts.length - 1] : '';

    // Check raw IP (IPv4)
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const isRawIp = ipv4Regex.test(hostname) || /^0x[0-9a-f]+$/i.test(hostname);

    const isHighRiskTld = HIGH_RISK_TLDS.has(tld);
    const isShortener = URL_SHORTENERS.has(hostname) || URL_SHORTENERS.has(hostname.replace(/^www\./, ''));

    // Check lookalike / typosquatting
    let isLookalike = false;
    let targetBrand: string | undefined;

    for (const [, info] of Object.entries(BRAND_TARGETS)) {
      const matchFound = info.keywords.some((kw) => hostname.includes(kw) || urlObj.pathname.toLowerCase().includes(kw));
      if (matchFound) {
        // If it includes brand keyword but isn't the legit root domain
        if (!hostname.endsWith(info.legitDomain) && hostname !== info.legitDomain) {
          isLookalike = true;
          targetBrand = info.brand;
          break;
        }
      }
    }

    // Keyword detection
    const fullSearchable = (cleanInput).toLowerCase();
    const matchedKeywords: string[] = [];

    [...URGENCY_KEYWORDS, ...CREDENTIAL_KEYWORDS, ...PAYMENT_KEYWORDS].forEach((kw) => {
      if (fullSearchable.includes(kw)) {
        matchedKeywords.push(kw);
      }
    });

    const entropy = calculateEntropy(hostname);

    return {
      raw: inputUrl,
      protocol: urlObj.protocol.replace(':', ''),
      hostname,
      pathname: urlObj.pathname,
      search: urlObj.search,
      port: urlObj.port || undefined,
      isRawIp,
      isLookalike,
      targetBrand,
      isShortener,
      tld,
      isHighRiskTld,
      matchedKeywords,
      entropy: Number(entropy.toFixed(2)),
    };
  } catch {
    return {
      raw: inputUrl,
      protocol: 'unknown',
      hostname: inputUrl,
      pathname: '',
      search: '',
      isRawIp: false,
      isLookalike: false,
      isShortener: false,
      tld: '',
      isHighRiskTld: false,
      matchedKeywords: [],
      entropy: 0,
    };
  }
}

/**
 * Execute all deterministic threat inspection rules
 */
export function analyzeTarget(rawInput: string, method: ScanMethod = 'upload'): ScanReport {
  const startTime = performance.now();
  const trimmed = rawInput.trim();
  const parsed = parseAndAnalyzeUrl(trimmed);
  const evidence: ThreatEvidence[] = [];
  const recommendations: string[] = [];

  let riskScore = 0;

  // Handle special QR payloads like plain text or non-URL
  if (trimmed.startsWith('WIFI:')) {
    evidence.push({
      id: 'wifi_config',
      category: 'structure',
      rule: 'Local Wi-Fi Credential Payload',
      description: 'The QR code configures a local wireless network connection rather than navigating to a web domain.',
      severity: 'safe',
      points: 0,
      details: 'Inspect the SSID and ensure you trust the physical premises before joining.',
    });
    recommendations.push('Only join Wi-Fi networks in venues you explicitly recognize.');
    return {
      id: 'scan-' + Date.now(),
      url: trimmed,
      timestamp: Date.now(),
      riskScore: 10,
      verdict: 'safe',
      verdictTitle: 'Wi-Fi Configuration Code',
      verdictSummary: 'This QR code provisions network credentials without loading remote web pages.',
      method,
      evidence,
      parsedUrl: parsed,
      recommendations,
      threatVector: 'Local Network Configuration',
      scanDurationMs: Math.round(performance.now() - startTime),
    };
  }

  // 1. Raw IP Address Check (Critical)
  if (parsed.isRawIp) {
    riskScore += 45;
    evidence.push({
      id: 'raw_ip',
      category: 'ip',
      rule: 'Unresolved Raw IP Address Host',
      description: `URL points directly to numerical IP (${parsed.hostname}) bypassing registered DNS domain hierarchy.`,
      severity: 'critical',
      points: 45,
      details: 'Legitimate consumer and payment services almost never use raw IP URLs in public physical signage.',
    });
    recommendations.push('Do NOT input credentials or banking data on unmapped numerical IP hosts.');
  }

  // 2. Insecure Protocol Check
  if (parsed.protocol === 'http') {
    riskScore += 25;
    evidence.push({
      id: 'insecure_http',
      category: 'protocol',
      rule: 'Cleartext HTTP (No TLS/SSL)',
      description: 'Destination communicates via unencrypted HTTP. Data sent can be intercepted or manipulated in transit.',
      severity: 'suspicious',
      points: 25,
      details: 'All modern legitimate billing, parking, and postal portals enforce HTTPS.',
    });
    recommendations.push('Verify if a secure HTTPS alternative exists; never submit passwords over HTTP.');
  } else if (parsed.protocol === 'https') {
    evidence.push({
      id: 'secure_https',
      category: 'protocol',
      rule: 'Valid TLS Transport Protocol',
      description: 'Connection uses encrypted HTTPS protocol.',
      severity: 'safe',
      points: 0,
    });
  }

  // 3. Brand Lookalike / Typosquatting (Critical)
  if (parsed.isLookalike) {
    riskScore += 40;
    evidence.push({
      id: 'brand_spoofing',
      category: 'domain',
      rule: `Spoofed / Impersonated Brand Target: ${parsed.targetBrand}`,
      description: `Domain borrows keywords from ${parsed.targetBrand} but is registered on an unrelated third-party host (${parsed.hostname}).`,
      severity: 'critical',
      points: 40,
      details: 'Classic Quishing Tactic: Scammers print stickers using familiar brand names in the subdomain to trick hurried users.',
    });
    recommendations.push(`Navigate directly to the official app or verified domain for ${parsed.targetBrand} rather than opening this link.`);
  }

  // 4. URL Shortener / Redirect Cloaking (Suspicious/Critical in physical context)
  if (parsed.isShortener) {
    riskScore += 30;
    evidence.push({
      id: 'url_shortener',
      category: 'redirect',
      rule: 'Opaque URL Shortener Link',
      description: `Host "${parsed.hostname}" is a redirect aggregator that conceals the ultimate landing destination.`,
      severity: 'suspicious',
      points: 30,
      details: 'Attackers commonly use shorteners on physical stickers to bypass phone camera domain previews.',
    });
    recommendations.push('Expand the shortened URL in an isolated sandbox or inspect redirect hops before browsing.');
  }

  // 5. High-Risk TLD
  if (parsed.isHighRiskTld) {
    riskScore += 25;
    evidence.push({
      id: 'high_risk_tld',
      category: 'domain',
      rule: `High-Risk Top Level Domain (.${parsed.tld})`,
      description: `TLD ".${parsed.tld}" is statistically associated with high disposable phishing campaign churn.`,
      severity: 'suspicious',
      points: 25,
      details: 'Disposable registrar pricing makes these domains cost-effective for mass physical stickering campaigns.',
    });
  }

  // 6. Urgency & Payment Keyword Traps
  const urgencyMatches = parsed.matchedKeywords.filter((k) => URGENCY_KEYWORDS.includes(k));
  const paymentMatches = parsed.matchedKeywords.filter((k) => PAYMENT_KEYWORDS.includes(k));
  const credMatches = parsed.matchedKeywords.filter((k) => CREDENTIAL_KEYWORDS.includes(k));

  if (urgencyMatches.length > 0) {
    riskScore += 15;
    evidence.push({
      id: 'urgency_triggers',
      category: 'keywords',
      rule: 'Artificial Urgency Triggers in Path',
      description: `URL contains coercion terms: [${urgencyMatches.join(', ')}] designed to bypass critical thinking.`,
      severity: 'suspicious',
      points: 15,
      details: 'Quishing relies on fast reaction times before the victim questions physical sticker legitimacy.',
    });
    recommendations.push('Pause and double check: municipal parking authorities and post offices do not issue immediate threats via stickers.');
  }

  if (paymentMatches.length > 0 && credMatches.length > 0) {
    riskScore += 20;
    evidence.push({
      id: 'credential_harvesting',
      category: 'keywords',
      rule: 'Concurrent Payment & Authentication Tokens',
      description: `URL combines payment and credential acquisition endpoints: [${[...paymentMatches, ...credMatches].join(', ')}].`,
      severity: 'critical',
      points: 20,
    });
  }

  // 7. Non-standard port
  if (parsed.port && !['80', '443'].includes(parsed.port)) {
    riskScore += 20;
    evidence.push({
      id: 'custom_port',
      category: 'structure',
      rule: `Non-Standard Network Port (:${parsed.port})`,
      description: `Traffic routes through atypical port ${parsed.port}, often indicative of attacker-controlled rogue tunnels.`,
      severity: 'suspicious',
      points: 20,
    });
  }

  // 8. High Entropy Subdomain Check
  if (parsed.entropy > 3.8 && parsed.hostname.split('.').length > 3) {
    riskScore += 15;
    evidence.push({
      id: 'high_entropy',
      category: 'structure',
      rule: 'High-Entropy Algorithmic Subdomain',
      description: 'Domain exhibits high randomness characteristic of automated domain generation algorithms (DGA).',
      severity: 'suspicious',
      points: 15,
    });
  }

  // Cap score to 100
  riskScore = Math.min(100, riskScore);

  // If score is clean and no red flags, add clean certificates/evidence
  if (riskScore === 0) {
    evidence.push({
      id: 'clean_domain',
      category: 'reputation',
      rule: 'Standard Domain Structure & Reputation',
      description: 'Domain complies with standard naming conventions with no detected impersonation or payload triggers.',
      severity: 'safe',
      points: 0,
      details: 'Root domain matches established public infrastructure.',
    });
    recommendations.push('URL passed all heuristic tests. Always ensure your device browser shows the expected lock icon.');
  }

  // Determine Verdict
  let verdict: ThreatLevel = 'safe';
  let verdictTitle = 'Safe to Open';
  let verdictSummary = 'No anomalous quishing indicators, obfuscations, or deceptive brand impersonation detected.';

  if (riskScore >= 60) {
    verdict = 'critical';
    verdictTitle = 'Critical Quishing Threat Detected';
    verdictSummary = 'High-confidence phishing campaign detected. This code strongly exhibits characteristics of physical sticker tampering or credential harvesting.';
    if (!recommendations.includes('Do NOT proceed to this link.')) {
      recommendations.unshift('DO NOT open this link on your primary phone or submit any financial details.');
    }
  } else if (riskScore >= 25) {
    verdict = 'suspicious';
    verdictTitle = 'Suspicious QR Link — Exercise Caution';
    verdictSummary = 'Multiple risk signals detected (such as redirection cloaking, abnormal TLD, or urgency keywords). Proceed only with sandbox preview.';
    recommendations.push('Inspect the destination in an isolated incognito session or cross-reference the organization website directly.');
  }

  // Identify physical threat vector
  let threatVector = 'Standard Web Link';
  if (parsed.targetBrand?.includes('Parking') || parsed.matchedKeywords.includes('park') || parsed.matchedKeywords.includes('meter')) {
    threatVector = 'Parking Meter Overlay Scam';
  } else if (parsed.targetBrand?.includes('Postal') || parsed.targetBrand?.includes('FedEx') || parsed.matchedKeywords.includes('package')) {
    threatVector = 'Counterfeit Delivery Notification';
  } else if (parsed.targetBrand?.includes('PayPal') || parsed.targetBrand?.includes('Bank')) {
    threatVector = 'Financial Credential Harvester';
  } else if (parsed.isShortener) {
    threatVector = 'Cloaked Redirect Camouflage';
  }

  return {
    id: 'scan-' + Date.now(),
    url: rawInput,
    timestamp: Date.now(),
    riskScore,
    verdict,
    verdictTitle,
    verdictSummary,
    method,
    evidence,
    parsedUrl: parsed,
    recommendations,
    threatVector,
    scanDurationMs: Math.round(performance.now() - startTime),
  };
}
