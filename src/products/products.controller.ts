import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';

import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductsService } from './products.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { AuthRolesGuard } from 'src/users/guards/auth-roles.guard';
import { UserType } from 'src/utils/enums';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { JWTPayloadType } from 'src/utils/types';
import {
  ApiQuery,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  //POST: ~/api/products
  @Post()
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  @ApiSecurity('bearer')
  public createNewProduct(
    @Body()
    body: CreateProductDto,
    @CurrentUser() payload: JWTPayloadType,
  ) {
    return this.productsService.createProduct(body, payload.id);
  }

  //DELETE: ~/api/products/:id
  @Delete('/:id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  @ApiSecurity('bearer')
  public deleteSingleProducts(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.delete(id);
  }

  //GET: ~/api/products
  @Get()
  @ApiResponse({ status: 200, description: 'product fetched successfully' })
  @ApiOperation({ summary: 'Get a collection of product ' })
  @ApiQuery({
    name: 'title',
    required: false,
    type: 'string',
    description: 'search based on product title',
    example: 'product title',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    type: 'string',
    description: 'minmum price',
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    type: 'string',
    description: 'maximum price',
  })
  public getAllProducts(
    @Query('title') title?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    return this.productsService.getAll(title, minPrice, maxPrice);
  }

  //GET: ~/api/products/:id
  @Get('/:id')
  @Throttle({
    default: { limit: 5, ttl: 10000 },
  })
  public getSingleProducts(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getOneBy(id);
  }

  //PATCH: ~api/products/:id
  @Patch('/:id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  @ApiSecurity('bearer')
  public updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ) {
    return this.productsService.update(id, body);
  }
}
