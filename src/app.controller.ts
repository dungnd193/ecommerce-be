import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('images/product-images/:filename')
  async getProductImage(@Param('filename') filename, @Res() res) {
    res.sendFile(filename, { root: './uploads/product-images' });
  }
  
  @Get('images/user-avatar/:filename')
  async getUserAvatar(@Param('filename') filename, @Res() res) {
    res.sendFile(filename, { root: './uploads/user-avatar' });
  }
}
