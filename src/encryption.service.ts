import { Injectable, Inject } from '@angular/core';
import { TextEncoder, TextDecoder } from 'text-encoding-utf-8';
import { decode, encode } from 'typescript-base64-arraybuffer';

import { CRYPT_CONFIG_PROVIDER, CryptConfigProvider } from './cryptconfig';

@Injectable()
export class EncryptionService {
  constructor(@Inject(CRYPT_CONFIG_PROVIDER) private config: CryptConfigProvider) {}

  /**
   * Given a passphrase, generate a CryptoKey for the passphrase using the salt
   * returned by the CryptConfigProvider.
   */
  generateKey(passphrase: string): Promise<CryptoKey> {
    return this.config.getSalt().then(salt => {
      const passphraseBytes = new TextEncoder().encode(passphrase);
      const importedKeyPromise = window.crypto.subtle.importKey(
          'raw',
          passphraseBytes,
          {'name': 'PBKDF2'},
          false,
          ['deriveKey']);
      const derivedKeyPromise = importedKeyPromise.then(key => {
        return window.crypto.subtle.deriveKey(
          {
            'name': 'PBKDF2',
            'salt': decode(salt),
            // This should take around 0.5s to 1s
            'iterations': 1000000,
            'hash': 'SHA-256'
          },
          key,
          {'name': 'AES-CBC', 'length': 256},
          false,
          ['encrypt', 'decrypt']);
      });
      return derivedKeyPromise;
    });
  }

  // Note: casting as Promise due to
  // https://github.com/Microsoft/TSJS-lib-generator/issues/47

  encrypt(text: string, key: CryptoKey): Promise<string> {
    const iv = new Uint8Array(16);
    window.crypto.getRandomValues(iv);
    return window.crypto.subtle.encrypt(
        {'name': 'AES-CBC', 'iv': iv},
        key,
        new TextEncoder().encode(text)).then(cipherBuffer => {
          // Need to implement base64 stuff here:
          return encode(iv.buffer) + ':' + encode(cipherBuffer);
        }) as Promise<string>;
  }

  decrypt(cipherText: string, key: CryptoKey): Promise<string> {
    try {
      const pieces = cipherText.split(':');
      if (pieces.length !== 2) {
        return Promise.reject(
            new Error('encrypted text not formatted properly; missing ":"'));
      }
      const iv = decode(pieces[0]);
      const buffer = decode(pieces[1]);
      return window.crypto.subtle.decrypt(
        {'name': 'AES-CBC', 'iv': iv}, key, buffer).then(decryptedBuffer => {
          return new TextDecoder().decode(new Uint8Array(decryptedBuffer));
        }) as Promise<string>;
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
