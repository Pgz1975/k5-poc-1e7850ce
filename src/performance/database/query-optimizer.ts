/**
 * Database Query Optimization
 * Query optimization, indexing strategies, and connection pooling
 */

import { EventEmitter } from 'events';

export interface QueryPlan {
  query: string;
  executionTime: number;
  planType: string;
  cost: number;
  rows: number;
  indexes: string[];
  suggestions: string[];
}

export interface IndexStrategy {
  table: string;
  columns: string[];
  type: 'btree' | 'hash' | 'gin' | 'gist' | 'brin';
  unique?: boolean;
  partial?: string; // WHERE clause for partial index
  estimatedGain: number;
}

export interface ConnectionPoolConfig {
  min?: number;
  max?: number;
  idleTimeout?: number;
  acquireTimeout?: number;
  createTimeout?: number;
  destroyTimeout?: number;
  reapInterval?: number;
}

export class QueryOptimizer extends EventEmitter {
  private queryCache = new Map<string, QueryPlan>();
  private slowQueryThreshold = 1000; // ms

  /**
   * Analyze query execution plan
   */
  public async analyzeQuery(
    query: string,
    executor: (q: string) => Promise<any>
  ): Promise<QueryPlan> {
    const cacheKey = this.hashQuery(query);

    if (this.queryCache.has(cacheKey)) {
      return this.queryCache.get(cacheKey)!;
    }

    const startTime = Date.now();
    const explainQuery = `EXPLAIN ANALYZE ${query}`;

    try {
      const result = await executor(explainQuery);
      const executionTime = Date.now() - startTime;

      const plan = this.parseExplainAnalyze(result, query, executionTime);

      if (executionTime > this.slowQueryThreshold) {
        this.emit('slowQuery', plan);
      }

      this.queryCache.set(cacheKey, plan);
      return plan;
    } catch (error) {
      this.emit('error', { query, error });
      throw error;
    }
  }

  /**
   * Parse EXPLAIN ANALYZE output
   */
  private parseExplainAnalyze(
    result: any,
    query: string,
    executionTime: number
  ): QueryPlan {
    const plan: QueryPlan = {
      query,
      executionTime,
      planType: 'unknown',
      cost: 0,
      rows: 0,
      indexes: [],
      suggestions: [],
    };

    // Parse PostgreSQL EXPLAIN output
    if (Array.isArray(result)) {
      for (const row of result) {
        const line = row['QUERY PLAN'] || row.plan || '';

        // Extract plan type
        if (line.includes('Seq Scan')) {
          plan.planType = 'Sequential Scan';
          plan.suggestions.push('Consider adding an index for better performance');
        } else if (line.includes('Index Scan')) {
          plan.planType = 'Index Scan';
          const indexMatch = line.match(/using (\w+)/);
          if (indexMatch) {
            plan.indexes.push(indexMatch[1]);
          }
        } else if (line.includes('Bitmap')) {
          plan.planType = 'Bitmap Index Scan';
        } else if (line.includes('Nested Loop')) {
          plan.planType = 'Nested Loop Join';
          if (executionTime > this.slowQueryThreshold) {
            plan.suggestions.push('Nested loops can be slow with large datasets');
          }
        } else if (line.includes('Hash Join')) {
          plan.planType = 'Hash Join';
        } else if (line.includes('Merge Join')) {
          plan.planType = 'Merge Join';
        }

        // Extract cost and rows
        const costMatch = line.match(/cost=([\d.]+)\.\.([\d.]+)/);
        if (costMatch) {
          plan.cost = parseFloat(costMatch[2]);
        }

        const rowsMatch = line.match(/rows=(\d+)/);
        if (rowsMatch) {
          plan.rows = parseInt(rowsMatch[1], 10);
        }
      }
    }

    // Generate suggestions
    if (plan.planType === 'Sequential Scan' && plan.rows > 1000) {
      plan.suggestions.push('High row count with sequential scan - add index');
    }

    if (plan.cost > 10000) {
      plan.suggestions.push('High query cost - consider query rewrite or indexing');
    }

    return plan;
  }

