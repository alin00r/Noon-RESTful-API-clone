import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';
import { Product } from './products/products.entity';
import { User } from './users/user.entity';
import { Review } from './reviews/review.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UploadsModule } from './uploads/uploads.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    ProductModule,
    UsersModule,
    ReviewsModule,
    UploadsModule,
    MailModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get<string>('NEON_DB_HOST'),
          port: config.get<number>('NEON_DB_PORT'),
          username: config.get<string>('NEON_DB_USERNAME'),
          password: config.get<string>('NEON_DB_BASSWORD'),
          database: 'neondb',
          ssl: {
            rejectUnauthorized: false, // ✅ Needed for NeonDB
          },
          synchronize: process.env.NODE_ENV !== 'production', // only true in dev
          entities: [Product, User, Review],
        };
      },
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
