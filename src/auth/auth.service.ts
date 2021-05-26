import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RegisterDTO } from 'src/DTO/users.register.dto';
import { saltRounds } from './salt.rounds';

class user {
  username: string;
  userid: number;
  roles: string[];
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaClient,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...data } = user;

      return data;
    }

    return null;
  }

  async login(user: User) {
    const { username, userid } = user;

    const { roles } = await this.prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        roles: {
          select: {
            name: true,
            isAdmin: true,
          },
        },
      },
    });

    const payload = { username, sub: userid, roles };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: RegisterDTO): Promise<any> {
    const data = await this.usersService.findOne(user.username);

    var { username, password } = user;

    if (!data && user.password == user.confirm) {
      password = await bcrypt.hash(password, saltRounds);

      const response = await this.prisma.user.create({
        data: {
          username,
          password,
        },
        include: {
          roles: {
            where: {
              name: 'Member',
            },
          },
        },
      });

      const { password: _, ...data } = response;

      return data;
    }

    throw new HttpException(
      { message: 'Already taken username,' },
      HttpStatus.NOT_IMPLEMENTED,
    );
  }

  async removeAccount(user: user) {
    const { username } = user;
    const data = await this.usersService.findOne(username);

    if (!data) {
      throw new UnauthorizedException();
    }

    return await this.prisma.user.delete({
      where: {
        username,
      },
      include: {
        images: {
          where: {
            user: {
              username,
            },
          },
        },
      },
    });
  }
}
