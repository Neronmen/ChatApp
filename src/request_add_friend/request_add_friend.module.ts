import { Module } from '@nestjs/common';
import { RequestAddFriendService } from './request_add_friend.service';
import { RequestAddFriendController } from './request_add_friend.controller';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestAddFriend, RequestAddFriendSchema } from './schema/request_add_friend.schema';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RequestAddFriend.name, schema: RequestAddFriendSchema }]),
    UserModule
  ],
  controllers: [RequestAddFriendController],
  providers: [RequestAddFriendService, JwtService],
  exports: [RequestAddFriendService]
})
export class RequestAddFriendModule { }