  /**
   * Recommend indexes based on query patterns
   */
  public recommendIndexes(queries: string[]): IndexStrategy[] {
    const recommendations: IndexStrategy[] = [];
    const columnUsage = new Map<string, { table: string; frequency: number }>();

    for (const query of queries) {
      const patterns = this.extractQueryPatterns(query);

      for (const pattern of patterns) {
        const key = `${pattern.table}.${pattern.column}`;
        const current = columnUsage.get(key) || {
          table: pattern.table,
          frequency: 0,
        };
        current.frequency += pattern.weight;
        columnUsage.set(key, current);
      }
    }

    // Generate recommendations
    for (const [key, usage] of columnUsage) {
      const [table, column] = key.split('.');

      if (usage.frequency >= 3) {
        recommendations.push({
          table,
          columns: [column],
          type: 'btree',
          estimatedGain: usage.frequency * 0.3,
        });
      }
    }

    return recommendations.sort((a, b) => b.estimatedGain - a.estimatedGain);
  }

  /**
   * Extract query patterns for analysis
   */
  private extractQueryPatterns(
    query: string
  ): Array<{ table: string; column: string; weight: number }> {
    const patterns: Array<{ table: string; column: string; weight: number }> = [];
    const normalized = query.toLowerCase();

    // WHERE clause patterns
    const whereMatch = normalized.match(/where\s+(\w+)\.(\w+)\s*=/g);
    if (whereMatch) {
      for (const match of whereMatch) {
        const columnMatch = match.match(/(\w+)\.(\w+)/);
        if (columnMatch) {
          patterns.push({
            table: columnMatch[1],
            column: columnMatch[2],
            weight: 2,
          });
        }
      }
    }

    // JOIN patterns
    const joinMatch = normalized.match(/join\s+(\w+)\s+on\s+(\w+)\.(\w+)/g);
    if (joinMatch) {
      for (const match of joinMatch) {
        const columnMatch = match.match(/on\s+(\w+)\.(\w+)/);
        if (columnMatch) {
          patterns.push({
            table: columnMatch[1],
            column: columnMatch[2],
            weight: 3,
          });
        }
      }
    }

    // ORDER BY patterns
    const orderMatch = normalized.match(/order\s+by\s+(\w+)\.(\w+)/g);
    if (orderMatch) {
      for (const match of orderMatch) {
        const columnMatch = match.match(/(\w+)\.(\w+)/);
        if (columnMatch) {
          patterns.push({
            table: columnMatch[1],
            column: columnMatch[2],
            weight: 1.5,
          });
        }
      }
    }

    return patterns;
  }

  /**
   * Generate optimized query
   */
  public optimizeQuery(query: string, plan: QueryPlan): string {
    let optimized = query;

    // Add LIMIT if missing and high row count
    if (plan.rows > 10000 && !query.toLowerCase().includes('limit')) {
      optimized += ' LIMIT 1000';
    }

    // Suggest index hints (database-specific)
    if (plan.suggestions.length > 0 && plan.planType === 'Sequential Scan') {
      this.emit('optimizationHint', {
        query,
        hint: 'Consider creating an index',
        plan,
      });
    }

    return optimized;
  }

  /**
   * Batch query optimizer
   */
  public async optimizeBatch(
    queries: string[],
    executor: (q: string) => Promise<any>
  ): Promise<Map<string, QueryPlan>> {
    const results = new Map<string, QueryPlan>();

    for (const query of queries) {
      try {
        const plan = await this.analyzeQuery(query, executor);
        results.set(query, plan);
      } catch (error) {
        this.emit('batchError', { query, error });
      }
    }

    return results;
  }

  private hashQuery(query: string): string {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(query).digest('hex');
  }

  public clearCache(): void {
    this.queryCache.clear();
  }
}

/**
 * Connection Pool Manager
 */
export class ConnectionPoolManager extends EventEmitter {
  private config: Required<ConnectionPoolConfig>;
  private pool: any[] = [];
  private available: any[] = [];
  private waiting: Array<(conn: any) => void> = [];
  private activeConnections = 0;
  private totalCreated = 0;
  private totalDestroyed = 0;

  constructor(
    private connectionFactory: () => Promise<any>,
    config: ConnectionPoolConfig = {}
  ) {
    super();

    this.config = {
      min: config.min ?? 2,
      max: config.max ?? 10,
      idleTimeout: config.idleTimeout ?? 30000,
      acquireTimeout: config.acquireTimeout ?? 30000,
      createTimeout: config.createTimeout ?? 10000,
      destroyTimeout: config.destroyTimeout ?? 5000,
      reapInterval: config.reapInterval ?? 10000,
    };

    this.initialize();
  }

