import { UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Request } from "express";

import { Socket, Server } from "socket.io"
import { ChatGuard } from "src/auth/guards/chat.guard";
import { JWTGuard } from "src/auth/guards/jwt.guard";
import { ChatService } from "src/chat/chat.service";
import { CreateChatDto } from "src/chat/dto/create-chat.dto";
import { uploadToCloudinary } from "src/helpers/uploadToCloundinary";
import { User } from "src/user/schema/user.entity";
import { UserService } from "src/user/user.service";


import * as fs from "fs";

// Đường dẫn ảnh (Sử dụng / hoặc \\)
const imagePath = "C:/Users/pnkvl/Pictures/neronmen.jpg";

// Đọc ảnh thành Buffer
const imageBuffer = fs.readFileSync(imagePath);

@WebSocketGateway(3002, { cors: true })
export class EventsGateWay implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server
    private usersInRoom: any[] = [];
    constructor(
        private readonly chatService: ChatService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }


    async handleConnection(client: Socket) {
        const token = client.handshake.headers?.token as string;
        if (!token || token === undefined) {
            console.log("Không có token, từ chối kết nối.");
            client.disconnect()
            return;
        }
        const decoded: any = await this.jwtService.verifyAsync(token, { secret: process.env.SECRET_KEY });
        const user = await this.userService.findByEmail(decoded.username)
        if (!user) return
        const isExist = this.usersInRoom.some((u) => {
            return u._id == user._id.toString()
        });
        if (!isExist) {
            this.usersInRoom.push(user);
        }
        client.data.user = user;
        // client.emit("room-users", this.usersInRoom)
        this.server.emit('user-join', {
            ...user,
            usersInRoom: this.usersInRoom
        });
    }



    handleDisconnect(client: Socket) {
        const user = client.data.user;
        if (!user) return
        this.usersInRoom = this.usersInRoom.filter((u) => u._id != user._id.toString());
        client.broadcast.emit('user-left', user)
    }



    // Gửi tin nhắn 
    @SubscribeMessage('newMessage')
    async handleNewMessage(client: Socket, messages, request: Request): Promise<any> {
        const objectMessage = JSON.parse(messages)
        console.log(objectMessage)
        console.log(imageBuffer)
        const userID = client.data.user._id;
        let imagesUrl: any = [];
        if (objectMessage?.images) {
            for (const image of objectMessage.images) {
                const link = await uploadToCloudinary(image);
                imagesUrl.push(link)
            }
        }
        await this.chatService.createChat({
            userID,
            content: objectMessage.content,
            images: imagesUrl
        })
        const user = await this.userService.findById(userID);
        client.broadcast.emit('reply', {
            name: user?.name,
            avatar: user?.image,
            content: objectMessage?.content,
            images: objectMessage?.images,
            userID: user?._id,
            roleID: user?.role
        })
    }
    // End Gửi tin nhắn 
}