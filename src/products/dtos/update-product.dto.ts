import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'Price should not be less than zero' })
  @IsOptional()
  @ApiProperty({ description: 'Price of the product' })
  price?: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  @ApiProperty({ description: 'Description of the product' })
  description?: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  @IsOptional()
  @ApiProperty()
  @ApiProperty({ description: 'Title of the product' })
  title?: string;
}
