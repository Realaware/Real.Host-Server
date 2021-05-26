import { PrismaClient } from '.prisma/client';
import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';

@Module({
  providers: [ImagesService, PrismaClient],
  exports: [ImagesService]
})
export class ImagesModule {}
