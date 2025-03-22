import { Module } from "@nestjs/common";
import { EventsGateWay } from "./events.gateway";
import { ChatModule } from "src/chat/chat.module";
import { JwtService } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";
import { RequestAddFriendModule } from "src/request_add_friend/request_add_friend.module";

@Module({
    imports: [
        ChatModule,
        UserModule,
        RequestAddFriendModule
    ],
    providers: [EventsGateWay, JwtService]
})
export class EventsModule { }
