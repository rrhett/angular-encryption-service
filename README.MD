# angular-encryption-service

Provides a simple library to use SubtleCrypto in the browser in Angular 2+ apps.

This provides a method to generate CryptoKeys using a passphrase, and requires
a method to provide a salt for a user.

Finally, given a CryptoKey, this provides a straight-forward way of encrypting
and decrypting strings.

The focus of this app is to be as simple to use with minimal configuration
needed. No guarantees are expressed or implied as to the cryptographic fitness
of this app. Although it does not implement crypto methods itself, it should not
be relied upon for any cryptographic requirements.

## Installation

To install this library, run:

```bash
$ npm install angular-encryption-service --save
```

## Usage

From your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { CRYPT_CONFIG_PROVIDER, CryptConfigProvider, EncryptionService } from 'angular-encryption-service';

const AppCryptConfigProvider: CryptConfigProvider = {
  getSalt(): Promise<string> {
    // TODO: implement providing a salt, which should be unique per user and
    // base64-encoded.
    return Promise.resolve('saltsalt');
  }
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    EncryptionServiceModule.forRoot()
  ],
  providers: [
    {provide: CRYPT_CONFIG_PROVIDER, useValue: AppCryptConfigProvider}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Now you can inject the EncryptionService and use it to generate CryptoKeys,
and decrypt and encrypt strings.

```typescript
class MyClass {
  constructor(encryptionService: EncryptionService) {}

  demoEncrypt(): Promise<string> {
    return this.encryptionService.generateKey('passphrase').then(key => {
      return this.encryptionService.encrypt('plain text', key);
    });
  }
}
```

## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## License

ISC © [Rhett Robinson](mailto:rrhett@gmail.com)
