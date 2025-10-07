import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000'], // frontend URL(s)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // allow cookies
  });
    app.useGlobalPipes(new ValidationPipe({
    whitelist: true,        // remove unknown properties
    forbidNonWhitelisted: true, // throw error if extra properties exist
    transform: true,        // auto-transform payloads to DTO types
  }));
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
