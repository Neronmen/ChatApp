import { UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Request } from "express";
import { Model } from "mongoose";

import { Socket, Server } from "socket.io"
import { ChatGuard } from "src/auth/guards/chat.guard";
import { JWTGuard } from "src/auth/guards/jwt.guard";
import { ChatService } from "src/chat/chat.service";
import { CreateChatDto } from "src/chat/dto/create-chat.dto";
import { Conversations } from "src/conversations/schema/conversation.schema";
import { uploadToCloudinary } from "src/helpers/uploadToCloundinary";
import { CreateRequestAddFriendDto } from "src/request_add_friend/dto/create-request_add_friend.dto";
import { RequestAddFriendService } from "src/request_add_friend/request_add_friend.service";
import { User } from "src/user/schema/user.entity";
import { UserService } from "src/user/user.service";




@WebSocketGateway(3002, { cors: true })
export class EventsGateWay implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server
    private usersInRoom: any[] = [];
    private usersIdSocket = new Map<string, string[]>();
    constructor(
        private readonly chatService: ChatService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly requestAddFriendService: RequestAddFriendService,
        @InjectModel(Conversations.name)
        private readonly conversationsModel: Model<Conversations>,
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

        // Lưu socketId vào danh sách
        const sockets = this.usersIdSocket.get(user._id.toString()) || [];
        sockets.push(client.id);
        this.usersIdSocket.set(user._id.toString(), sockets);

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

        // Xóa socketId của user
        const userId = user._id.toString();
        const sockets = this.usersIdSocket.get(userId) || [];
        const newSockets = sockets.filter(socketId => socketId !== client.id);
        if (newSockets.length > 0) {
            this.usersIdSocket.set(userId, newSockets);
        } else {
            this.usersIdSocket.delete(userId);
            this.usersInRoom = this.usersInRoom.filter((u) => u._id != userId);
        }


        this.usersInRoom = this.usersInRoom.filter((u) => u._id != user._id.toString());
        client.broadcast.emit('user-left', user)
    }



    // Gửi tin nhắn 
    @SubscribeMessage('newMessage')
    async handleNewMessage(client: Socket, messages, request: Request): Promise<any> {
        const objectMessage = JSON.parse(messages)

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
        await this.conversationsModel.findOneAndUpdate(
            { _id: '67def3b97c3a95ec48d1657f' },
            {
                $set: {
                    last_message: objectMessage.content,
                    last_interacted_at: new Date()
                }
            }
        );
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



    // Gửi lời mời kết bạn
    @SubscribeMessage('requestAddFriend')
    async handleRequestAddFriend(client: Socket, dataRequest: CreateRequestAddFriendDto) {
        try {
            const parsedData = typeof dataRequest === "string" ? JSON.parse(dataRequest) : dataRequest;
            const token = client.handshake.headers?.token as string;
            if (!token || token === undefined) {
                console.log("Không có token, từ chối kết nối.");
                client.disconnect()
                return;
            }
            const { senderID, receiverID } = parsedData
            const result = await this.requestAddFriendService.requestAddFriend(parsedData);
            const receiverSockets = this.usersIdSocket.get(receiverID);
            const userSender = await this.userService.findById(senderID);
            if (userSender) {
                const { image, name, _id } = userSender
                const resultTotal = {
                    id_req: result._id.toString(),
                    sender: {
                        _id,
                        image,
                        name
                    },
                    message: `${userSender?.name} đã gửi lời mới kết bạn`,
                    status: 200
                }
                if (receiverSockets) {
                    this.server.to(receiverSockets).emit('receiveRequest', resultTotal);
                }
            }
        } catch (error) {
            console.error("Lỗi khi gửi lời mời kết bạn:", error.message);
            client.emit('error', {
                message: error.message || 'Có lỗi xảy ra, vui lòng thử lại!',
                code: error.status || 500, // Nếu error có mã lỗi (ví dụ: 400), sử dụng nó, mặc định 500
            });
        }



    }
}