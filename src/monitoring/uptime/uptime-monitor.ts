/**
 * Uptime Monitoring Service
 * Tracks availability and performance of critical endpoints
 */

import { EventEmitter } from 'events';
import { UptimeCheck, UptimeResult, UptimeStats } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { metrics } from '../metrics/prometheus-client';

class UptimeMonitor extends EventEmitter {
  private checks: Map<string, UptimeCheck> = new Map();
  private results: Map<string, UptimeResult[]> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private isRunning: boolean = false;
  private maxResults: number = 10000; // Max results per check to keep in memory

  constructor() {
    super();
    this.initializeDefaultChecks();
  }

  /**
   * Initialize default uptime checks
   */
  private initializeDefaultChecks(): void {
    // API health check
    this.addCheck({
      id: 'api-health',
      name: 'API Health Endpoint',
      url: process.env.API_URL || 'http://localhost:3001/health',
      method: 'GET',
      interval: 30,
      timeout: 5000,
      expectedStatusCode: 200,
      retryCount: 3,
      retryInterval: 5,
      alertOnFailure: true,
      alertChannels: ['slack', 'email'],
      enabled: true
    });

    // Main application
    this.addCheck({
      id: 'app-homepage',
      name: 'Application Homepage',
      url: process.env.APP_URL || 'http://localhost:3000',
      method: 'GET',
      interval: 60,
      timeout: 10000,
      expectedStatusCode: 200,
      retryCount: 3,
      retryInterval: 5,
      alertOnFailure: true,
      alertChannels: ['slack'],
      enabled: true
    });

    // Database health
    this.addCheck({
      id: 'database-health',
      name: 'Database Health',
      url: process.env.DB_HEALTH_URL || 'http://localhost:5432/health',
      method: 'GET',
      interval: 30,
      timeout: 5000,
      expectedStatusCode: 200,
      retryCount: 2,
      retryInterval: 5,
      alertOnFailure: true,
      alertChannels: ['pagerduty', 'slack'],
      enabled: true
    });

    // PDF Processing Service
    this.addCheck({
      id: 'pdf-processor-health',
      name: 'PDF Processor Health',
      url: process.env.PDF_PROCESSOR_URL || 'http://localhost:3002/health',
      method: 'GET',
      interval: 60,
      timeout: 5000,
      expectedStatusCode: 200,
      retryCount: 3,
      retryInterval: 5,
      alertOnFailure: true,
      alertChannels: ['slack'],
      enabled: true
    });

    // LLM Service
    this.addCheck({
      id: 'llm-service-health',
      name: 'LLM Service Health',
      url: process.env.LLM_SERVICE_URL || 'http://localhost:3003/health',
      method: 'GET',
      interval: 60,
      timeout: 10000,
      expectedStatusCode: 200,
      retryCount: 3,
      retryInterval: 5,
      alertOnFailure: true,
      alertChannels: ['slack'],
      enabled: true
    });
  }

  /**
   * Start uptime monitoring
   */
  public start(): void {
    if (this.isRunning) {
      console.warn('Uptime monitor is already running');
      return;
    }

    console.log('Starting uptime monitor...');
    this.isRunning = true;

    for (const [checkId, check] of this.checks.entries()) {
      if (check.enabled) {
        this.startCheck(checkId);
      }
    }

    this.emit('started');
  }

  /**
   * Stop uptime monitoring
   */
  public stop(): void {
    if (!this.isRunning) {
      return;
    }

    console.log('Stopping uptime monitor...');

    for (const [checkId, interval] of this.intervals.entries()) {
      clearInterval(interval);
      this.intervals.delete(checkId);
    }

    this.isRunning = false;
    this.emit('stopped');
  }

  /**
   * Add a new uptime check
   */
  public addCheck(check: UptimeCheck): void {
    this.checks.set(check.id, check);
    this.results.set(check.id, []);

    if (this.isRunning && check.enabled) {
      this.startCheck(check.id);
    }

    this.emit('check:added', check);
  }

  /**
   * Remove an uptime check
   */
  public removeCheck(checkId: string): void {
    const interval = this.intervals.get(checkId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(checkId);
    }

    this.checks.delete(checkId);
    this.results.delete(checkId);

    this.emit('check:removed', checkId);
  }

