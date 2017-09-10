import { InjectionToken } from '@angular/core';

export let CRYPT_CONFIG_PROVIDER = new InjectionToken<CryptConfigProvider>(
    'crypt.config.provider');

/**
 * Allows the application to control or provide certain parameters for the
 * encryption algorithm.
 */
export interface CryptConfigProvider {
  /**
   * Returns a base64-encoded cryptographic salt. Should be at least 32 bytes.
   */
  getSalt(): Promise<string>;
}
