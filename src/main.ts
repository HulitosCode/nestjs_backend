import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Habilitar CORS para todos os domínios ou um domínio específico
  app.enableCors({
    origin: 'https://next-frontend-fv2e.onrender.com', // Altere para o URL do seu frontend
    methods: 'GET,POST,PATCH,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  //Validar entradas de dados
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  //The ClassSerializerInterceptor uses the class-transformer package to define how to transform objects. Use the @Exclude() decorator to exclude the password field in the UserEntity class:
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()

    .setTitle('Articles')
    .setDescription('The Articles API description')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
