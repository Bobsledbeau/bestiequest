import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Force HTTPS redirect in production
  app.use((req: any, res: any, next: any) => {
    // Check if not localhost and request is HTTP
    if (
      req.headers.host &&
      !req.headers.host.includes('localhost') &&
      req.headers['x-forwarded-proto'] === 'http'
    ) {
      // Redirect to HTTPS
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
  });

  // Enable CORS for mobile app access
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Enable validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('BestieQuest API')
    .setDescription(
      'API for generating personalized, age-appropriate bedtime stories for children. ' +
      'Select characters, themes, and story length to create unique stories tailored for kids ages 4-8.'
    )
    .setVersion('1.0')
    .addTag('Items', 'Available story characters and items')
    .addTag('Themes', 'Story themes and categories')
    .addTag('Stories', 'Story generation and management')
    .addTag('Health', 'Service health check')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Prevent caching of Swagger docs
  app.use('/api-docs', (req: any, res: any, next: any) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
  });

  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: 'BestieQuest API Documentation',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info { margin: 30px 0; }
      .swagger-ui .info .title { 
        font-size: 2.5em; 
        color: #2c3e50;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      .swagger-ui .info .description { 
        font-size: 1.1em; 
        color: #34495e;
        line-height: 1.6;
      }
      .swagger-ui .scheme-container { 
        background: #f8f9fa; 
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      }
      .swagger-ui .opblock-tag {
        font-size: 1.3em;
        color: #2c3e50;
        border-bottom: 2px solid #3498db;
        padding-bottom: 10px;
        margin: 30px 0 15px 0;
      }
      .swagger-ui .opblock { 
        border-radius: 8px; 
        margin: 15px 0;
        border-left: 4px solid #3498db;
        box-shadow: 0 2px 4px rgba(0,0,0,0.08);
      }
      .swagger-ui .opblock.opblock-get .opblock-summary-method { 
        background: #61affe; 
      }
      .swagger-ui .opblock.opblock-post .opblock-summary-method { 
        background: #49cc90; 
      }
      .swagger-ui .opblock.opblock-patch .opblock-summary-method { 
        background: #fca130; 
      }
      .swagger-ui .opblock.opblock-delete .opblock-summary-method { 
        background: #f93e3e; 
      }
      .swagger-ui .btn.execute { 
        background-color: #3498db; 
        border-color: #3498db;
        color: white;
        font-weight: 600;
      }
      .swagger-ui .btn.execute:hover { 
        background-color: #2980b9; 
        border-color: #2980b9;
      }
      .swagger-ui .response-col_status { 
        font-weight: 700; 
      }
      .swagger-ui .model { 
        font-size: 0.95em; 
      }
      body { 
        background: #ffffff; 
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      tryItOutEnabled: true,
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  console.log(`\n🚀 BestieQuest API is running on port ${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api-docs`);
  console.log(`❤️  Health Check: http://localhost:${port}/health\n`);
}

bootstrap();
