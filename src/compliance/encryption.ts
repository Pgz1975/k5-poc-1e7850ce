/**
 * Data Encryption Utilities
 * Provides encryption services for data at rest and in transit
 * Supports AES-256-GCM, RSA, and hybrid encryption schemes
 */

export enum EncryptionAlgorithm {
  AES_256_GCM = 'AES-256-GCM',
  AES_256_CBC = 'AES-256-CBC',
  RSA_OAEP = 'RSA-OAEP',
  RSA_PSS = 'RSA-PSS'
}

export enum KeyPurpose {
  DATA_ENCRYPTION = 'data_encryption',
  KEY_ENCRYPTION = 'key_encryption',
  DIGITAL_SIGNATURE = 'digital_signature',
  SESSION_KEY = 'session_key'
}

export interface EncryptedData {
  algorithm: EncryptionAlgorithm;
  ciphertext: string;           // Base64 encoded
  iv: string;                   // Initialization vector (Base64)
  authTag?: string;             // Authentication tag for GCM mode
  keyId: string;                // Reference to encryption key
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface EncryptionKey {
  id: string;
  purpose: KeyPurpose;
  algorithm: EncryptionAlgorithm;
  createdAt: Date;
  expiresAt?: Date;
  rotatedFrom?: string;         // Previous key ID
  status: 'active' | 'rotating' | 'deprecated' | 'revoked';
}

/**
 * Encryption Service for data protection
 */
export class EncryptionService {
  private masterKey: CryptoKey | null = null;
  private keyCache: Map<string, CryptoKey> = new Map();

  /**
   * Initialize encryption service with master key
   */
  async initialize(masterKeyMaterial?: string): Promise<void> {
    const keyMaterial = masterKeyMaterial || Deno.env.get('MASTER_ENCRYPTION_KEY');

    if (!keyMaterial) {
      throw new Error('Master encryption key not provided');
    }

    // Derive master key using PBKDF2
    const importedKey = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(keyMaterial),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    this.masterKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode('k5-master-salt-v1'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      importedKey,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey']
    );
  }

  /**
   * Encrypt data at rest (AES-256-GCM)
   */
  async encryptDataAtRest(
    data: any,
    keyId?: string,
    additionalData?: Record<string, any>
  ): Promise<EncryptedData> {
    if (!this.masterKey) {
      await this.initialize();
    }

    // Generate data encryption key (DEK)
    const dek = await this.generateDataEncryptionKey();

    // Serialize and encode data
    const plaintext = new TextEncoder().encode(JSON.stringify(data));

    // Generate initialization vector
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Encrypt data
    const ciphertext = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
        additionalData: additionalData ? new TextEncoder().encode(JSON.stringify(additionalData)) : undefined
      },
      dek,
      plaintext
    );

    // Extract auth tag (last 16 bytes in GCM mode)
    const ciphertextArray = new Uint8Array(ciphertext);
    const authTag = ciphertextArray.slice(-16);
    const ciphertextWithoutTag = ciphertextArray.slice(0, -16);

    // Wrap DEK with master key for storage
    const wrappedDek = await this.wrapKey(dek, keyId || 'master');

