import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { WinstonModule } from 'nest-winston';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NacosConfigModule } from '@yhostc/nest-nacos';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import Modules from './modules';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import configuration from './config/configuration';
import { XMLMiddleware } from './common/middleware/xml.middleware';

@Module({
  imports: [
    // Instance Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`./.env.${process.env.NODE_ENV}`, `./.env`],
      load: [configuration],
    }),

    // Prolicy Config
    NacosConfigModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('nacos'),
    }),

    // TypeORM
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('database'),
    }),

    // Logs
    WinstonModule.forRoot({
      transports: [
        new winston.transports.DailyRotateFile({
          dirname: 'logs',
          filename: 'access-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        }),
      ],
    }),

    ...Modules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(XMLMiddleware).forRoutes({
      path: 'notify/*',
      method: RequestMethod.POST,
    });
  }
}
// export class AppModule {}
