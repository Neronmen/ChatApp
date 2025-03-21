import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './socket.io/events.module';
import { ChatModule } from './chat/chat.module';
import { RequestAddFriendModule } from './request_add_friend/request_add_friend.module';
import { FriendsModule } from './friends/friends.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    EventsModule,
    ChatModule,
    RequestAddFriendModule,

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
    FriendsModule,


    // End Connect Database MongoDB

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
