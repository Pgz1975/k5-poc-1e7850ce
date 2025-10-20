/**
 * FERPA Encryption Implementation
 *
 * Data encryption at rest and in transit
 */

import * as crypto from 'crypto';
import { EncryptionConfig } from '../types';

// ============================================================================
// Encryption Configuration
// ============================================================================

const DEFAULT_CONFIG: EncryptionConfig = {
  algorithm: 'aes-256-gcm',
  keySize: 32,
  saltRounds: 10,
  encoding: 'base64'
};

// ============================================================================
// Encryption Manager
// ============================================================================

export class EncryptionManager {
  private config: EncryptionConfig;
  private masterKey: Buffer;

  constructor(config: Partial<EncryptionConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.masterKey = this.deriveKey(process.env.MASTER_KEY || 'default-key-change-in-production');
  }

  /**
   * Derive encryption key from master key
   */
  private deriveKey(masterKey: string): Buffer {
    return crypto.scryptSync(
      masterKey,
      'salt-should-be-from-env',
      this.config.keySize
    );
  }

  /**
   * Encrypt data
   */
  encrypt(plaintext: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      this.config.algorithm,
      this.masterKey,
      iv
    );

    let encrypted = cipher.update(plaintext, 'utf8', this.config.encoding);
    encrypted += cipher.final(this.config.encoding);

    const authTag = (cipher as any).getAuthTag();

    // Combine IV + AuthTag + Encrypted Data
    const combined = Buffer.concat([
      iv,
      authTag,
      Buffer.from(encrypted, this.config.encoding)
    ]);

    return combined.toString(this.config.encoding);
  }

  /**
   * Decrypt data
   */
  decrypt(ciphertext: string): string {
    const combined = Buffer.from(ciphertext, this.config.encoding);

    const iv = combined.subarray(0, 16);
    const authTag = combined.subarray(16, 32);
    const encrypted = combined.subarray(32);

    const decipher = crypto.createDecipheriv(
      this.config.algorithm,
      this.masterKey,
      iv
    );

    (decipher as any).setAuthTag(authTag);

    let decrypted = decipher.update(encrypted.toString(this.config.encoding), this.config.encoding, 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Hash data (one-way)
   */
  hash(data: string): string {
    return crypto
      .createHash('sha256')
      .update(data)
      .digest(this.config.encoding);
  }

  /**
   * Hash password with salt
   */
  async hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16).toString('hex');
      crypto.pbkdf2(
        password,
        salt,
        this.config.saltRounds * 10000,
        64,
        'sha512',
        (err, derivedKey) => {
          if (err) reject(err);
          resolve(salt + ':' + derivedKey.toString('hex'));
        }
      );
    });
  }

  /**
   * Verify password hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const [salt, key] = hash.split(':');
      crypto.pbkdf2(
        password,
        salt,
        this.config.saltRounds * 10000,
        64,
        'sha512',
        (err, derivedKey) => {
          if (err) reject(err);
          resolve(key === derivedKey.toString('hex'));
        }
      );
    });
  }

  /**
   * Encrypt field in object
   */
  encryptField<T extends Record<string, any>>(
    obj: T,
    field: keyof T
  ): T {
    if (obj[field] !== undefined && obj[field] !== null) {
      obj[field] = this.encrypt(String(obj[field])) as any;
    }
    return obj;
  }

  /**
   * Decrypt field in object
   */
  decryptField<T extends Record<string, any>>(
    obj: T,
    field: keyof T
  ): T {
    if (obj[field] !== undefined && obj[field] !== null) {
      obj[field] = this.decrypt(String(obj[field])) as any;
    }
    return obj;
  }

  /**
   * Encrypt multiple fields
   */
  encryptFields<T extends Record<string, any>>(
    obj: T,
    fields: (keyof T)[]
  ): T {
    const encrypted = { ...obj };
    for (const field of fields) {
      this.encryptField(encrypted, field);
    }
    return encrypted;
  }

  /**
   * Decrypt multiple fields
   */
  decryptFields<T extends Record<string, any>>(
    obj: T,
    fields: (keyof T)[]
  ): T {
    const decrypted = { ...obj };
    for (const field of fields) {
      this.decryptField(decrypted, field);
    }
    return decrypted;
  }

  /**
   * Generate secure token
   */
  generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate CSRF token
   */
  generateCSRFToken(): string {
    return this.generateToken(32);
  }

  /**
   * Verify CSRF token
   */
  verifyCSRFToken(token: string, expected: string): boolean {
    return crypto.timingSafeEqual(
      Buffer.from(token),
      Buffer.from(expected)
    );
  }
}

// ============================================================================
// Export singleton instance
// ============================================================================

export const encryptionManager = new EncryptionManager();
