/**
 * Mock Supabase Client for Testing
 */

export class MockSupabaseClient {
  private storage: Map<string, any> = new Map();
  private database: Map<string, any[]> = new Map();

  constructor() {
    this.initializeTables();
  }

  private initializeTables() {
    this.database.set('pdf_documents', []);
    this.database.set('pdf_text_content', []);
    this.database.set('pdf_images', []);
    this.database.set('text_image_correlations', []);
    this.database.set('assessment_questions', []);
    this.database.set('pdf_processing_logs', []);
  }

  // Storage API Mock
  storage = {
    from: (bucket: string) => ({
      upload: async (path: string, file: Buffer | File, options?: any) => {
        const key = `${bucket}/${path}`;
        this.storage.set(key, {
          data: file,
          metadata: options?.metadata || {},
          uploadedAt: new Date()
        });
        return {
          data: { path, id: key },
          error: null
        };
      },

      download: async (path: string) => {
        const key = `${bucket}/${path}`;
        const stored = this.storage.get(key);
        if (!stored) {
          return { data: null, error: { message: 'File not found' } };
        }
        return { data: stored.data, error: null };
      },

      remove: async (paths: string[]) => {
        paths.forEach(path => {
          const key = `${bucket}/${path}`;
          this.storage.delete(key);
        });
        return { data: paths, error: null };
      },

      list: async (path?: string) => {
        const prefix = `${bucket}/${path || ''}`;
        const files = Array.from(this.storage.keys())
          .filter(key => key.startsWith(prefix))
          .map(key => ({
            name: key.replace(prefix, ''),
            id: key,
            metadata: this.storage.get(key)?.metadata
          }));
        return { data: files, error: null };
      },

      getPublicUrl: (path: string) => ({
        data: { publicUrl: `http://localhost:54321/storage/v1/object/public/${bucket}/${path}` }
      })
    })
  };

  // Database API Mock
  from(table: string) {
    return {
      select: (columns: string = '*') => this.createQuery(table, 'select', columns),
      insert: (data: any) => this.createQuery(table, 'insert', data),
      update: (data: any) => this.createQuery(table, 'update', data),
      delete: () => this.createQuery(table, 'delete'),
      upsert: (data: any) => this.createQuery(table, 'upsert', data)
    };
  }

