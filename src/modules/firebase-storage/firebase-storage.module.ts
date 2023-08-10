import { Module, DynamicModule } from '@nestjs/common';
import { FirebaseStorageService } from './firebase-storage.service';

export interface FirebaseStorageModuleOptions {
  projectId: string;
  clientEmail: string;
  privateKey: string;
  storageBucket: string;
}

@Module({})
export class FirebaseStorageModule {
  static forRoot(credentials: FirebaseStorageModuleOptions): DynamicModule {
    return {
      module: FirebaseStorageModule,
      providers: [
        {
          provide: 'FIREBASE_CREDENTIALS',
          useValue: credentials,
        },
        FirebaseStorageService,
      ],
      exports: [FirebaseStorageService],
    };
  }
}
