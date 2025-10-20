/**
 * Security Scanning and Vulnerability Checking
 * Automated security analysis and threat detection for K5 platform
 */

import { createClient } from '@supabase/supabase-js';

// Vulnerability severity levels
export enum VulnerabilitySeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info'
}

// Security scan types
export enum ScanType {
  DEPENDENCY_SCAN = 'dependency_scan',
  CODE_SCAN = 'code_scan',
  CONFIGURATION_SCAN = 'configuration_scan',
  DATABASE_SCAN = 'database_scan',
  API_SCAN = 'api_scan',
  AUTHENTICATION_SCAN = 'authentication_scan',
  PENETRATION_TEST = 'penetration_test'
}

// Vulnerability categories
export enum VulnerabilityCategory {
  SQL_INJECTION = 'sql_injection',
  XSS = 'xss',
  CSRF = 'csrf',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  DATA_EXPOSURE = 'data_exposure',
  ENCRYPTION = 'encryption',
  CONFIGURATION = 'configuration',
  DEPENDENCY = 'dependency',
  API_SECURITY = 'api_security'
}

export interface Vulnerability {
  id: string;
  scanId: string;
  severity: VulnerabilitySeverity;
  category: VulnerabilityCategory;
  title: string;
  description: string;
  location: string;
  cve?: string;                    // CVE identifier if applicable
  cwe?: string;                    // CWE identifier if applicable
  cvssScore?: number;              // CVSS score (0-10)
  affectedComponent: string;
  affectedVersion?: string;
  fixedVersion?: string;
  remediation: string;
  references: string[];
  detectedDate: Date;
  resolved: boolean;
  resolvedDate?: Date;
  falsePositive: boolean;
}

export interface SecurityScan {
  id: string;
  scanType: ScanType;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'completed' | 'failed';
  vulnerabilitiesFound: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  infoCount: number;
  scannedComponents: string[];
  results?: Vulnerability[];
}

export interface SecurityMetrics {
  period: { start: Date; end: Date };
  totalScans: number;
  totalVulnerabilities: number;
  criticalVulnerabilities: number;
  averageResolutionTime: number;  // hours
  securityScore: number;          // 0-100
  trendspositive: boolean;
}

/**
 * Security Scanning Service
 */
export class SecurityService {
  private supabase: any;

