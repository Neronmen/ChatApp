import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Conversations, ConversationsSchema } from './schema/conversation.schema';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { User, UserSchema } from 'src/user/schema/user.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Conversations.name, schema: ConversationsSchema }]),
    UserModule
  ],
  controllers: [ConversationsController],
  providers: [ConversationsService, JwtService],
})
export class ConversationsModule { }
