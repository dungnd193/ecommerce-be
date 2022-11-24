import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('images/product')
  @UseInterceptors(
    FilesInterceptor('image', undefined, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  uploadImage(@UploadedFiles() files: Express.Multer.File[]) {
    const nameUrlImage = files.map((file) => {
      const upload = {
        fileName: file.filename,
        originalName: file.originalname,
      };

      this.uploadService.createFileUpload(upload);

      return upload;
    });

    return { nameUrlImage };
  }

  @Get('images/:fileName')
  async getImage(@Param('fileName') fileName: string, @Res() res) {
    res.sendFile(fileName, { root: './uploads' });
  }

  @Delete('/:fileName')
  deleteTask(@Param('fileName') fileName: string): Promise<void> {
    return this.uploadService.deleteFile(fileName);
  }
}
