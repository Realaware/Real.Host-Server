import { Injectable } from '@nestjs/common';
import {
    PrismaClient,
    User,
    Image,
    Prisma
} from '@prisma/client'


@Injectable()
export class ImagesService {
    constructor(private readonly prisma: PrismaClient) {}
    
    async upload(image: string,user: User): Promise<Image> {
        const response = await this.prisma.image.create({
            data:{
                image,
                userid: user.userid
            }
        })

        return response;
    }

    async findOne(uuid: string) {
        // findunique doens't have uuid property on where.
        const data = await this.prisma.image.findFirst({
            where:{
                uuid
            },
            include:{
                user:{
                    select:{
                        username: true,
                        userid: true
                    }
                }
            }
        })

        return data;
    }

    async wipeAll() {
        return await this.prisma.image.deleteMany();
    }

    async getGlobalInfo() {
        const res = await this.prisma.image.findMany();
        const res2 = await this.prisma.user.findMany();

        return {
            images: res.length,
            users: res2.length,
        }
    }
}
