import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';



@Injectable()
export class PermGuard implements CanActivate {
    constructor(private prisma: PrismaClient) {}

    async canActivate(context: ExecutionContext) {
    
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        const response = await this.prisma.user.findUnique({
            where:{
                username: user.username
            },
            include:{
                roles:{
                    where:{
                        isAdmin:true,
                    }
                }
            }
        });

        return (user && response && response.roles.length > 0)
    }
}