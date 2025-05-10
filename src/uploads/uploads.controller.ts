import {
  BadRequestException,
  Controller,
  Post,
  UploadedFiles,
  UploadedFile,
  UseInterceptors,
  Param,
  Get,
  Res,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';

@Controller('api/uploads')
export class UploadsController {
  // POST: ~/api/uploads
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  public uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('no file provided');

    console.log('File uploaded', { file });
    return { message: 'File uploded successfully' };
  }

  // POST: ~/api/uploads/multiple-files
  @Post('multiple-files')
  @UseInterceptors(FilesInterceptor('files'))
  public uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (!files || files.length === 0)
      throw new BadRequestException('no files provided');

    console.log('Files uploaded', { files });
    return { message: 'Files uploded successfully' };
  }

  // GET: ~/api/uploads/:image
  @Get(':image')
  public showUploadImage(@Param('image') image: string, @Res() res: Response) {
    return res.sendFile(image, { root: 'images' });
  }
}
