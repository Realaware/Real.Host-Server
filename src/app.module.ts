import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ImagesModule } from './images/images.module';
import { PrismaClient } from '.prisma/client';

@Module({
  imports: [AuthModule, UsersModule, ImagesModule],
  controllers: [AppController],
  providers: [PrismaClient],
})
export class AppModule {}
