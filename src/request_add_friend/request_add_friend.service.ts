import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRequestAddFriendDto } from './dto/create-request_add_friend.dto';
import { isValidObjectId, Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { RequestAddFriend } from './schema/request_add_friend.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FriendRequestQueryDto } from './dto/status.dto';

@Injectable()
export class RequestAddFriendService {
  constructor(
    private readonly userService: UserService,
    @InjectModel(RequestAddFriend.name)
    private readonly requestModel: Model<RequestAddFriend>,
  ) { }


  async requestAddFriend(dataRequest: CreateRequestAddFriendDto) {
    const { senderID, receiverID } = dataRequest
    const checkFormatIdMongoDBSender = isValidObjectId(senderID)
    const checkFormatIdMongoDBReceiver = isValidObjectId(receiverID)
    if (!checkFormatIdMongoDBReceiver || !checkFormatIdMongoDBSender) {
      throw new BadRequestException(`ID không đúng định dạng mongoDB`)
    }
    const userSender = await this.userService.findById(senderID);
    const userReceiver = await this.userService.findById(receiverID);
    if (!userSender || !userReceiver) {
      throw new BadRequestException(`User không tồn tại trong hệ thống`)
    }
    const isExist = await this.requestModel.find({
      where: {
        sender_id: senderID,
        receiver_id: receiverID
      }
    })
    if (isExist) {
      throw new BadRequestException(`Đã gửi lời mời kết bạn`)
    }
    const request = await this.requestModel.create({
      sender_id: senderID,
      receiver_id: receiverID
    })
    return request
  }

  async getRequestsById(id: string, status: FriendRequestQueryDto) {
    console.log(id, status)
    const checkFormatIdMongoDB = isValidObjectId(id);
    if (!checkFormatIdMongoDB) {
      throw new BadRequestException(`ID không đúng định dạng mongoDB`)
    }
    const user = await this.userService.findById(id);
    if (!user) {
      throw new BadRequestException(`User không tồn tại trong hệ thống`)
    }
    let condition: { sender_id: string, status?: FriendRequestQueryDto } = {
      sender_id: id
    }
    if (status != undefined) {
      condition.status = status
    }
    console.log(condition)
    const listRequests = await this.requestModel.find(condition)

    return listRequests
  }




}
