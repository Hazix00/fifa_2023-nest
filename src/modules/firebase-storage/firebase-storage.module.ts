import { Module, DynamicModule } from '@nestjs/common';
import { FirebaseStorageService } from './firebase-storage.service';
import { ConfigService } from '@nestjs/config';

export interface FirebaseStorageModuleOptions {
  projectId: string;
  clientEmail: string;
  privateKey: string;
  storageBucket: string;
}

@Module({
  providers: [
    FirebaseStorageService,
    {
      provide: 'FIREBASE_CREDENTIALS',
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<FirebaseStorageModuleOptions> => ({
        projectId: configService.get('FIREBASE_PROJECT_ID'),
        clientEmail: configService.get('FIREBASE_CLIENT_EMAIL'),
        privateKey: configService.get('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
        storageBucket: configService.get('FIREBASE_STORAGE_BUCKET'),
      }),
    },
  ],
  exports: [FirebaseStorageService],
})
export class FirebaseStorageModule {
}