  /**
   * Update an uptime check
   */
  public updateCheck(checkId: string, updates: Partial<UptimeCheck>): void {
    const check = this.checks.get(checkId);
    if (!check) {
      return;
    }

    const updatedCheck = { ...check, ...updates };
    this.checks.set(checkId, updatedCheck);

    // Restart check if it's running
    if (this.intervals.has(checkId)) {
      this.stopCheck(checkId);
      if (updatedCheck.enabled) {
        this.startCheck(checkId);
      }
    }

    this.emit('check:updated', updatedCheck);
  }

  /**
   * Start monitoring a specific check
   */
  private startCheck(checkId: string): void {
    const check = this.checks.get(checkId);
    if (!check) {
      return;
    }

    // Perform initial check immediately
    this.performCheck(checkId);

    // Set up interval
    const interval = setInterval(() => {
      this.performCheck(checkId);
    }, check.interval * 1000);

    this.intervals.set(checkId, interval);
  }

  /**
   * Stop monitoring a specific check
   */
  private stopCheck(checkId: string): void {
    const interval = this.intervals.get(checkId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(checkId);
    }
  }

  /**
   * Perform a single uptime check
   */
  private async performCheck(checkId: string): Promise<void> {
    const check = this.checks.get(checkId);
    if (!check) {
      return;
    }

    let retries = 0;
    let lastError: string | undefined;

    while (retries <= check.retryCount) {
      try {
        const result = await this.executeCheck(check);
        this.recordResult(checkId, result);

        // Alert if it was previously failing and now succeeded
        const previousResults = this.results.get(checkId) || [];
        const previousFailed = previousResults[previousResults.length - 1]?.success === false;
        if (result.success && previousFailed) {
          this.emit('check:recovered', { checkId, check });
        }

        return;
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error';
        retries++;

        if (retries <= check.retryCount) {
          await new Promise(resolve => setTimeout(resolve, check.retryInterval * 1000));
        }
      }
    }

    // All retries failed
    const failedResult: UptimeResult = {
      checkId,
      timestamp: new Date(),
      success: false,
      responseTime: check.timeout,
      error: lastError || 'Check failed after all retries'
    };

    this.recordResult(checkId, failedResult);

    // Send alert if enabled
    if (check.alertOnFailure) {
      this.emit('check:failed', { checkId, check, error: lastError });
    }
  }

  /**
   * Execute the actual HTTP check
   */
  private async executeCheck(check: UptimeCheck): Promise<UptimeResult> {
    const timings = {
      startTime: Date.now(),
      dnsLookup: 0,
      tcpConnection: 0,
      tlsHandshake: 0,
      serverProcessing: 0,
      contentTransfer: 0
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), check.timeout);

      const response = await fetch(check.url, {
        method: check.method,
        signal: controller.signal,
        headers: {
          'User-Agent': 'K5-Uptime-Monitor/1.0',
          ...(check.expectedHeaders || {})
        }
      });

      clearTimeout(timeoutId);

      const responseTime = Date.now() - timings.startTime;
      const statusCode = response.status;

      // Check status code
      if (check.expectedStatusCode && statusCode !== check.expectedStatusCode) {
        return {
          checkId: check.id,
          timestamp: new Date(),
          success: false,
          responseTime,
          statusCode,
          error: `Expected status ${check.expectedStatusCode}, got ${statusCode}`
        };
      }

      // Check response body if specified
      if (check.expectedBody) {
        const body = await response.text();
        if (!body.includes(check.expectedBody)) {
          return {
            checkId: check.id,
            timestamp: new Date(),
            success: false,
            responseTime,
            statusCode,
            error: 'Response body does not match expected content'
          };
        }
      }

