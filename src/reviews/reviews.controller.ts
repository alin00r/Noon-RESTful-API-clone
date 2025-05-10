import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dtos/create-review.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { JWTPayloadType } from 'src/utils/types';
import { AuthRolesGuard } from 'src/users/guards/auth-roles.guard';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { UserType } from 'src/utils/enums';
import { UpdateReviewDto } from './dtos/update-review.dto';
import {
  ApiQuery,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';

@Controller('/api/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // POST: ~/api/reviews/:productId
  @Post(':productId')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.MODERATOR, UserType.NORMAL_USER, UserType.ADMIN)
  @ApiSecurity('bearer')
  public createNewReview(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() body: CreateReviewDto,
    @CurrentUser() payload: JWTPayloadType,
  ) {
    return this.reviewsService.createReview(productId, payload.id, body);
  }

  // GET: ~/api/reviews/
  @Get()
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.MODERATOR, UserType.ADMIN)
  @ApiSecurity('bearer')
  @ApiQuery({
    name: 'pageNumber',
    required: false,
    type: 'string',
    description: 'the number of the page',
    example: '1',
  })
  @ApiQuery({
    name: 'reviewPerPage',
    required: false,
    type: 'string',
    description: 'number of reviews per page',
    example: '6',
  })
  public getAllReviews(
    @Query('pageNumber', ParseIntPipe) pageNumber: number,
    @Query('reviewPerPage', ParseIntPipe) reviewPerPage: number,
  ) {
    return this.reviewsService.GetAll(pageNumber, reviewPerPage);
  }

  // @Get(':productId')
  // public getOneReview(@Param('productId', ParseIntPipe) productId: number) {
  //   return this.reviewsService.getReviewBy(productId);
  // }

  // PATCH ~/api/reviews/:id
  @Patch(':reviewId')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  @ApiSecurity('bearer')
  public updateReview(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Body() body: UpdateReviewDto,
    @CurrentUser() payload: JWTPayloadType,
  ) {
    return this.reviewsService.update(reviewId, payload.id, body);
  }

  // DELETE ~/api/reviews/:id
  @Delete(':reviewId')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  @ApiSecurity('bearer')
  public DeleteReview(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @CurrentUser() payload: JWTPayloadType,
  ) {
    return this.reviewsService.delete(reviewId, payload);
  }
}
