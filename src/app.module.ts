import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  Next,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';
import { Product } from './products/products.entity';
import { User } from './users/user.entity';
import { Review } from './reviews/review.entity';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UploadsModule } from './uploads/uploads.module';
import { MailModule } from './mail/mail.module';
import { LoggerMiddleware } from './utils/middlewares/logger.middleware';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

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

    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 4000, // 4 seconds
        limit: 3, // 3 requests every 4 seconds for a client
      },
      {
        name: 'meduim',
        ttl: 10000, // 10 seconds
        limit: 7, // 7 requests every 10 seconds for a client
      },
      {
        name: 'long',
        ttl: 60000, // 60 seconds
        limit: 15, // 15 requests every 60 seconds for a client
      },
    ]),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
