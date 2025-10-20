/**
 * Log Aggregation Service
 * Collects, aggregates, and analyzes logs from all services
 */

import { EventEmitter } from 'events';
import { LogEntry, LogLevel, LogQuery, LogAnalysis } from '../types';
import { monitoringConfig } from '../config/monitoring.config';
import { v4 as uuidv4 } from 'uuid';

class LogAggregator extends EventEmitter {
  private logs: LogEntry[] = [];
  private maxLogSize: number = 100000; // Maximum logs to keep in memory
  private logBuffer: LogEntry[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.startFlushInterval();
  }

  /**
   * Start periodic log flushing
   */
  private startFlushInterval(): void {
    this.flushInterval = setInterval(() => {
      this.flushLogs();
    }, 10000); // Flush every 10 seconds
  }

  /**
   * Stop log flushing
   */
  public stop(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    this.flushLogs();
  }

  /**
   * Log a message
   */
  public log(
    level: LogLevel,
    message: string,
    context?: {
      service?: string;
      error?: Error;
      context?: Record<string, any>;
      traceId?: string;
      spanId?: string;
      userId?: string;
      sessionId?: string;
    }
  ): void {
    const logEntry: LogEntry = {
      id: uuidv4(),
      timestamp: new Date(),
      level,
      service: context?.service || 'unknown',
      message,
      context: context?.context,
      error: context?.error ? {
        name: context.error.name,
        message: context.error.message,
        stack: context.error.stack,
        code: (context.error as any).code
      } : undefined,
      traceId: context?.traceId,
      spanId: context?.spanId,
      userId: context?.userId ? this.anonymizeUserId(context.userId) : undefined,
      sessionId: context?.sessionId,
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      host: process.env.HOSTNAME || 'localhost'
    };

    // Add to buffer
    this.logBuffer.push(logEntry);

    // Emit for real-time processing
    this.emit('log', logEntry);

    // Console output based on level
    if (monitoringConfig.logging.destinations.includes('console')) {
      this.logToConsole(logEntry);
    }

    // Check if buffer needs immediate flush
    if (this.logBuffer.length >= 100) {
      this.flushLogs();
    }
  }

  /**
   * Log to console with formatting
   */
  private logToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const level = entry.level.toUpperCase().padEnd(5);
    const service = `[${entry.service}]`.padEnd(20);
    const message = entry.message;

