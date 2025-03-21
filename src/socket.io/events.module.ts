import { Module } from "@nestjs/common";
import { EventsGateWay } from "./events.gateway";
import { ChatModule } from "src/chat/chat.module";
import { JwtService } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";

@Module({
    imports: [
        ChatModule,
        UserModule
    ],
    providers: [EventsGateWay, JwtService]
})
export class EventsModule { }
