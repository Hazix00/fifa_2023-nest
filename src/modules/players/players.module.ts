import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { PrismaService } from '../../common/services/prisma.service';
import { FirebaseStorageModule } from '../firebase-storage/firebase-storage.module';

@Module({
  imports: [
    FirebaseStorageModule,
    PlayersModule,
  ],
  controllers: [PlayersController],
  providers: [PlayersService, PrismaService],
})
export class PlayersModule {}
