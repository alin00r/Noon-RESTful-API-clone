import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // avoid user passing invaild properts
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: 'http://localhost:3000',
  });

  const swagger = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('Your API description')
    .addServer('http://localhost:5000')
    .setTermsOfService('http:localhost:5000/terms-of-service')
    .setLicense('MIT License', 'https://opensource.org/license/mit')
    .setVersion('1.0')
    .addSecurity('bearer', { type: 'http', scheme: 'bearer' })
    .addBasicAuth()
    .build();
  const documentation = SwaggerModule.createDocument(app, swagger);
  // http:localhost:5000/swagger
  SwaggerModule.setup('swagger', app, documentation);

  await app.listen(process.env.PORT ?? 5000);
}

bootstrap();
``;