    return {
      algorithm: EncryptionAlgorithm.AES_256_GCM,
      ciphertext: this.arrayBufferToBase64(ciphertextWithoutTag),
      iv: this.arrayBufferToBase64(iv),
      authTag: this.arrayBufferToBase64(authTag),
      keyId: keyId || 'master',
      timestamp: new Date(),
      metadata: {
        wrappedDek: wrappedDek,
        additionalData
      }
    };
  }

  /**
   * Decrypt data at rest
   */
  async decryptDataAtRest(encryptedData: EncryptedData): Promise<any> {
    if (!this.masterKey) {
      await this.initialize();
    }

    // Unwrap DEK
    const dek = await this.unwrapKey(encryptedData.metadata?.wrappedDek, encryptedData.keyId);

    // Decode components
    const iv = this.base64ToArrayBuffer(encryptedData.iv);
    const ciphertext = this.base64ToArrayBuffer(encryptedData.ciphertext);
    const authTag = encryptedData.authTag ? this.base64ToArrayBuffer(encryptedData.authTag) : new Uint8Array(0);

    // Combine ciphertext and auth tag
    const combined = new Uint8Array(ciphertext.byteLength + authTag.byteLength);
    combined.set(new Uint8Array(ciphertext), 0);
    combined.set(new Uint8Array(authTag), ciphertext.byteLength);

    // Decrypt
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
        additionalData: encryptedData.metadata?.additionalData
          ? new TextEncoder().encode(JSON.stringify(encryptedData.metadata.additionalData))
          : undefined
      },
      dek,
      combined
    );

    return JSON.parse(new TextDecoder().decode(decrypted));
  }

  /**
   * Encrypt data in transit (for API responses)
   */
  async encryptDataInTransit(
    data: any,
    recipientPublicKey: CryptoKey
  ): Promise<{
    encryptedData: string;
    encryptedKey: string;
    iv: string;
  }> {
    // Generate ephemeral symmetric key
    const symmetricKey = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    // Encrypt data with symmetric key
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const plaintext = new TextEncoder().encode(JSON.stringify(data));

    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      symmetricKey,
      plaintext
    );

    // Encrypt symmetric key with recipient's public key
    const exportedSymmetricKey = await crypto.subtle.exportKey('raw', symmetricKey);
    const encryptedKey = await crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      recipientPublicKey,
      exportedSymmetricKey
    );

    return {
      encryptedData: this.arrayBufferToBase64(ciphertext),
      encryptedKey: this.arrayBufferToBase64(encryptedKey),
      iv: this.arrayBufferToBase64(iv)
    };
  }

  /**
   * Decrypt data in transit
   */
  async decryptDataInTransit(
    encryptedData: string,
    encryptedKey: string,
    iv: string,
    privateKey: CryptoKey
  ): Promise<any> {
    // Decrypt symmetric key
    const encryptedKeyBuffer = this.base64ToArrayBuffer(encryptedKey);
    const symmetricKeyBuffer = await crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      privateKey,
      encryptedKeyBuffer
    );

    // Import symmetric key
    const symmetricKey = await crypto.subtle.importKey(
      'raw',
      symmetricKeyBuffer,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    // Decrypt data
    const ciphertext = this.base64ToArrayBuffer(encryptedData);
    const ivBuffer = this.base64ToArrayBuffer(iv);

    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivBuffer },
      symmetricKey,
      ciphertext
    );

    return JSON.parse(new TextDecoder().decode(plaintext));
  }

  /**
   * Hash sensitive data (one-way)
   */
  async hashData(data: string, salt?: string): Promise<string> {
    const actualSalt = salt || crypto.randomUUID();
    const combined = data + actualSalt;

    const hashBuffer = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(combined)
    );

    return this.arrayBufferToBase64(hashBuffer) + ':' + actualSalt;
  }

  /**
   * Verify hashed data
   */
  async verifyHash(data: string, hash: string): Promise<boolean> {
    const [, salt] = hash.split(':');
    const newHash = await this.hashData(data, salt);
    return newHash === hash;
  }

  /**
   * Generate data encryption key
   */
  private async generateDataEncryptionKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Wrap encryption key with master key
   */
  private async wrapKey(key: CryptoKey, keyId: string): Promise<string> {
    if (!this.masterKey) {
      throw new Error('Master key not initialized');
    }

    const wrappedKey = await crypto.subtle.wrapKey(
      'raw',
      key,
      this.masterKey,
      { name: 'AES-GCM', iv: new TextEncoder().encode(keyId.padEnd(12, '0')) }
    );

    return this.arrayBufferToBase64(wrappedKey);
  }

  /**
   * Unwrap encryption key
   */
  private async unwrapKey(wrappedKeyBase64: string, keyId: string): Promise<CryptoKey> {
    if (!this.masterKey) {
      throw new Error('Master key not initialized');
    }

    const wrappedKey = this.base64ToArrayBuffer(wrappedKeyBase64);

    return await crypto.subtle.unwrapKey(
      'raw',
      wrappedKey,
      this.masterKey,
      { name: 'AES-GCM', iv: new TextEncoder().encode(keyId.padEnd(12, '0')) },
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Generate RSA key pair for asymmetric encryption
   */
  async generateKeyPair(): Promise<{
    publicKey: CryptoKey;
    privateKey: CryptoKey;
    publicKeyPEM: string;
    privateKeyPEM: string;
  }> {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256'
      },
      true,
      ['encrypt', 'decrypt']
    );

    const publicKeyBuffer = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const privateKeyBuffer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

    return {
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey,
      publicKeyPEM: this.arrayBufferToPEM(publicKeyBuffer, 'PUBLIC KEY'),
      privateKeyPEM: this.arrayBufferToPEM(privateKeyBuffer, 'PRIVATE KEY')
    };
  }

  /**
   * Rotate encryption keys
   */
  async rotateKey(oldKeyId: string): Promise<EncryptionKey> {
    const newKey: EncryptionKey = {
      id: crypto.randomUUID(),
      purpose: KeyPurpose.DATA_ENCRYPTION,
      algorithm: EncryptionAlgorithm.AES_256_GCM,
      createdAt: new Date(),
      rotatedFrom: oldKeyId,
      status: 'active'
    };

    // Mark old key as deprecated
    // In production, update in database
    console.log(`Key rotated: ${oldKeyId} → ${newKey.id}`);

    return newKey;
  }

  /**
   * Securely delete key from memory
   */
  async deleteKey(keyId: string): Promise<void> {
    this.keyCache.delete(keyId);
    // Overwrite memory (best effort in JavaScript)
    if (globalThis.gc) {
      globalThis.gc();
    }
  }

  // Utility methods

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private arrayBufferToPEM(buffer: ArrayBuffer, label: string): string {
    const base64 = this.arrayBufferToBase64(buffer);
    const lines = base64.match(/.{1,64}/g) || [];
    return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----`;
  }
}

/**
 * Field-level encryption for sensitive database columns
 */
export class FieldEncryption {
  private encryptionService: EncryptionService;

  constructor() {
    this.encryptionService = new EncryptionService();
  }

  async initialize(): Promise<void> {
    await this.encryptionService.initialize();
  }

  /**
   * Encrypt individual field
   */
  async encryptField(value: any, fieldName: string): Promise<string> {
    const encrypted = await this.encryptionService.encryptDataAtRest(value, 'field-' + fieldName);
    return JSON.stringify(encrypted);
  }

  /**
   * Decrypt individual field
   */
  async decryptField(encryptedValue: string): Promise<any> {
    const encrypted: EncryptedData = JSON.parse(encryptedValue);
    return await this.encryptionService.decryptDataAtRest(encrypted);
  }

  /**
   * Encrypt multiple fields in an object
   */
  async encryptFields(
    obj: Record<string, any>,
    fieldsToEncrypt: string[]
  ): Promise<Record<string, any>> {
    const result = { ...obj };

    for (const field of fieldsToEncrypt) {
      if (obj[field] !== undefined && obj[field] !== null) {
        result[field] = await this.encryptField(obj[field], field);
      }
    }

    return result;
  }

  /**
   * Decrypt multiple fields in an object
   */
  async decryptFields(
    obj: Record<string, any>,
    fieldsToDecrypt: string[]
  ): Promise<Record<string, any>> {
    const result = { ...obj };

    for (const field of fieldsToDecrypt) {
      if (obj[field]) {
        try {
          result[field] = await this.decryptField(obj[field]);
        } catch (error) {
          console.error(`Failed to decrypt field ${field}:`, error);
          result[field] = null;
        }
      }
    }

    return result;
  }
}

/**
 * Transparent encryption for file storage
 */
export class FileEncryption {
  private encryptionService: EncryptionService;

  constructor() {
    this.encryptionService = new EncryptionService();
  }

  async initialize(): Promise<void> {
    await this.encryptionService.initialize();
  }

  /**
   * Encrypt file before storage
   */
  async encryptFile(fileBuffer: ArrayBuffer, filename: string): Promise<{
    encryptedData: ArrayBuffer;
    metadata: EncryptedData;
  }> {
    // For large files, encrypt in chunks
    const chunkSize = 1024 * 1024; // 1MB chunks
    const chunks: ArrayBuffer[] = [];

    for (let i = 0; i < fileBuffer.byteLength; i += chunkSize) {
      const chunk = fileBuffer.slice(i, Math.min(i + chunkSize, fileBuffer.byteLength));
      const encrypted = await this.encryptionService.encryptDataAtRest(
        this.arrayBufferToBase64(chunk),
        'file-' + filename
      );
      chunks.push(new TextEncoder().encode(JSON.stringify(encrypted)).buffer);
    }

    // Combine encrypted chunks
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      combined.set(new Uint8Array(chunk), offset);
      offset += chunk.byteLength;
    }

    return {
      encryptedData: combined.buffer,
      metadata: {
        algorithm: EncryptionAlgorithm.AES_256_GCM,
        ciphertext: '',
        iv: '',
        keyId: 'file-' + filename,
        timestamp: new Date(),
        metadata: {
          originalSize: fileBuffer.byteLength,
          chunks: chunks.length
        }
      }
    };
  }

  /**
   * Decrypt file after retrieval
   */
  async decryptFile(encryptedBuffer: ArrayBuffer, metadata: EncryptedData): Promise<ArrayBuffer> {
    // Decrypt chunks
    const encryptedString = new TextDecoder().decode(encryptedBuffer);
    const chunks = encryptedString.split('}{').map((chunk, i, arr) => {
      if (i === 0) return chunk + '}';
      if (i === arr.length - 1) return '{' + chunk;
      return '{' + chunk + '}';
    });

    const decryptedChunks: ArrayBuffer[] = [];

    for (const chunkStr of chunks) {
      try {
        const encryptedChunk: EncryptedData = JSON.parse(chunkStr);
        const decrypted = await this.encryptionService.decryptDataAtRest(encryptedChunk);
        decryptedChunks.push(this.base64ToArrayBuffer(decrypted));
      } catch (error) {
        console.error('Failed to decrypt chunk:', error);
      }
    }

    // Combine decrypted chunks
    const totalLength = decryptedChunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of decryptedChunks) {
      combined.set(new Uint8Array(chunk), offset);
      offset += chunk.byteLength;
    }

    return combined.buffer;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
