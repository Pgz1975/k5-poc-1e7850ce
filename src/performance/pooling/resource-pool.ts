/**
 * Resource Pooling and Connection Management
 * Efficient resource reuse for database, API, and worker connections
 */

import { EventEmitter } from 'events';

export interface PoolConfig<T> {
  min: number;
  max: number;
  acquireTimeout: number; // ms
  idleTimeout: number; // ms
  createTimeout: number; // ms
  destroyTimeout: number; // ms
  reapInterval: number; // ms
  validateOnAcquire: boolean;
  validateOnReturn: boolean;
  factory: ResourceFactory<T>;
}

export interface ResourceFactory<T> {
  create: () => Promise<T>;
  destroy: (resource: T) => Promise<void>;
  validate: (resource: T) => Promise<boolean>;
}

export interface PoolStats {
  size: number;
  available: number;
  acquired: number;
  pending: number;
  created: number;
  destroyed: number;
  errors: number;
  avgAcquireTime: number;
  avgIdleTime: number;
}

interface PooledResource<T> {
  resource: T;
  created: number;
  lastUsed: number;
  timesUsed: number;
  errors: number;
}

export class ResourcePool<T> extends EventEmitter {
  private config: Required<PoolConfig<T>>;
  private resources: Map<T, PooledResource<T>> = new Map();
  private available: T[] = [];
  private waitQueue: Array<{
    resolve: (resource: T) => void;
    reject: (error: Error) => void;
    timestamp: number;
  }> = [];

  private stats: PoolStats = {
    size: 0,
    available: 0,
    acquired: 0,
    pending: 0,
    created: 0,
    destroyed: 0,
    errors: 0,
    avgAcquireTime: 0,
    avgIdleTime: 0,
  };

  private reapInterval?: NodeJS.Timeout;
  private shuttingDown = false;
  private acquireTimes: number[] = [];

  constructor(config: PoolConfig<T>) {
    super();

    this.config = config as Required<PoolConfig<T>>;
    this.initialize();
  }

  private async initialize(): Promise<void> {
    // Create minimum resources
    for (let i = 0; i < this.config.min; i++) {
      try {
        await this.createResource();
      } catch (error) {
        this.emit('error', { operation: 'initialize', error });
      }
    }

    // Start reaper
    this.startReaper();

    this.emit('initialized', { size: this.resources.size });
  }

