import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Max, Min, MinLength } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  @ApiProperty({ description: 'rating of the product ' })
  rating: number;

  @IsString()
  @MinLength(2)
  @ApiProperty({ description: 'comment of the product ' })
  comment: string;
}