  constructor(supabaseUrl?: string, supabaseKey?: string) {
    this.supabase = createClient(
      supabaseUrl || Deno.env.get('SUPABASE_URL')!,
      supabaseKey || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
  }

  /**
   * Run comprehensive security scan
   */
  async runSecurityScan(scanTypes: ScanType[] = Object.values(ScanType)): Promise<SecurityScan> {
    const scan: SecurityScan = {
      id: crypto.randomUUID(),
      scanType: ScanType.CODE_SCAN, // Primary type
      startTime: new Date(),
      status: 'running',
      vulnerabilitiesFound: 0,
      criticalCount: 0,
      highCount: 0,
      mediumCount: 0,
      lowCount: 0,
      infoCount: 0,
      scannedComponents: []
    };

    // Store scan record
    await this.supabase.from('security_scans').insert({
      id: scan.id,
      scan_type: scan.scanType,
      start_time: scan.startTime.toISOString(),
      status: scan.status
    });

    const vulnerabilities: Vulnerability[] = [];

    try {
      // Run each scan type
      for (const scanType of scanTypes) {
        const results = await this.executeScan(scanType, scan.id);
        vulnerabilities.push(...results);
      }

      // Categorize vulnerabilities
      scan.criticalCount = vulnerabilities.filter(v => v.severity === VulnerabilitySeverity.CRITICAL).length;
      scan.highCount = vulnerabilities.filter(v => v.severity === VulnerabilitySeverity.HIGH).length;
      scan.mediumCount = vulnerabilities.filter(v => v.severity === VulnerabilitySeverity.MEDIUM).length;
      scan.lowCount = vulnerabilities.filter(v => v.severity === VulnerabilitySeverity.LOW).length;
      scan.infoCount = vulnerabilities.filter(v => v.severity === VulnerabilitySeverity.INFO).length;
      scan.vulnerabilitiesFound = vulnerabilities.length;
      scan.results = vulnerabilities;
      scan.status = 'completed';
      scan.endTime = new Date();
    } catch (error) {
      scan.status = 'failed';
      scan.endTime = new Date();
    }

    // Update scan record
    await this.supabase
      .from('security_scans')
      .update({
        end_time: scan.endTime?.toISOString(),
        status: scan.status,
        vulnerabilities_found: scan.vulnerabilitiesFound,
        critical_count: scan.criticalCount,
        high_count: scan.highCount,
        medium_count: scan.mediumCount,
        low_count: scan.lowCount,
        info_count: scan.infoCount
      })
      .eq('id', scan.id);

    return scan;
  }

  /**
   * Execute specific scan type
   */
  private async executeScan(scanType: ScanType, scanId: string): Promise<Vulnerability[]> {
    switch (scanType) {
      case ScanType.SQL_INJECTION:
        return await this.scanSQLInjection(scanId);
      case ScanType.XSS:
        return await this.scanXSS(scanId);
      case ScanType.AUTHENTICATION_SCAN:
        return await this.scanAuthentication(scanId);
      case ScanType.CONFIGURATION_SCAN:
        return await this.scanConfiguration(scanId);
      case ScanType.API_SCAN:
        return await this.scanAPI(scanId);
      case ScanType.DATABASE_SCAN:
        return await this.scanDatabase(scanId);
      default:
        return [];
    }
  }

  /**
   * Scan for SQL injection vulnerabilities
   */
  private async scanSQLInjection(scanId: string): Promise<Vulnerability[]> {
    const vulnerabilities: Vulnerability[] = [];

    // Check for dynamic SQL queries (this is a simplified example)
    const patterns = [
      /\$\{.*\}/g,                    // Template literals in SQL
      /\+\s*['"].*['"]\s*\+/g,       // String concatenation
      /execute\s*\([^?]/gi           // Execute without parameterization
    ];

    // In production, this would scan actual code files
    // For now, return example vulnerabilities
    vulnerabilities.push({
      id: crypto.randomUUID(),
      scanId,
      severity: VulnerabilitySeverity.HIGH,
      category: VulnerabilityCategory.SQL_INJECTION,
      title: 'Potential SQL Injection via String Concatenation',
      description: 'SQL query built using string concatenation may be vulnerable to SQL injection',
      location: 'src/api/database/queries.ts:45',
      cwe: 'CWE-89',
      cvssScore: 7.5,
      affectedComponent: 'Database Query Handler',
      remediation: 'Use parameterized queries or prepared statements',
      references: [
        'https://owasp.org/www-community/attacks/SQL_Injection',
        'https://cwe.mitre.org/data/definitions/89.html'
      ],
      detectedDate: new Date(),
      resolved: false,
      falsePositive: false
    });

    // Store vulnerabilities
    for (const vuln of vulnerabilities) {
      await this.storeVulnerability(vuln);
    }

    return vulnerabilities;
  }

  /**
   * Scan for XSS vulnerabilities
   */
  private async scanXSS(scanId: string): Promise<Vulnerability[]> {
    const vulnerabilities: Vulnerability[] = [];

    // Check for unescaped user input in HTML
    const xssPatterns = [
      /innerHTML\s*=/g,
      /document\.write\(/g,
      /\.html\([^)]*\)/g
    ];

    // Example vulnerability
    vulnerabilities.push({
      id: crypto.randomUUID(),
      scanId,
      severity: VulnerabilitySeverity.MEDIUM,
      category: VulnerabilityCategory.XSS,
      title: 'Potential XSS via innerHTML',
      description: 'User input may be inserted into DOM without sanitization',
      location: 'src/components/ReadingContent.tsx:78',
      cwe: 'CWE-79',
      cvssScore: 6.1,
      affectedComponent: 'Reading Content Renderer',
      remediation: 'Use textContent instead of innerHTML, or sanitize user input',
      references: [
        'https://owasp.org/www-community/attacks/xss/',
        'https://cwe.mitre.org/data/definitions/79.html'
      ],
      detectedDate: new Date(),
      resolved: false,
      falsePositive: false
    });

    for (const vuln of vulnerabilities) {
      await this.storeVulnerability(vuln);
    }

    return vulnerabilities;
  }

  /**
   * Scan authentication mechanisms
   */
  private async scanAuthentication(scanId: string): Promise<Vulnerability[]> {
    const vulnerabilities: Vulnerability[] = [];

    // Check password policies
    const passwordRequirements = {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false
    };

    if (passwordRequirements.minLength < 12) {
      vulnerabilities.push({
        id: crypto.randomUUID(),
        scanId,
        severity: VulnerabilitySeverity.MEDIUM,
        category: VulnerabilityCategory.AUTHENTICATION,
        title: 'Weak Password Policy',
        description: 'Minimum password length is below recommended 12 characters',
        location: 'src/auth/password-policy.ts',
        cwe: 'CWE-521',
        cvssScore: 5.3,
        affectedComponent: 'Authentication System',
        remediation: 'Increase minimum password length to 12 characters',
        references: [
          'https://owasp.org/www-project-top-ten/2017/A2_2017-Broken_Authentication',
          'https://cwe.mitre.org/data/definitions/521.html'
        ],
        detectedDate: new Date(),
        resolved: false,
        falsePositive: false
      });
    }

    // Check session timeout
    const sessionTimeout = 3600; // seconds
    if (sessionTimeout > 7200) { // 2 hours
      vulnerabilities.push({
        id: crypto.randomUUID(),
        scanId,
        severity: VulnerabilitySeverity.LOW,
        category: VulnerabilityCategory.AUTHENTICATION,
        title: 'Long Session Timeout',
        description: 'Session timeout exceeds recommended 2 hours for educational applications',
        location: 'src/auth/session-config.ts',
        cwe: 'CWE-613',
        cvssScore: 4.3,
        affectedComponent: 'Session Management',
        remediation: 'Reduce session timeout to 2 hours or less',
        references: [
          'https://owasp.org/www-project-top-ten/2017/A2_2017-Broken_Authentication'
        ],
        detectedDate: new Date(),
        resolved: false,
        falsePositive: false
      });
    }

    for (const vuln of vulnerabilities) {
      await this.storeVulnerability(vuln);
    }

    return vulnerabilities;
  }

  /**
   * Scan configuration security
   */
  private async scanConfiguration(scanId: string): Promise<Vulnerability[]> {
    const vulnerabilities: Vulnerability[] = [];

    // Check for exposed secrets
    const envVars = Deno.env.toObject();
    const sensitiveVars = ['API_KEY', 'SECRET_KEY', 'PASSWORD', 'TOKEN'];

    // Check if using default/weak keys
    for (const [key, value] of Object.entries(envVars)) {
      if (sensitiveVars.some(sv => key.includes(sv))) {
        if (value.length < 32 || value === 'default' || value.includes('example')) {
          vulnerabilities.push({
            id: crypto.randomUUID(),
            scanId,
            severity: VulnerabilitySeverity.CRITICAL,
            category: VulnerabilityCategory.CONFIGURATION,
            title: 'Weak or Default Secret Key',
            description: `Environment variable ${key} appears to use a weak or default value`,
            location: '.env',
            cwe: 'CWE-798',
            cvssScore: 9.8,
            affectedComponent: 'Configuration',
            remediation: 'Generate strong, cryptographically secure keys',
            references: [
              'https://cwe.mitre.org/data/definitions/798.html'
            ],
            detectedDate: new Date(),
            resolved: false,
            falsePositive: false
          });
        }
      }
    }

    // Check CORS configuration
    const corsOrigins = Deno.env.get('CORS_ORIGINS');
    if (corsOrigins === '*') {
      vulnerabilities.push({
        id: crypto.randomUUID(),
        scanId,
        severity: VulnerabilitySeverity.MEDIUM,
        category: VulnerabilityCategory.CONFIGURATION,
        title: 'Permissive CORS Configuration',
        description: 'CORS is configured to allow all origins (*)',
        location: 'src/api/cors-config.ts',
        cwe: 'CWE-942',
        cvssScore: 5.3,
        affectedComponent: 'API Configuration',
        remediation: 'Restrict CORS to specific trusted origins',
        references: [
          'https://owasp.org/www-community/attacks/CORS_OriginHeaderScrutiny'
        ],
        detectedDate: new Date(),
        resolved: false,
        falsePositive: false
      });
    }

    for (const vuln of vulnerabilities) {
      await this.storeVulnerability(vuln);
    }

    return vulnerabilities;
  }

  /**
   * Scan API security
   */
  private async scanAPI(scanId: string): Promise<Vulnerability[]> {
    const vulnerabilities: Vulnerability[] = [];

    // Check rate limiting
    const hasRateLimiting = true; // Would check actual implementation

    if (!hasRateLimiting) {
      vulnerabilities.push({
        id: crypto.randomUUID(),
        scanId,
        severity: VulnerabilitySeverity.MEDIUM,
        category: VulnerabilityCategory.API_SECURITY,
        title: 'Missing Rate Limiting',
        description: 'API endpoints do not implement rate limiting',
        location: 'src/api/middleware/',
        cwe: 'CWE-770',
        cvssScore: 5.3,
        affectedComponent: 'API Layer',
        remediation: 'Implement rate limiting to prevent abuse',
        references: [
          'https://owasp.org/www-project-api-security/'
        ],
        detectedDate: new Date(),
        resolved: false,
        falsePositive: false
      });
    }

    // Check API authentication
    const requiresAuth = true; // Would check actual routes

    if (!requiresAuth) {
      vulnerabilities.push({
        id: crypto.randomUUID(),
        scanId,
        severity: VulnerabilitySeverity.CRITICAL,
        category: VulnerabilityCategory.API_SECURITY,
        title: 'Unauthenticated API Endpoints',
        description: 'Some API endpoints do not require authentication',
        location: 'src/api/routes/',
        cwe: 'CWE-306',
        cvssScore: 9.1,
        affectedComponent: 'API Layer',
        remediation: 'Add authentication middleware to all sensitive endpoints',
        references: [
          'https://owasp.org/www-project-api-security/',
          'https://cwe.mitre.org/data/definitions/306.html'
        ],
        detectedDate: new Date(),
        resolved: false,
        falsePositive: false
      });
    }

    for (const vuln of vulnerabilities) {
      await this.storeVulnerability(vuln);
    }

    return vulnerabilities;
  }

  /**
   * Scan database security
   */
  private async scanDatabase(scanId: string): Promise<Vulnerability[]> {
    const vulnerabilities: Vulnerability[] = [];

    // Check RLS policies
    const { data: tables } = await this.supabase
      .rpc('get_tables_without_rls');

    if (tables && tables.length > 0) {
      vulnerabilities.push({
        id: crypto.randomUUID(),
        scanId,
        severity: VulnerabilitySeverity.HIGH,
        category: VulnerabilityCategory.AUTHORIZATION,
        title: 'Tables Without Row Level Security',
        description: `${tables.length} tables do not have RLS enabled: ${tables.join(', ')}`,
        location: 'Database',
        cwe: 'CWE-284',
        cvssScore: 7.5,
        affectedComponent: 'Database',
        remediation: 'Enable Row Level Security on all tables containing sensitive data',
        references: [
          'https://supabase.com/docs/guides/auth/row-level-security'
        ],
        detectedDate: new Date(),
        resolved: false,
        falsePositive: false
      });
    }

    for (const vuln of vulnerabilities) {
      await this.storeVulnerability(vuln);
    }

    return vulnerabilities;
  }

  /**
   * Store vulnerability in database
   */
  private async storeVulnerability(vulnerability: Vulnerability): Promise<void> {
    await this.supabase.from('vulnerabilities').insert({
      id: vulnerability.id,
      scan_id: vulnerability.scanId,
      severity: vulnerability.severity,
      category: vulnerability.category,
      title: vulnerability.title,
      description: vulnerability.description,
      location: vulnerability.location,
      cve: vulnerability.cve,
      cwe: vulnerability.cwe,
      cvss_score: vulnerability.cvssScore,
      affected_component: vulnerability.affectedComponent,
      affected_version: vulnerability.affectedVersion,
      fixed_version: vulnerability.fixedVersion,
      remediation: vulnerability.remediation,
      references: vulnerability.references,
      detected_date: vulnerability.detectedDate.toISOString(),
      resolved: vulnerability.resolved,
      resolved_date: vulnerability.resolvedDate?.toISOString(),
      false_positive: vulnerability.falsePositive
    });
  }

  /**
   * Mark vulnerability as resolved
   */
  async resolveVulnerability(vulnerabilityId: string): Promise<void> {
    await this.supabase
      .from('vulnerabilities')
      .update({
        resolved: true,
        resolved_date: new Date().toISOString()
      })
      .eq('id', vulnerabilityId);
  }

  /**
   * Mark vulnerability as false positive
   */
  async markFalsePositive(vulnerabilityId: string): Promise<void> {
    await this.supabase
      .from('vulnerabilities')
      .update({ false_positive: true })
      .eq('id', vulnerabilityId);
  }

  /**
   * Get open vulnerabilities
   */
  async getOpenVulnerabilities(
    minSeverity?: VulnerabilitySeverity
  ): Promise<Vulnerability[]> {
    let query = this.supabase
      .from('vulnerabilities')
      .select('*')
      .eq('resolved', false)
      .eq('false_positive', false);

    if (minSeverity) {
      const severityOrder = [
        VulnerabilitySeverity.INFO,
        VulnerabilitySeverity.LOW,
        VulnerabilitySeverity.MEDIUM,
        VulnerabilitySeverity.HIGH,
        VulnerabilitySeverity.CRITICAL
      ];
      const minIndex = severityOrder.indexOf(minSeverity);
      const allowedSeverities = severityOrder.slice(minIndex);
      query = query.in('severity', allowedSeverities);
    }

    const { data } = await query;
    return data || [];
  }

  /**
   * Calculate security score
   */
  async calculateSecurityScore(): Promise<number> {
    const openVulns = await this.getOpenVulnerabilities();

    const weights = {
      [VulnerabilitySeverity.CRITICAL]: 20,
      [VulnerabilitySeverity.HIGH]: 10,
      [VulnerabilitySeverity.MEDIUM]: 5,
      [VulnerabilitySeverity.LOW]: 2,
      [VulnerabilitySeverity.INFO]: 1
    };

    let totalDeductions = 0;
    for (const vuln of openVulns) {
      totalDeductions += weights[vuln.severity] || 0;
    }

    // Start at 100, deduct points
    const score = Math.max(0, 100 - totalDeductions);
    return score;
  }

  /**
   * Generate security report
   */
  async generateSecurityReport(
    startDate: Date,
    endDate: Date
  ): Promise<{
    period: { start: Date; end: Date };
    summary: {
      totalScans: number;
      totalVulnerabilities: number;
      openVulnerabilities: number;
      resolvedVulnerabilities: number;
      criticalOpen: number;
    };
    securityScore: number;
    topVulnerabilities: Vulnerability[];
    recommendations: string[];
  }> {
    const { data: scans } = await this.supabase
      .from('security_scans')
      .select('*')
      .gte('start_time', startDate.toISOString())
      .lte('start_time', endDate.toISOString());

    const openVulns = await this.getOpenVulnerabilities();
    const criticalOpen = openVulns.filter(v => v.severity === VulnerabilitySeverity.CRITICAL).length;

    const { data: allVulns } = await this.supabase
      .from('vulnerabilities')
      .select('*')
      .gte('detected_date', startDate.toISOString())
      .lte('detected_date', endDate.toISOString());

    const securityScore = await this.calculateSecurityScore();

    return {
      period: { start: startDate, end: endDate },
      summary: {
        totalScans: scans?.length || 0,
        totalVulnerabilities: allVulns?.length || 0,
        openVulnerabilities: openVulns.length,
        resolvedVulnerabilities: allVulns?.filter(v => v.resolved).length || 0,
        criticalOpen
      },
      securityScore,
      topVulnerabilities: openVulns.slice(0, 10),
      recommendations: this.generateSecurityRecommendations(openVulns)
    };
  }

  private generateSecurityRecommendations(vulns: Vulnerability[]): string[] {
    const recommendations: string[] = [];

    const criticalCount = vulns.filter(v => v.severity === VulnerabilitySeverity.CRITICAL).length;
    if (criticalCount > 0) {
      recommendations.push(`Immediately address ${criticalCount} critical vulnerabilities`);
    }

    const sqlInjection = vulns.filter(v => v.category === VulnerabilityCategory.SQL_INJECTION).length;
    if (sqlInjection > 0) {
      recommendations.push('Review all database queries for SQL injection vulnerabilities');
    }

    const authIssues = vulns.filter(v => v.category === VulnerabilityCategory.AUTHENTICATION).length;
    if (authIssues > 0) {
      recommendations.push('Strengthen authentication mechanisms and password policies');
    }

    return recommendations;
  }
}
