import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
//swagger
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //for swagger
  const config = new DocumentBuilder()
    .setTitle('My Nestjs User Project')
    .setDescription('This is the API documentation of my internship project!')
    .setVersion('1.0.0')
    .build()
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  //then start the application in watch mode 
  //open http://localhost:3000/api

  //cookie
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
    exposedHeaders: ['set-cookie']
  });

  //for dto
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,

    })
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
