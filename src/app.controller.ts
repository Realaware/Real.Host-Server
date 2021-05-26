import {
  Controller,
  Get,
  UseGuards,
  Post,
  Request,
  Body,
  Response,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { RegisterDTO } from './DTO/users.register.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images/images.service';
import { Response as Res, Request as Req } from 'express';
import { Image } from '.prisma/client';
import { PermGuard } from './others/roles.decorator';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private imageService: ImagesService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @Post('auth/register')
  async register(@Body() body: RegisterDTO) {
    return await this.authService.register(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('profile')
  async deleteOne(@Request() req) {
    return await this.authService.removeAccount(req.user);
  }

  @UseGuards(AuthGuard('jwt'), PermGuard)
  @Delete('upload')
  async wipeAll() {
    return await this.imageService.wipeAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(FileInterceptor('image', { limits: { fileSize: 1000000 } }))
  async upload(@Request() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException(
        { message: 'image file could not be found.' },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    const allowedExtensions = ['jpg', 'png']; // Preventing to upload type of file like executable .

    if (
      !allowedExtensions.includes(
        file.originalname.split('.')[file.originalname.split('.').length - 1],
      )
    ) {
      throw new HttpException(
        { message: 'Forbidden type of file.' },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    const base64 = file.buffer.toString('base64');

    const data: Image = await this.imageService.upload(base64, req.user);

    return {
      url: `http://localhost/Viewer/${data.uuid}`,
    };
  }

  @Get('uploaded/:uuid')
  async viewRawImage(@Param('uuid') id: string, @Response() res: Res) {
    const image = await this.imageService.findOne(id);

    if (!image) {
      throw new HttpException(
        { message: 'never existed image.' },
        HttpStatus.NOT_FOUND,
      );
    }
    const { createdAt } = image;
    const { username, userid } = image.user;
    const base64 = Buffer.from(image.image, 'base64');

    res
      .writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': base64.length,
        'image-data': JSON.stringify({ userid, username, createdAt }),
      })
      .end(base64);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('download')
  async downloadCfg(@Request() req: Req, @Response() res: Res) {
    const config: Object = {
      Version: '13.4.0',
      Name: 'Real.Host',
      DestinationType: 'ImageUploader, FileUploader',
      RequestMethod: 'POST',
      RequestURL: 'http://localhost/upload',
      Headers: {
        Authorization: req.headers.authorization,
      },
      Body: 'MultipartFormData',
      FileFormName: 'image',
      URL: '$json:url$',
    };

    res.attachment('Config.sxcu').send(config);
  }

  @Get('info')
  async getGlobalInfo() {
    return await this.imageService.getGlobalInfo();
  }
}
