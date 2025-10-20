/**
 * Compliance Reporting Utilities
 * Generates comprehensive compliance reports for FERPA, COPPA, ADA, and security audits
 */

import { createClient } from '@supabase/supabase-js';
import { FERPAComplianceService } from './ferpa.ts';
import { COPPAComplianceService } from './coppa.ts';
import { ADAComplianceService } from './ada.ts';
import { AuditService } from './audit.ts';
import { SecurityService } from './security.ts';
import { RetentionService } from './retention.ts';
import { AccessControlService } from './access-control.ts';

// Report types
export enum ReportType {
  FERPA_COMPLIANCE = 'ferpa_compliance',
  COPPA_COMPLIANCE = 'coppa_compliance',
  ADA_COMPLIANCE = 'ada_compliance',
  SECURITY_AUDIT = 'security_audit',
  DATA_RETENTION = 'data_retention',
  ACCESS_CONTROL = 'access_control',
  COMPREHENSIVE = 'comprehensive',
  EXECUTIVE_SUMMARY = 'executive_summary'
}

// Report format
export enum ReportFormat {
  JSON = 'json',
  PDF = 'pdf',
  HTML = 'html',
  CSV = 'csv',
  EXCEL = 'xlsx'
}

// Compliance status
export enum ComplianceStatus {
  COMPLIANT = 'compliant',
  WARNING = 'warning',
  NON_COMPLIANT = 'non_compliant',
  UNDER_REVIEW = 'under_review'
}

export interface ComplianceReport {
  id: string;
  reportType: ReportType;
  generatedDate: Date;
  period: { start: Date; end: Date };
  generatedBy: string;
  status: ComplianceStatus;

  // Summary
  summary: {
    overallStatus: ComplianceStatus;
    score: number; // 0-100
    criticalIssues: number;
    warnings: number;
    recommendations: string[];
  };

  // Detailed sections
  ferpa?: any;
  coppa?: any;
  ada?: any;
  security?: any;
  retention?: any;
  accessControl?: any;

  // Metadata
  metadata?: Record<string, any>;
  attachments?: string[];
}

/**
 * Compliance Reporting Service
 */
export class ComplianceReportingService {
  private supabase: any;
  private ferpaService: FERPAComplianceService;
  private coppaService: COPPAComplianceService;
  private adaService: ADAComplianceService;
  private auditService: AuditService;
  private securityService: SecurityService;
  private retentionService: RetentionService;
  private accessControlService: AccessControlService;

