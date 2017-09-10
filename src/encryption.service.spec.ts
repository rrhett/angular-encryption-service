import { EncryptionService } from './encryption.service';

class FakeCryptConfigProvider {
  getSalt(): Promise<string> {
    // Deterministic base64-encoded value.
    return Promise.resolve('saltsalt');
  }
}

describe('EncryptionService', () => {
  let enc: EncryptionService;
  const plainText = 'plain text';

  beforeEach(() => {
    enc = new EncryptionService(new FakeCryptConfigProvider());
  });

  it('should generate a key, encrypt and decrypt', (done) => {
    let key;
    enc.generateKey('passphrase').then(k => {
      key = k;
      return enc.encrypt(plainText, key);
    }).then(cipher => {
      expect(cipher).not.toEqual(plainText);
      return enc.decrypt(cipher, key);
    }).then(plain => {
      expect(plain).toEqual(plainText);
      done();
    });
  });

  it('should encrypt the same text differently each time', (done) => {
    let key;
    let cipher;
    enc.generateKey('passphrase').then(k => {
      key = k;
      return enc.encrypt(plainText, key);
    }).then(cipher1 => {
      cipher = cipher1;
      return enc.encrypt(plainText, key);
    }).then(cipher2 => {
      expect(cipher2).not.toEqual(cipher);
      done();
    });
  });
});