      return {
        checkId: check.id,
        timestamp: new Date(),
        success: true,
        responseTime,
        statusCode,
        dnsLookup: timings.dnsLookup,
        tcpConnection: timings.tcpConnection,
        tlsHandshake: timings.tlsHandshake,
        serverProcessing: timings.serverProcessing,
        contentTransfer: timings.contentTransfer
      };
    } catch (error) {
      return {
        checkId: check.id,
        timestamp: new Date(),
        success: false,
        responseTime: Date.now() - timings.startTime,
        error: error instanceof Error ? error.message : 'Request failed'
      };
    }
  }

  /**
   * Record a check result
   */
  private recordResult(checkId: string, result: UptimeResult): void {
    const results = this.results.get(checkId) || [];
    results.push(result);

    // Trim old results
    if (results.length > this.maxResults) {
      results.shift();
    }

    this.results.set(checkId, results);

    // Record metrics
    metrics.recordHealthCheck(
      checkId,
      result.responseTime,
      result.success,
      result.error
    );

    // Emit event
    this.emit('check:result', { checkId, result });
  }

  /**
   * Get statistics for a check
   */
  public getStats(checkId: string, timeRange?: { from: Date; to: Date }): UptimeStats | null {
    const check = this.checks.get(checkId);
    if (!check) {
      return null;
    }

    let results = this.results.get(checkId) || [];

    // Filter by time range
    if (timeRange) {
      results = results.filter(
        r => r.timestamp >= timeRange.from && r.timestamp <= timeRange.to
      );
    }

    if (results.length === 0) {
      return null;
    }

    const successfulChecks = results.filter(r => r.success);
    const failedChecks = results.filter(r => !r.success);

    // Calculate response times
    const responseTimes = successfulChecks.map(r => r.responseTime).sort((a, b) => a - b);
    const avgResponseTime = responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length || 0;
    const p95Index = Math.floor(responseTimes.length * 0.95);
    const p99Index = Math.floor(responseTimes.length * 0.99);

    // Calculate uptime
    const uptime = (successfulChecks.length / results.length) * 100;

    // Calculate downtime (in seconds)
    const downtime = failedChecks.length * check.interval;

    // Find incident periods
    const incidents: UptimeStats['incidents'] = [];
    let currentIncident: { startTime: Date; endTime?: Date; duration: number; reason: string } | null = null;

    for (const result of results) {
      if (!result.success) {
        if (!currentIncident) {
          currentIncident = {
            startTime: result.timestamp,
            duration: 0,
            reason: result.error || 'Unknown'
          };
        }
        currentIncident.duration += check.interval;
      } else {
        if (currentIncident) {
          currentIncident.endTime = result.timestamp;
          incidents.push(currentIncident);
          currentIncident = null;
        }
      }
    }

    // Close ongoing incident
    if (currentIncident) {
      incidents.push(currentIncident);
    }

    return {
      checkId,
      timeRange: {
        from: timeRange?.from || results[0].timestamp,
        to: timeRange?.to || results[results.length - 1].timestamp
      },
      uptime,
      downtime,
      totalChecks: results.length,
      successfulChecks: successfulChecks.length,
      failedChecks: failedChecks.length,
      avgResponseTime,
      minResponseTime: responseTimes[0] || 0,
      maxResponseTime: responseTimes[responseTimes.length - 1] || 0,
      p95ResponseTime: responseTimes[p95Index] || 0,
      p99ResponseTime: responseTimes[p99Index] || 0,
      incidents
    };
  }

  /**
   * Get all checks
   */
  public getChecks(): UptimeCheck[] {
    return Array.from(this.checks.values());
  }

  /**
   * Get a specific check
   */
  public getCheck(checkId: string): UptimeCheck | undefined {
    return this.checks.get(checkId);
  }

  /**
   * Get recent results for a check
   */
  public getRecentResults(checkId: string, limit: number = 100): UptimeResult[] {
    const results = this.results.get(checkId) || [];
    return results.slice(-limit);
  }

  /**
   * Get overall uptime statistics
   */
  public getOverallStats(timeRange?: { from: Date; to: Date }): {
    totalChecks: number;
    averageUptime: number;
    checkStats: Array<{ checkId: string; name: string; uptime: number }>;
  } {
    const checkStats: Array<{ checkId: string; name: string; uptime: number }> = [];
    let totalUptime = 0;
    let checkCount = 0;

    for (const [checkId, check] of this.checks.entries()) {
      const stats = this.getStats(checkId, timeRange);
      if (stats) {
        checkStats.push({
          checkId,
          name: check.name,
          uptime: stats.uptime
        });
        totalUptime += stats.uptime;
        checkCount++;
      }
    }

    return {
      totalChecks: checkCount,
      averageUptime: checkCount > 0 ? totalUptime / checkCount : 0,
      checkStats
    };
  }
}

// Singleton instance
export const uptimeMonitor = new UptimeMonitor();

export default UptimeMonitor;
