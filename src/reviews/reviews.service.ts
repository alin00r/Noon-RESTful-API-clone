import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UsersService } from 'src/users/users.service';
import { Review } from './review.entity';
import { Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { JWTPayloadType } from 'src/utils/types';
import { UserType } from 'src/utils/enums';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    private readonly prouctsService: ProductsService,
    private readonly usersService: UsersService,
  ) {}
  /**
   *
   * @param productId id of product
   * @param userId id of the user that created this review
   * @param dto  data for creating new review
   * @returns the created review from the database
   */
  public async createReview(
    productId: number,
    userId: number,
    dto: CreateReviewDto,
  ) {
    const product = await this.prouctsService.getOneBy(productId);
    const user = await this.usersService.getCurrentUser(userId);

    const review = this.reviewsRepository.create({ ...dto, user, product });

    const result = await this.reviewsRepository.save(review);
    return {
      id: result.id,
      comment: result.comment,
      rating: result.rating,
      createdAt: result.createdAt,
      userId: user.id,
      productId: product.id,
    };
  }

  /**
   * Get all reviews
   * @Param pageNumber number of the current page
   * @param reviewPerPage data per page
   * @returns collection of reviews
   */
  public async GetAll(pageNumber: number, reviewPerPage: number) {
    return await this.reviewsRepository.find({
      skip: reviewPerPage * (pageNumber - 1),
      take: reviewPerPage,
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get single review by id
   * @param id id of the review
   * @returns review from the database
   */

  private async getReviewBy(productId: number) {
    const review = await this.reviewsRepository.findOne({
      where: { id: productId },
    });
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  /**
   * Update review By id
   * @param reviewId id of the review
   * @param userId id of the owner of the review
   * @param dto data for updating the review
   * @returns the updated product
   */
  public async update(reviewId: number, userId: number, dto: UpdateReviewDto) {
    const review = await this.getReviewBy(reviewId);
    if (review.user.id !== userId)
      throw new ForbiddenException('access denied, you are not allowed');

    review.rating = dto.rating ?? review.rating; // -> coalescing operator
    review.comment = dto.comment ?? review.comment;
    return this.reviewsRepository.save(review);
  }

  /**
   * Delete review
   * @param reviewId id of the review
   * @param payload JWTPayload
   * @returns a success message
   */
  public async delete(reviewId: number, payload: JWTPayloadType) {
    const review = await this.getReviewBy(reviewId);
    if (!review) throw new NotFoundException('product not found');
    if (review.user.id === payload.id || payload.userType === UserType.ADMIN) {
      await this.reviewsRepository.remove(review);
      return { message: 'Review deleted successfully' };
    }

    throw new ForbiddenException('You are not allowed');
  }
}