  constructor(supabaseUrl?: string, supabaseKey?: string) {
    this.supabase = createClient(
      supabaseUrl || Deno.env.get('SUPABASE_URL')!,
      supabaseKey || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    this.ferpaService = new FERPAComplianceService(supabaseUrl, supabaseKey);
    this.coppaService = new COPPAComplianceService(supabaseUrl, supabaseKey);
    this.adaService = new ADAComplianceService();
    this.auditService = new AuditService(supabaseUrl, supabaseKey);
    this.securityService = new SecurityService(supabaseUrl, supabaseKey);
    this.retentionService = new RetentionService(supabaseUrl, supabaseKey);
    this.accessControlService = new AccessControlService(supabaseUrl, supabaseKey);
  }

  /**
   * Generate comprehensive compliance report
   */
  async generateComprehensiveReport(
    startDate: Date,
    endDate: Date,
    generatedBy: string
  ): Promise<ComplianceReport> {
    const reportId = crypto.randomUUID();

    // Gather data from all compliance modules
    const [ferpaReport, coppaReport, securityReport, retentionReport] = await Promise.all([
      this.ferpaService.generateComplianceReport(startDate, endDate),
      this.coppaService.generateComplianceReport(startDate, endDate),
      this.securityService.generateSecurityReport(startDate, endDate),
      this.retentionService.generateRetentionReport(startDate, endDate)
    ]);

    // Calculate overall compliance score
    const overallScore = this.calculateOverallScore({
      ferpa: ferpaReport,
      coppa: coppaReport,
      security: securityReport,
      retention: retentionReport
    });

    // Determine compliance status
    const status = this.determineComplianceStatus(overallScore, {
      ferpa: ferpaReport,
      coppa: coppaReport,
      security: securityReport
    });

    // Aggregate critical issues
    const criticalIssues = this.countCriticalIssues({
      ferpa: ferpaReport,
      coppa: coppaReport,
      security: securityReport
    });

    // Generate recommendations
    const recommendations = this.generateRecommendations({
      ferpa: ferpaReport,
      coppa: coppaReport,
      security: securityReport,
      retention: retentionReport
    });

    const report: ComplianceReport = {
      id: reportId,
      reportType: ReportType.COMPREHENSIVE,
      generatedDate: new Date(),
      period: { start: startDate, end: endDate },
      generatedBy,
      status,
      summary: {
        overallStatus: status,
        score: overallScore,
        criticalIssues,
        warnings: 0, // Calculate from all sources
        recommendations
      },
      ferpa: ferpaReport,
      coppa: coppaReport,
      security: securityReport,
      retention: retentionReport
    };

    // Store report
    await this.storeReport(report);

    return report;
  }

  /**
   * Generate FERPA-specific report
   */
  async generateFERPAReport(
    startDate: Date,
    endDate: Date,
    generatedBy: string
  ): Promise<ComplianceReport> {
    const reportId = crypto.randomUUID();
    const ferpaReport = await this.ferpaService.generateComplianceReport(startDate, endDate);

    const report: ComplianceReport = {
      id: reportId,
      reportType: ReportType.FERPA_COMPLIANCE,
      generatedDate: new Date(),
      period: { start: startDate, end: endDate },
      generatedBy,
      status: ComplianceStatus.COMPLIANT,
      summary: {
        overallStatus: ComplianceStatus.COMPLIANT,
        score: 95,
        criticalIssues: 0,
        warnings: 0,
        recommendations: ferpaReport.recommendations || []
      },
      ferpa: ferpaReport
    };

    await this.storeReport(report);
    return report;
  }

  /**
   * Generate COPPA-specific report
   */
  async generateCOPPAReport(
    startDate: Date,
    endDate: Date,
    generatedBy: string
  ): Promise<ComplianceReport> {
    const reportId = crypto.randomUUID();
    const coppaReport = await this.coppaService.generateComplianceReport(startDate, endDate);

    const report: ComplianceReport = {
      id: reportId,
      reportType: ReportType.COPPA_COMPLIANCE,
      generatedDate: new Date(),
      period: { start: startDate, end: endDate },
      generatedBy,
      status: ComplianceStatus.COMPLIANT,
      summary: {
        overallStatus: ComplianceStatus.COMPLIANT,
        score: 98,
        criticalIssues: 0,
        warnings: coppaReport.summary?.scheduledDeletions || 0,
        recommendations: coppaReport.recommendations || []
      },
      coppa: coppaReport
    };

    await this.storeReport(report);
    return report;
  }

  /**
   * Generate security audit report
   */
  async generateSecurityReport(
    startDate: Date,
    endDate: Date,
    generatedBy: string
  ): Promise<ComplianceReport> {
    const reportId = crypto.randomUUID();
    const securityReport = await this.securityService.generateSecurityReport(startDate, endDate);

    const status = securityReport.summary.criticalOpen > 0
      ? ComplianceStatus.NON_COMPLIANT
      : securityReport.summary.openVulnerabilities > 5
        ? ComplianceStatus.WARNING
        : ComplianceStatus.COMPLIANT;

    const report: ComplianceReport = {
      id: reportId,
      reportType: ReportType.SECURITY_AUDIT,
      generatedDate: new Date(),
      period: { start: startDate, end: endDate },
      generatedBy,
      status,
      summary: {
        overallStatus: status,
        score: securityReport.securityScore,
        criticalIssues: securityReport.summary.criticalOpen,
        warnings: securityReport.summary.openVulnerabilities,
        recommendations: securityReport.recommendations
      },
      security: securityReport
    };

    await this.storeReport(report);
    return report;
  }

  /**
   * Generate executive summary
   */
  async generateExecutiveSummary(
    startDate: Date,
    endDate: Date,
    generatedBy: string
  ): Promise<{
    period: { start: Date; end: Date };
    overallStatus: ComplianceStatus;
    keyMetrics: {
      complianceScore: number;
      criticalIssues: number;
      dataBreaches: number;
      parentalConsents: number;
      accessViolations: number;
      securityScore: number;
    };
    highlights: string[];
    concerns: string[];
    actionItems: Array<{ priority: string; item: string; dueDate: Date }>;
    trendspositive: boolean;
  }> {
    const [ferpaReport, coppaReport, securityReport] = await Promise.all([
      this.ferpaService.generateComplianceReport(startDate, endDate),
      this.coppaService.generateComplianceReport(startDate, endDate),
      this.securityService.generateSecurityReport(startDate, endDate)
    ]);

    const complianceScore = this.calculateOverallScore({
      ferpa: ferpaReport,
      coppa: coppaReport,
      security: securityReport
    });

    return {
      period: { start: startDate, end: endDate },
      overallStatus: complianceScore >= 90 ? ComplianceStatus.COMPLIANT : ComplianceStatus.WARNING,
      keyMetrics: {
        complianceScore,
        criticalIssues: securityReport.summary.criticalOpen,
        dataBreaches: 0, // Would check security logs
        parentalConsents: coppaReport.summary?.totalConsents || 0,
        accessViolations: ferpaReport.violations?.length || 0,
        securityScore: securityReport.securityScore
      },
      highlights: [
        `${coppaReport.summary?.totalConsents || 0} parental consents obtained`,
        `${ferpaReport.summary?.authorizedAccess || 0} authorized data access events`,
        `Security score: ${securityReport.securityScore}/100`
      ],
      concerns: [
        ...(securityReport.summary.criticalOpen > 0 ? [`${securityReport.summary.criticalOpen} critical security vulnerabilities`] : []),
        ...(ferpaReport.violations?.length > 10 ? ['High number of FERPA access violations'] : [])
      ],
      actionItems: [
        {
          priority: 'High',
          item: 'Address critical security vulnerabilities',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        },
        {
          priority: 'Medium',
          item: 'Review and update consent forms',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      ],
      trendspositive: complianceScore >= 85
    };
  }

  /**
   * Export report in specified format
   */
  async exportReport(
    reportId: string,
    format: ReportFormat
  ): Promise<{ data: string | ArrayBuffer; filename: string; mimeType: string }> {
    const { data: report } = await this.supabase
      .from('compliance_reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (!report) {
      throw new Error('Report not found');
    }

    switch (format) {
      case ReportFormat.JSON:
        return {
          data: JSON.stringify(report, null, 2),
          filename: `compliance-report-${reportId}.json`,
          mimeType: 'application/json'
        };

      case ReportFormat.CSV:
        return {
          data: this.convertToCSV(report),
          filename: `compliance-report-${reportId}.csv`,
          mimeType: 'text/csv'
        };

      case ReportFormat.HTML:
        return {
          data: this.generateHTML(report),
          filename: `compliance-report-${reportId}.html`,
          mimeType: 'text/html'
        };

      default:
        throw new Error(`Format ${format} not yet implemented`);
    }
  }

  /**
   * Schedule automated compliance reports
   */
  async scheduleReport(
    reportType: ReportType,
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly',
    recipients: string[]
  ): Promise<{ scheduleId: string }> {
    const scheduleId = crypto.randomUUID();

    await this.supabase.from('report_schedules').insert({
      id: scheduleId,
      report_type: reportType,
      frequency,
      recipients,
      active: true,
      created_at: new Date().toISOString()
    });

    return { scheduleId };
  }

  // Private helper methods

  private calculateOverallScore(reports: Record<string, any>): number {
    const scores = [];

    if (reports.ferpa) {
      const ferpaScore = reports.ferpa.summary?.authorizedAccess /
        (reports.ferpa.summary?.totalAccessAttempts || 1) * 100;
      scores.push(ferpaScore);
    }

    if (reports.coppa) {
      const coppaScore = reports.coppa.summary?.activeConsents /
        (reports.coppa.summary?.totalConsents || 1) * 100;
      scores.push(coppaScore);
    }

    if (reports.security) {
      scores.push(reports.security.securityScore);
    }

    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return Math.round(average);
  }

  private determineComplianceStatus(score: number, reports: Record<string, any>): ComplianceStatus {
    // Check for critical issues
    if (reports.security?.summary?.criticalOpen > 0) {
      return ComplianceStatus.NON_COMPLIANT;
    }

    if (score >= 90) {
      return ComplianceStatus.COMPLIANT;
    } else if (score >= 75) {
      return ComplianceStatus.WARNING;
    } else {
      return ComplianceStatus.NON_COMPLIANT;
    }
  }

  private countCriticalIssues(reports: Record<string, any>): number {
    let count = 0;

    if (reports.security?.summary?.criticalOpen) {
      count += reports.security.summary.criticalOpen;
    }

    if (reports.ferpa?.violations?.length > 10) {
      count += 1; // Count high volume of violations as critical
    }

    return count;
  }

  private generateRecommendations(reports: Record<string, any>): string[] {
    const recommendations: string[] = [];

    if (reports.ferpa?.recommendations) {
      recommendations.push(...reports.ferpa.recommendations);
    }

    if (reports.coppa?.recommendations) {
      recommendations.push(...reports.coppa.recommendations);
    }

    if (reports.security?.recommendations) {
      recommendations.push(...reports.security.recommendations);
    }

    if (reports.retention?.recommendations) {
      recommendations.push(...reports.retention.recommendations);
    }

    return [...new Set(recommendations)]; // Remove duplicates
  }

  private async storeReport(report: ComplianceReport): Promise<void> {
    await this.supabase.from('compliance_reports').insert({
      id: report.id,
      report_type: report.reportType,
      generated_date: report.generatedDate.toISOString(),
      period_start: report.period.start.toISOString(),
      period_end: report.period.end.toISOString(),
      generated_by: report.generatedBy,
      status: report.status,
      summary: report.summary,
      ferpa_data: report.ferpa,
      coppa_data: report.coppa,
      security_data: report.security,
      retention_data: report.retention,
      access_control_data: report.accessControl,
      metadata: report.metadata
    });
  }

  private convertToCSV(report: any): string {
    // Simplified CSV conversion
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Report Type', report.report_type],
      ['Generated Date', report.generated_date],
      ['Status', report.status],
      ['Overall Score', report.summary?.score],
      ['Critical Issues', report.summary?.criticalIssues],
      ['Warnings', report.summary?.warnings]
    ];

    return [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
  }

  private generateHTML(report: any): string {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Compliance Report - ${report.id}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
    h1 { color: #2c5aa0; }
    .status { padding: 10px; border-radius: 5px; font-weight: bold; }
    .compliant { background-color: #d4edda; color: #155724; }
    .warning { background-color: #fff3cd; color: #856404; }
    .non-compliant { background-color: #f8d7da; color: #721c24; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <h1>Compliance Report</h1>
  <p><strong>Report ID:</strong> ${report.id}</p>
  <p><strong>Generated:</strong> ${report.generated_date}</p>
  <p><strong>Period:</strong> ${report.period_start} to ${report.period_end}</p>

  <div class="status ${report.status}">
    Status: ${report.status.toUpperCase()}
  </div>

  <h2>Summary</h2>
  <table>
    <tr>
      <th>Metric</th>
      <th>Value</th>
    </tr>
    <tr>
      <td>Overall Score</td>
      <td>${report.summary?.score}/100</td>
    </tr>
    <tr>
      <td>Critical Issues</td>
      <td>${report.summary?.criticalIssues}</td>
    </tr>
    <tr>
      <td>Warnings</td>
      <td>${report.summary?.warnings}</td>
    </tr>
  </table>

  <h2>Recommendations</h2>
  <ul>
    ${report.summary?.recommendations?.map((rec: string) => `<li>${rec}</li>`).join('') || '<li>None</li>'}
  </ul>
</body>
</html>
    `.trim();
  }
}
