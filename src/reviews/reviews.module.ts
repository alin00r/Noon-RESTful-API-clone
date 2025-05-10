import { Module, forwardRef } from '@nestjs/common';

import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { ProductModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
  imports: [
    TypeOrmModule.forFeature([Review]),
    ProductModule,
    UsersModule,
    JwtModule,
  ],
})
export class ReviewsModule {}
