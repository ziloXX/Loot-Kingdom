import 'dotenv/config'; // Load .env before anything else
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // 🔒 SECURITY: Validate critical environment variables before starting
  const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL'];
  const missingVars = requiredEnvVars.filter(v => !process.env[v]);

  if (missingVars.length > 0) {
    throw new Error(
      `❌ FATAL: Missing required environment variables: ${missingVars.join(', ')}\n` +
      `Server cannot start without these critical configuration values.`
    );
  }

  const app = await NestFactory.create(AppModule);

  // 🔒 SECURITY: Configure CORS with specific origin whitelist
  const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',')
    : ['http://localhost:3000', 'http://localhost:3001'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Enable Global Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // 📄 Configuración de Swagger (Documentación)
  const config = new DocumentBuilder()
    .setTitle('Loot Kingdom API')
    .setDescription('La API del e-commerce de coleccionables más épico de Argentina') // <--- CORREGIDO AQUÍ
    .setVersion('1.0')
    .addTag('products')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();