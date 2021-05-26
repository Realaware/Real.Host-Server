import { PrismaClient } from '.prisma/client';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService, PrismaClient],
  exports: [UsersService]
})
export class UsersModule {}
