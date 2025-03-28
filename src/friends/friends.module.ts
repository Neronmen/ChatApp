import { forwardRef, Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Friends, FriendsSchema } from './schema/friend.schema';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { FriendsService } from './friends.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Friends.name, schema: FriendsSchema }]),
    forwardRef(() => UserModule)
  ],
  controllers: [FriendsController],
  providers: [FriendsService, JwtService],
  exports: [FriendsService]
})
export class FriendsModule { }
