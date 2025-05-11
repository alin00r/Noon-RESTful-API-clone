import { ApiProperty } from '@nestjs/swagger';
import { Express } from 'express';

export class FileUploadDto {
  @ApiProperty({
    type: 'array',
    name: 'files',
    items: { type: 'string', format: 'binary' },
  })
  files: Array<Express.Multer.File>;
}
