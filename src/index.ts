import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncryptionService } from './encryption.service';

export * from './cryptconfig';
export * from './encryption.service';

@NgModule({
  imports: [
    CommonModule
  ]
})
export class EncryptionServiceModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: EncryptionServiceModule,
      providers: [EncryptionService]
    };
  }
}