    const logLine = `${timestamp} ${level} ${service} ${message}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(logLine, entry.context || '');
        break;
      case LogLevel.INFO:
        console.info(logLine);
        break;
      case LogLevel.WARN:
        console.warn(logLine, entry.context || '');
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(logLine, entry.error || entry.context || '');
        break;
    }
  }

  /**
   * Flush logs to storage
   */
  private flushLogs(): void {
    if (this.logBuffer.length === 0) {
      return;
    }

    const logsToFlush = [...this.logBuffer];
    this.logBuffer = [];

    // Add to in-memory storage
    this.logs.push(...logsToFlush);

    // Trim if exceeds max size
    if (this.logs.length > this.maxLogSize) {
      const excess = this.logs.length - this.maxLogSize;
      this.logs.splice(0, excess);
    }

    // Emit flush event
    this.emit('flush', logsToFlush);

    // In production, this would send to CloudWatch, Elasticsearch, etc.
    if (monitoringConfig.logging.destinations.includes('cloudwatch')) {
      this.sendToCloudWatch(logsToFlush);
    }

    if (monitoringConfig.logging.destinations.includes('elasticsearch')) {
      this.sendToElasticsearch(logsToFlush);
    }

    if (monitoringConfig.logging.destinations.includes('file')) {
      this.writeToFile(logsToFlush);
    }
  }

  /**
   * Send logs to CloudWatch
   */
  private async sendToCloudWatch(logs: LogEntry[]): Promise<void> {
    // Implementation would use AWS SDK to send logs to CloudWatch
    console.log(`Would send ${logs.length} logs to CloudWatch`);
  }

  /**
   * Send logs to Elasticsearch
   */
  private async sendToElasticsearch(logs: LogEntry[]): Promise<void> {
    // Implementation would use Elasticsearch client
    console.log(`Would send ${logs.length} logs to Elasticsearch`);
  }

  /**
   * Write logs to file
   */
  private async writeToFile(logs: LogEntry[]): Promise<void> {
    // Implementation would write logs to file system
    console.log(`Would write ${logs.length} logs to file`);
  }

  /**
   * Query logs
   */
  public query(query: LogQuery): LogEntry[] {
    let filteredLogs = [...this.logs];

    // Filter by time range
    filteredLogs = filteredLogs.filter(
      log => log.timestamp >= query.startTime && log.timestamp <= query.endTime
    );

    // Filter by levels
    if (query.levels && query.levels.length > 0) {
      filteredLogs = filteredLogs.filter(log => query.levels!.includes(log.level));
    }

    // Filter by services
    if (query.services && query.services.length > 0) {
      filteredLogs = filteredLogs.filter(log => query.services!.includes(log.service));
    }

    // Filter by trace ID
    if (query.traceId) {
      filteredLogs = filteredLogs.filter(log => log.traceId === query.traceId);
    }

    // Filter by search term
    if (query.searchTerm) {
      const searchLower = query.searchTerm.toLowerCase();
      filteredLogs = filteredLogs.filter(log =>
        log.message.toLowerCase().includes(searchLower) ||
        log.error?.message.toLowerCase().includes(searchLower)
      );
    }

    // Apply pagination
    const offset = query.offset || 0;
    const limit = query.limit || 100;

    return filteredLogs.slice(offset, offset + limit);
  }

  /**
   * Analyze logs for patterns and insights
   */
  public analyze(query: LogQuery): LogAnalysis {
    const logs = this.query({ ...query, limit: undefined, offset: undefined });

    const errorLogs = logs.filter(log => log.level === LogLevel.ERROR || log.level === LogLevel.FATAL);
    const warningLogs = logs.filter(log => log.level === LogLevel.WARN);

    // Count errors by type
    const errorCounts = new Map<string, number>();
    for (const log of errorLogs) {
      const errorKey = log.error?.name || log.message;
      errorCounts.set(errorKey, (errorCounts.get(errorKey) || 0) + 1);
    }

    // Get top errors
    const topErrors = Array.from(errorCounts.entries())
      .map(([error, count]) => ({
        error,
        count,
        percentage: (count / errorLogs.length) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Create time series data (hourly buckets)
    const timeSeriesMap = new Map<string, Map<LogLevel, number>>();
    for (const log of logs) {
      const hourKey = new Date(log.timestamp).setMinutes(0, 0, 0).toString();
      if (!timeSeriesMap.has(hourKey)) {
        timeSeriesMap.set(hourKey, new Map());
      }
      const levelCounts = timeSeriesMap.get(hourKey)!;
      levelCounts.set(log.level, (levelCounts.get(log.level) || 0) + 1);
    }

    const timeSeriesData = Array.from(timeSeriesMap.entries()).flatMap(([hourKey, levelCounts]) =>
      Array.from(levelCounts.entries()).map(([level, count]) => ({
        timestamp: new Date(parseInt(hourKey)),
        count,
        level
      }))
    ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    return {
      totalLogs: logs.length,
      errorCount: errorLogs.length,
      warningCount: warningLogs.length,
      errorRate: logs.length > 0 ? (errorLogs.length / logs.length) : 0,
      topErrors,
      timeSeriesData
    };
  }

  /**
   * Convenience methods for different log levels
   */
  public debug(message: string, context?: any): void {
    this.log(LogLevel.DEBUG, message, { context });
  }

  public info(message: string, context?: any): void {
    this.log(LogLevel.INFO, message, { context });
  }

  public warn(message: string, context?: any): void {
    this.log(LogLevel.WARN, message, { context });
  }

  public error(message: string, error?: Error, context?: any): void {
    this.log(LogLevel.ERROR, message, { error, context });
  }

  public fatal(message: string, error?: Error, context?: any): void {
    this.log(LogLevel.FATAL, message, { error, context });
  }

  /**
   * Get log statistics
   */
  public getStatistics(timeRange?: { from: Date; to: Date }): {
    total: number;
    byLevel: Record<LogLevel, number>;
    byService: Record<string, number>;
    errorRate: number;
  } {
    let logs = this.logs;

    if (timeRange) {
      logs = logs.filter(log => log.timestamp >= timeRange.from && log.timestamp <= timeRange.to);
    }

    const byLevel: Record<LogLevel, number> = {
      [LogLevel.DEBUG]: 0,
      [LogLevel.INFO]: 0,
      [LogLevel.WARN]: 0,
      [LogLevel.ERROR]: 0,
      [LogLevel.FATAL]: 0
    };

    const byService: Record<string, number> = {};

    for (const log of logs) {
      byLevel[log.level]++;
      byService[log.service] = (byService[log.service] || 0) + 1;
    }

    const errorCount = byLevel[LogLevel.ERROR] + byLevel[LogLevel.FATAL];
    const errorRate = logs.length > 0 ? errorCount / logs.length : 0;

    return {
      total: logs.length,
      byLevel,
      byService,
      errorRate
    };
  }

  /**
   * Clear all logs
   */
  public clear(): void {
    this.logs = [];
    this.logBuffer = [];
  }

  /**
   * Anonymize user ID for COPPA compliance
   */
  private anonymizeUserId(userId: string): string {
    // Simple hash for demonstration - use proper hashing in production
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `user_${Math.abs(hash).toString(36)}`;
  }
}

// Singleton instance
export const logger = new LogAggregator();

// Export convenience function
export function createLogger(service: string) {
  return {
    debug: (message: string, context?: any) => logger.log(LogLevel.DEBUG, message, { service, context }),
    info: (message: string, context?: any) => logger.log(LogLevel.INFO, message, { service, context }),
    warn: (message: string, context?: any) => logger.log(LogLevel.WARN, message, { service, context }),
    error: (message: string, error?: Error, context?: any) => logger.log(LogLevel.ERROR, message, { service, error, context }),
    fatal: (message: string, error?: Error, context?: any) => logger.log(LogLevel.FATAL, message, { service, error, context })
  };
}

export default LogAggregator;
