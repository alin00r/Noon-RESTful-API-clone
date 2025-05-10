import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateReviewDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  @ApiProperty({ description: 'rating of the product' })
  rating?: number;

  @IsString()
  @MinLength(2)
  @IsOptional()
  @ApiProperty({ description: 'comment of the product' })
  comment?: string;
}
