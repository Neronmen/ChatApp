import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversations } from './schema/conversation.schema';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/schema/user.entity';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversations.name)
    private readonly conversationsModel: Model<Conversations>,

    private readonly userService: UserService
  ) { }

  // Tạo nhóm chat hoặc chat 1-1 
  async create(data) {
    try {
      const { image, name, isGroup, participants, createdBy } = data;
      const userData = await this.userService.findById(createdBy);
      // Xử lý khi là group 
      if (isGroup && name) {
        const isExist = await this.conversationsModel.findOne({
          name,
          participants: { $in: [userData?._id.toString()] },
          createdBy: userData?._id.toString()
        })
        if (isExist) {
          throw new BadRequestException(`Tên đã tồn tại.Vui lòng chọn tên khác`)
        }
        const conservation = await this.conversationsModel.create({
          image: image,
          name,
          isGroup: true,
          participants,
          createdBy: userData?._id.toString()
        })
        return conservation
      }

      // Xử lý khi là chat 1 - 1
      // else {

      // }
    } catch (error) {
      console.log(error)
      throw new BadRequestException(error)
    }


  }


  // Lấy tất cả nhóm chat hoặc chat 1-1 của 1 user nào đó 
  async getAllByUserID(req) {
    try {
      const user = await this.userService.findByEmail(req.username);
      const userID = user?._id.toString();
      const listConversation = await this.conversationsModel.find({
        $or: [
          { participants: { $in: [userID] } },
          { createdBy: userID }
        ]
      })
      const result = await Promise.all(
        listConversation.map(async (chat) => {
          const user: any = await this.userService.findById(chat.last_user_send.toString());
          return {
            ...chat.toObject(), 
            name_user_send: user?.name || "Unknown", 
          };
        }) 
      );
      return result
    } catch (error) {
      console.log(error)
      throw new BadRequestException(error)
    }


  }

}
