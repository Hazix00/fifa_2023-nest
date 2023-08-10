import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Bucket } from '@google-cloud/storage';
import { FirebaseStorageModuleOptions } from './firebase-storage.module';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FirebaseStorageService {
  private readonly bucket: Bucket;

  constructor(@Inject('FIREBASE_CREDENTIALS') readonly credentials: FirebaseStorageModuleOptions) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: credentials.projectId,
        clientEmail: credentials.clientEmail,
        privateKey: credentials.privateKey,
      }),
      storageBucket: credentials.storageBucket
    });

    this.bucket = admin.storage().bucket();
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const destination = path.join(__dirname, '../../..','temp',fileName);
    if(!fs.existsSync(destination)) {
      fs.mkdirSync(destination);
    }
    file.path = path.join(destination,fileName);

    await fs.promises.writeFile(file.path, file.buffer);

    await this.bucket.upload(file.path, {
      destination: fileName,
      metadata: {
        contentType: file.mimetype,
      },
    });

    // Delete the temporary file
    await fs.promises.unlink(file.path);

    const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${fileName}`;
    return publicUrl;
  }
}