  private async initialize(): Promise<void> {
    // Create minimum connections
    for (let i = 0; i < this.config.min; i++) {
      await this.createConnection();
    }

    // Start reaper for idle connections
    setInterval(() => this.reapIdleConnections(), this.config.reapInterval);

    this.emit('initialized', {
      min: this.config.min,
      max: this.config.max,
    });
  }

  private async createConnection(): Promise<any> {
    if (this.totalCreated - this.totalDestroyed >= this.config.max) {
      throw new Error('Connection pool exhausted');
    }

    try {
      const conn = await Promise.race([
        this.connectionFactory(),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error('Connection creation timeout')),
            this.config.createTimeout
          )
        ),
      ]);

      this.pool.push({
        connection: conn,
        created: Date.now(),
        lastUsed: Date.now(),
      });

      this.available.push(conn);
      this.totalCreated++;
      this.emit('connectionCreated', { total: this.pool.length });

      return conn;
    } catch (error) {
      this.emit('error', { operation: 'createConnection', error });
      throw error;
    }
  }

  public async acquire(): Promise<any> {
    // Check for available connection
    if (this.available.length > 0) {
      const conn = this.available.pop()!;
      this.activeConnections++;
      this.updateLastUsed(conn);
      return conn;
    }

    // Create new connection if under max
    if (this.pool.length < this.config.max) {
      const conn = await this.createConnection();
      this.available.pop(); // Remove from available
      this.activeConnections++;
      return conn;
    }

    // Wait for connection
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        const index = this.waiting.indexOf(resolve);
        if (index > -1) {
          this.waiting.splice(index, 1);
        }
        reject(new Error('Acquire timeout'));
      }, this.config.acquireTimeout);

      this.waiting.push((conn) => {
        clearTimeout(timeout);
        resolve(conn);
      });
    });
  }

  public release(conn: any): void {
    this.activeConnections--;
    this.updateLastUsed(conn);

    // Check if someone is waiting
    if (this.waiting.length > 0) {
      const waiter = this.waiting.shift()!;
      this.activeConnections++;
      waiter(conn);
    } else {
      this.available.push(conn);
    }
  }

  private updateLastUsed(conn: any): void {
    const poolEntry = this.pool.find((p) => p.connection === conn);
    if (poolEntry) {
      poolEntry.lastUsed = Date.now();
    }
  }

  private async reapIdleConnections(): Promise<void> {
    const now = Date.now();
    const toDestroy: any[] = [];

    for (const entry of this.pool) {
      const idle = now - entry.lastUsed;

      if (
        idle > this.config.idleTimeout &&
        this.pool.length > this.config.min &&
        this.available.includes(entry.connection)
      ) {
        toDestroy.push(entry);
      }
    }

    for (const entry of toDestroy) {
      await this.destroyConnection(entry.connection);
    }
  }

  private async destroyConnection(conn: any): Promise<void> {
    try {
      const index = this.pool.findIndex((p) => p.connection === conn);
      if (index > -1) {
        this.pool.splice(index, 1);
      }

      const availIndex = this.available.indexOf(conn);
      if (availIndex > -1) {
        this.available.splice(availIndex, 1);
      }

      // Call destroy if available
      if (conn.end) await conn.end();
      if (conn.close) await conn.close();
      if (conn.destroy) conn.destroy();

      this.totalDestroyed++;
      this.emit('connectionDestroyed', { total: this.pool.length });
    } catch (error) {
      this.emit('error', { operation: 'destroyConnection', error });
    }
  }

  public async drain(): Promise<void> {
    // Wait for active connections to be released
    while (this.activeConnections > 0) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Destroy all connections
    await Promise.all(this.pool.map((entry) => this.destroyConnection(entry.connection)));

    this.emit('drained');
  }

  public getStats() {
    return {
      total: this.pool.length,
      available: this.available.length,
      active: this.activeConnections,
      waiting: this.waiting.length,
      created: this.totalCreated,
      destroyed: this.totalDestroyed,
    };
  }
}

// Singleton instance
let queryOptimizer: QueryOptimizer | null = null;

export function getQueryOptimizer(): QueryOptimizer {
  if (!queryOptimizer) {
    queryOptimizer = new QueryOptimizer();
  }
  return queryOptimizer;
}
