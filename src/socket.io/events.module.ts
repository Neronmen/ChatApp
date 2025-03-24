import { Module } from "@nestjs/common";
import { EventsGateWay } from "./events.gateway";
import { ChatModule } from "src/chat/chat.module";
import { JwtService } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";
import { RequestAddFriendModule } from "src/request_add_friend/request_add_friend.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Conversations, ConversationsSchema } from "src/conversations/schema/conversation.schema";
import { ConversationsModule } from "src/conversations/conversations.module";
import { ConversationsService } from "src/conversations/conversations.service";

@Module({
    imports: [
        ChatModule,
        UserModule,
        ConversationsModule,
        RequestAddFriendModule,
        MongooseModule.forFeature([{ name: Conversations.name, schema: ConversationsSchema }]),
    ],
    providers: [EventsGateWay, JwtService,ConversationsService]
})
export class EventsModule { }
