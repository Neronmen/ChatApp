import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversations } from './schema/conversation.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversations.name)
    private readonly conversationsModel: Model<Conversations>,
    private readonly userService: UserService
  ) { }


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

}
