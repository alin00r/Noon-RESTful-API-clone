import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Repository, Like, Between } from 'typeorm';
import { Product } from './products.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly userServices: UsersService,
  ) {}

  /**
   * Create new product
   *  @param dto data for creating new product
   *  @param userId id of the logged in user (Admin)
   *  @returns the created product from the database
   */
  public async createProduct(dto: CreateProductDto, userId: number) {
    const user = await this.userServices.getCurrentUser(userId);
    const newProduct = this.productsRepository.create({
      ...dto, // BOOK -> book
      title: dto.title.toLowerCase(),
      user,
    });
    return this.productsRepository.save(newProduct);
  }

  /**
   * Delete product
   * @param id id of the product
   * @returns a success message
   */
  public async delete(id: number) {
    const product = await this.getOneBy(id);
    if (!product) throw new NotFoundException('product not found');
    await this.productsRepository.remove(product);
    return { message: 'Product deleted successfully' };
  }

  /**
   * Get all products
   * @returns collection of products
   * @access public
   */
  public async getAll(title?: string, minPrice?: string, maxPrice?: string) {
    const filters = {
      ...(title ? { title: Like(`%${title}%`) } : {}),
      ...(minPrice && maxPrice
        ? {
            price: Between(
              parseInt(minPrice ?? '0'),
              parseInt(maxPrice ?? '100000'),
            ),
          }
        : {}),
    };
    return await this.productsRepository.find({
      where: filters,
    });
  }

  /**
   * Get one product by id
   * @param id id of the product
   * @returns product from the database
   */
  public async getOneBy(id: number) {
    const product = await this.productsRepository.findOne({
      where: { id },
    });
    if (!product) throw new NotFoundException('product not found');
    return product;
  }

  /**
   * Update product By id
   * @param id id of the product
   * @param dto data for updating the exsiting product
   * @returns the updated product
   */
  public async update(id: number, dto: UpdateProductDto) {
    const product = await this.getOneBy(id);
    product.title = dto.title ?? product.title; // -> coalescing operator
    product.description = dto.description ?? product.description;
    product.price = dto.price ?? product.price;
    return this.productsRepository.save(product);
  }
}
