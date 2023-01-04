import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common'
import { AllExceptionsFilter } from './shared/exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const appName = "cake-pals"
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, stopAtFirstError: true }));
  app.useGlobalFilters(new AllExceptionsFilter());



  /** swagger  start*/
  const opt = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(`${appName} Docs`)
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    // .addSecurity('Authorization', { type: 'http', bearerFormat: 'Bearer ' })
    .build();

  const doc = SwaggerModule.createDocument(app, opt, {
    operationIdFactory: (
      controllerKey: string,
      methodKey: string
    ) => methodKey
  });
  SwaggerModule.setup('api', app, doc);
  /** swagger end  */


  const port = process.env.PORT || 5000
  await app.listen(port, () => {
    Logger.log(`${appName} server started at ${port}`, 'server');
    Logger.log(`DB connected`, 'DataBase')
    Logger.log(`http://localhost:${port}/api`, "swagger")
  });
}
bootstrap();
