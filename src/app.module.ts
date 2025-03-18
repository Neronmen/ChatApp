import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,

    // Config Env
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // End Config Env

    // Connect Database MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    // End Connect Database MongoDB

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