  /**
   * Acquire resource from pool
   */
  public async acquire(): Promise<T> {
    if (this.shuttingDown) {
      throw new Error('Pool is shutting down');
    }

    const startTime = Date.now();

    // Try to get available resource
    while (this.available.length > 0) {
      const resource = this.available.pop()!;
      const pooled = this.resources.get(resource);

      if (!pooled) continue;

      // Validate if configured
      if (this.config.validateOnAcquire) {
        const valid = await this.validateResource(resource);
        if (!valid) {
          await this.destroyResource(resource);
          continue;
        }
      }

      // Update stats
      pooled.lastUsed = Date.now();
      pooled.timesUsed++;
      this.stats.acquired++;
      this.stats.available = this.available.length;

      const acquireTime = Date.now() - startTime;
      this.updateAcquireTime(acquireTime);

      this.emit('acquired', { resource, acquireTime });

      return resource;
    }

    // Create new resource if under max
    if (this.resources.size < this.config.max) {
      try {
        const resource = await this.createResource();
        const pooled = this.resources.get(resource);
        if (pooled) {
          pooled.lastUsed = Date.now();
          pooled.timesUsed++;
          this.stats.acquired++;
        }

        const acquireTime = Date.now() - startTime;
        this.updateAcquireTime(acquireTime);

        this.emit('acquired', { resource, acquireTime });
        return resource;
      } catch (error) {
        this.stats.errors++;
        this.emit('error', { operation: 'createResource', error });
        throw error;
      }
    }

    // Wait for available resource
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        const index = this.waitQueue.findIndex(
          (w) => w.resolve === resolve
        );
        if (index > -1) {
          this.waitQueue.splice(index, 1);
          this.stats.pending = this.waitQueue.length;
        }
        reject(new Error('Acquire timeout'));
      }, this.config.acquireTimeout);

      this.waitQueue.push({
        resolve: (resource) => {
          clearTimeout(timeout);
          resolve(resource);
        },
        reject,
        timestamp: Date.now(),
      });

      this.stats.pending = this.waitQueue.length;
    });
  }

  /**
   * Release resource back to pool
   */
  public async release(resource: T): Promise<void> {
    const pooled = this.resources.get(resource);
    if (!pooled) {
      this.emit('error', {
        operation: 'release',
        error: 'Resource not from this pool',
      });
      return;
    }

    this.stats.acquired--;

    // Validate if configured
    if (this.config.validateOnReturn) {
      const valid = await this.validateResource(resource);
      if (!valid) {
        await this.destroyResource(resource);
        // Try to create replacement
        if (!this.shuttingDown && this.resources.size < this.config.min) {
          this.createResource().catch(() => {});
        }
        return;
      }
    }

    // Check if someone is waiting
    if (this.waitQueue.length > 0) {
      const waiter = this.waitQueue.shift()!;
      this.stats.pending = this.waitQueue.length;

      pooled.lastUsed = Date.now();
      pooled.timesUsed++;
      this.stats.acquired++;

      waiter.resolve(resource);
    } else {
      // Return to available pool
      this.available.push(resource);
      this.stats.available = this.available.length;
      pooled.lastUsed = Date.now();
    }

    this.emit('released', { resource });
  }

  /**
   * Execute function with resource (auto-acquire and release)
   */
  public async execute<R>(
    fn: (resource: T) => Promise<R>
  ): Promise<R> {
    const resource = await this.acquire();
    try {
      return await fn(resource);
    } finally {
      await this.release(resource);
    }
  }

  /**
   * Create new resource
   */
  private async createResource(): Promise<T> {
    if (this.resources.size >= this.config.max) {
      throw new Error('Pool size limit reached');
    }

    try {
      const resource = await Promise.race([
        this.config.factory.create(),
        new Promise<T>((_, reject) =>
          setTimeout(
            () => reject(new Error('Create timeout')),
            this.config.createTimeout
          )
        ),
      ]);

      const pooled: PooledResource<T> = {
        resource,
        created: Date.now(),
        lastUsed: Date.now(),
        timesUsed: 0,
        errors: 0,
      };

      this.resources.set(resource, pooled);
      this.available.push(resource);
      this.stats.size = this.resources.size;
      this.stats.available = this.available.length;
      this.stats.created++;

      this.emit('created', { resource });

      return resource;
    } catch (error) {
      this.stats.errors++;
      throw error;
    }
  }

  /**
   * Destroy resource
   */
  private async destroyResource(resource: T): Promise<void> {
    const pooled = this.resources.get(resource);
    if (!pooled) return;

    this.resources.delete(resource);

    const availIndex = this.available.indexOf(resource);
    if (availIndex > -1) {
      this.available.splice(availIndex, 1);
    }

    this.stats.size = this.resources.size;
    this.stats.available = this.available.length;

    try {
      await Promise.race([
        this.config.factory.destroy(resource),
        new Promise<void>((_, reject) =>
          setTimeout(
            () => reject(new Error('Destroy timeout')),
            this.config.destroyTimeout
          )
        ),
      ]);

      this.stats.destroyed++;
      this.emit('destroyed', { resource });
    } catch (error) {
      this.stats.errors++;
      this.emit('error', { operation: 'destroy', error });
    }
  }

  /**
   * Validate resource
   */
  private async validateResource(resource: T): Promise<boolean> {
    try {
      return await this.config.factory.validate(resource);
    } catch (error) {
      this.emit('error', { operation: 'validate', error });
      return false;
    }
  }

  /**
   * Start idle resource reaper
   */
  private startReaper(): void {
    this.reapInterval = setInterval(() => {
      this.reapIdleResources();
    }, this.config.reapInterval);
  }

  /**
   * Reap idle resources
   */
  private async reapIdleResources(): Promise<void> {
    if (this.shuttingDown) return;

    const now = Date.now();
    const toDestroy: T[] = [];

    for (const [resource, pooled] of this.resources) {
      const idle = now - pooled.lastUsed;

      // Reap if idle too long and above minimum
      if (
        idle > this.config.idleTimeout &&
        this.resources.size > this.config.min &&
        this.available.includes(resource)
      ) {
        toDestroy.push(resource);
      }
    }

    for (const resource of toDestroy) {
      await this.destroyResource(resource);
    }

    if (toDestroy.length > 0) {
      this.emit('reaped', { count: toDestroy.length });
    }
  }

  /**
   * Update acquire time stats
   */
  private updateAcquireTime(time: number): void {
    this.acquireTimes.push(time);
    if (this.acquireTimes.length > 100) {
      this.acquireTimes.shift();
    }
    this.stats.avgAcquireTime =
      this.acquireTimes.reduce((a, b) => a + b, 0) / this.acquireTimes.length;
  }

  /**
   * Get pool statistics
   */
  public getStats(): PoolStats {
    return { ...this.stats };
  }

  /**
   * Get detailed status
   */
  public getStatus(): {
    stats: PoolStats;
    resources: Array<{
      age: number;
      timesUsed: number;
      idleTime: number;
      errors: number;
    }>;
  } {
    const now = Date.now();
    const resources = Array.from(this.resources.values()).map((pooled) => ({
      age: now - pooled.created,
      timesUsed: pooled.timesUsed,
      idleTime: now - pooled.lastUsed,
      errors: pooled.errors,
    }));

    return {
      stats: this.getStats(),
      resources,
    };
  }

  /**
   * Drain pool (release all resources)
   */
  public async drain(): Promise<void> {
    this.shuttingDown = true;

    // Reject all waiting requests
    while (this.waitQueue.length > 0) {
      const waiter = this.waitQueue.shift()!;
      waiter.reject(new Error('Pool is draining'));
    }

    // Wait for all acquired resources to be released (with timeout)
    const drainTimeout = 30000; // 30 seconds
    const startTime = Date.now();

    while (this.stats.acquired > 0 && Date.now() - startTime < drainTimeout) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Stop reaper
    if (this.reapInterval) {
      clearInterval(this.reapInterval);
    }

    // Destroy all resources
    const resources = Array.from(this.resources.keys());
    await Promise.all(
      resources.map((resource) => this.destroyResource(resource))
    );

    this.emit('drained');
  }

  /**
   * Clear all resources and reset
   */
  public async clear(): Promise<void> {
    await this.drain();
    this.resources.clear();
    this.available = [];
    this.waitQueue = [];
    this.stats = {
      size: 0,
      available: 0,
      acquired: 0,
      pending: 0,
      created: 0,
      destroyed: 0,
      errors: 0,
      avgAcquireTime: 0,
      avgIdleTime: 0,
    };
    this.shuttingDown = false;
    this.emit('cleared');
  }
}

/**
 * Create a connection pool for database connections
 */
export function createConnectionPool<T>(
  factory: ResourceFactory<T>,
  config?: Partial<PoolConfig<T>>
): ResourcePool<T> {
  const defaultConfig: PoolConfig<T> = {
    min: 2,
    max: 10,
    acquireTimeout: 30000,
    idleTimeout: 60000,
    createTimeout: 10000,
    destroyTimeout: 5000,
    reapInterval: 10000,
    validateOnAcquire: true,
    validateOnReturn: false,
    factory,
  };

  return new ResourcePool({
    ...defaultConfig,
    ...config,
  });
}
