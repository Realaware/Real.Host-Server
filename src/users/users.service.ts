import { PrismaClient } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import {
    User
} from '@prisma/client'

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaClient) {}

    async findOne(username: string): Promise<User | null> {
        return this.prisma.user.findUnique({where:{username}});
    }
}
