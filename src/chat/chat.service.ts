import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './schema/chat.schema';
import { isValidObjectId, Model } from 'mongoose';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Chat.name)
        private readonly chatModel: Model<Chat>,
        private readonly userService: UserService
    ) { }
    async createChat(message: CreateChatDto) {
        const { userID, content, images } = message
        const checkFormatIdMongoDB = isValidObjectId(userID)
        if (!checkFormatIdMongoDB) {
            throw new BadRequestException(`UserID không đúng định dạng mongoDB`)
        }
        const user = await this.userService.findById(userID);
        if (!user) {
            throw new BadRequestException(`User không tồn tại`)
        }
        const newChat = await this.chatModel.create(message);
        return newChat
    }

    async getAllChat() {
        const allChats = await this.chatModel.find().lean();
        const result = await Promise.all(allChats.map(async (chat) => {
            const user = await this.userService.findById(chat.userID.toString());
            const { image, ...result } = user || {};
            return {
                ...chat,
                image,
            };
        }));

        return result
    }
}