  private createQuery(table: string, operation: string, data?: any) {
    const query = {
      table,
      operation,
      data,
      filters: [] as any[],
      orderBy: null as any,
      limitValue: null as number | null,
      single: false,

      eq: function(column: string, value: any) {
        this.filters.push({ type: 'eq', column, value });
        return this;
      },

      neq: function(column: string, value: any) {
        this.filters.push({ type: 'neq', column, value });
        return this;
      },

      gt: function(column: string, value: any) {
        this.filters.push({ type: 'gt', column, value });
        return this;
      },

      gte: function(column: string, value: any) {
        this.filters.push({ type: 'gte', column, value });
        return this;
      },

      lt: function(column: string, value: any) {
        this.filters.push({ type: 'lt', column, value });
        return this;
      },

      lte: function(column: string, value: any) {
        this.filters.push({ type: 'lte', column, value });
        return this;
      },

      like: function(column: string, value: any) {
        this.filters.push({ type: 'like', column, value });
        return this;
      },

      in: function(column: string, values: any[]) {
        this.filters.push({ type: 'in', column, values });
        return this;
      },

      order: function(column: string, options?: { ascending?: boolean }) {
        this.orderBy = { column, ascending: options?.ascending !== false };
        return this;
      },

      limit: function(count: number) {
        this.limitValue = count;
        return this;
      },

      single: function() {
        this.single = true;
        return this;
      },

      execute: async function(dbInstance: MockSupabaseClient) {
        const tableData = dbInstance.database.get(this.table) || [];

        switch (this.operation) {
          case 'select': {
            let results = [...tableData];

            // Apply filters
            this.filters.forEach((filter: any) => {
              results = results.filter((row: any) => {
                const value = row[filter.column];
                switch (filter.type) {
                  case 'eq': return value === filter.value;
                  case 'neq': return value !== filter.value;
                  case 'gt': return value > filter.value;
                  case 'gte': return value >= filter.value;
                  case 'lt': return value < filter.value;
                  case 'lte': return value <= filter.value;
                  case 'like': return String(value).includes(filter.value.replace(/%/g, ''));
                  case 'in': return filter.values.includes(value);
                  default: return true;
                }
              });
            });

            // Apply ordering
            if (this.orderBy) {
              results.sort((a: any, b: any) => {
                const aVal = a[this.orderBy.column];
                const bVal = b[this.orderBy.column];
                const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
                return this.orderBy.ascending ? comparison : -comparison;
              });
            }

            // Apply limit
            if (this.limitValue !== null) {
              results = results.slice(0, this.limitValue);
            }

            return {
              data: this.single ? results[0] || null : results,
              error: null
            };
          }

          case 'insert': {
            const records = Array.isArray(this.data) ? this.data : [this.data];
            const inserted = records.map((record: any) => ({
              id: record.id || `mock-${Date.now()}-${Math.random()}`,
              ...record,
              created_at: record.created_at || new Date().toISOString(),
              updated_at: new Date().toISOString()
            }));

            tableData.push(...inserted);
            dbInstance.database.set(this.table, tableData);

            return { data: inserted, error: null };
          }

          case 'update': {
            let updated: any[] = [];
            const newTableData = tableData.map((row: any) => {
              const matches = this.filters.every((filter: any) => {
                const value = row[filter.column];
                return value === filter.value;
              });

              if (matches) {
                const updatedRow = { ...row, ...this.data, updated_at: new Date().toISOString() };
                updated.push(updatedRow);
                return updatedRow;
              }
              return row;
            });

            dbInstance.database.set(this.table, newTableData);
            return { data: updated, error: null };
          }

          case 'delete': {
            const newTableData = tableData.filter((row: any) => {
              return !this.filters.every((filter: any) => {
                const value = row[filter.column];
                return value === filter.value;
              });
            });

            dbInstance.database.set(this.table, newTableData);
            return { data: null, error: null };
          }

          case 'upsert': {
            // Simple upsert implementation
            const records = Array.isArray(this.data) ? this.data : [this.data];
            const newTableData = [...tableData];

            records.forEach((record: any) => {
              const existingIndex = newTableData.findIndex((row: any) => row.id === record.id);
              if (existingIndex >= 0) {
                newTableData[existingIndex] = { ...newTableData[existingIndex], ...record, updated_at: new Date().toISOString() };
              } else {
                newTableData.push({
                  id: record.id || `mock-${Date.now()}-${Math.random()}`,
                  ...record,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                });
              }
            });

            dbInstance.database.set(this.table, newTableData);
            return { data: records, error: null };
          }

          default:
            return { data: null, error: { message: 'Unknown operation' } };
        }
      }
    };

    // Make execute work with the instance
    const boundQuery = {
      ...query,
      then: async (resolve: any, reject: any) => {
        try {
          const result = await query.execute(this);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }
    };

    return boundQuery;
  }

  // RPC Mock
  rpc(functionName: string, params?: any) {
    return {
      execute: async () => {
        // Mock implementation for RPC calls
        return { data: null, error: null };
      }
    };
  }

  // Auth Mock
  auth = {
    getUser: async () => ({
      data: {
        user: {
          id: 'mock-user-id',
          email: 'test@example.com'
        }
      },
      error: null
    }),

    signIn: async () => ({
      data: { user: { id: 'mock-user-id' }, session: {} },
      error: null
    })
  };

  // Reset for testing
  reset() {
    this.storage.clear();
    this.initializeTables();
  }

  // Helper to seed test data
  seed(table: string, data: any[]) {
    this.database.set(table, data);
  }

  // Helper to get all data
  getAllData(table: string) {
    return this.database.get(table) || [];
  }
}

export const createMockSupabaseClient = () => new MockSupabaseClient();
