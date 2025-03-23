import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRequestAddFriendDto } from './dto/create-request_add_friend.dto';
import { isValidObjectId, Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { RequestAddFriend } from './schema/request_add_friend.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FriendRequestQueryDto } from './dto/status.dto';
import { Request } from 'express';
import { FriendsService } from 'src/friends/friends.service';

@Injectable()
export class RequestAddFriendService {
  constructor(
    private readonly userService: UserService,
    private readonly friendService: FriendsService,
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
      sender_id: senderID,
      receiver_id: receiverID
    })
    if (isExist.length > 0) {
      throw new BadRequestException(`Đã gửi lời mời kết bạn`)
    }
    const request = await this.requestModel.create({
      sender_id: senderID,
      receiver_id: receiverID
    })
    return request
  }

  async getRequestsById(id: string, status: FriendRequestQueryDto) {
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
    const listRequests = await this.requestModel.find(condition)

    return listRequests
  }


  async isReadRequest(id: string, req) {
    const checkFormatIdMongoDB = isValidObjectId(id);
    if (!checkFormatIdMongoDB) {
      throw new BadRequestException(`ID không đúng định dạng mongoDB`)
    }
    const user = await this.userService.findByEmail(req.user.username);

    if (user) {
      const request = await this.requestModel.find({ _id: id, receiver_id: user._id.toString() });
      if (request.length === 0) {
        throw new BadRequestException(`Không tìm thấy lời mời kết bạn này`)
      }
      const result = await this.requestModel.updateOne({ _id: id }, {
        isRead: true
      })
      if (!result) {
        throw new BadRequestException(`Update không thành công`)
      }
      return result
    }
  }



  async acceptRequest(id: string, req) {
    try {
      const checkFormatIdMongoDB = isValidObjectId(id);
      if (!checkFormatIdMongoDB) {
        throw new BadRequestException(`ID không đúng định dạng mongoDB`)
      }
      const user = await this.userService.findByEmail(req.user.username);
      const request: any = await this.requestModel.findOne({
        _id: id,
        receiver_id: user?._id.toString()
      }).lean()
      if (!request) {
        throw new BadRequestException('Không tìm thấy lời mời kết bạn này')
      }
      await this.requestModel.updateOne({
        _id: id
      }, {
        status: 'accepted'
      })

      await this.friendService.createFriend({
        userID: request.sender_id,
        friendID: request.receiver_id
      })
      return {
        status: 200,
        message: 'Kết bạn thành công',
      }
    } catch (error) {
      console.log(error)
      throw new BadRequestException(error)
    }
  }


  async rejectRequest(id: string, req) {
    try {
      const checkFormatIdMongoDB = isValidObjectId(id);
      if (!checkFormatIdMongoDB) {
        throw new BadRequestException(`ID không đúng định dạng mongoDB`)
      }
      const user = await this.userService.findByEmail(req.user.username);
      const request: any = await this.requestModel.findOne({
        _id: id,
        receiver_id: user?._id.toString()
      }).lean()
      if (!request) {
        throw new BadRequestException('Không tìm thấy lời mời kết bạn này')
      }
      await this.requestModel.updateOne({
        _id: id
      }, {
        status: 'rejected'
      })
      return {
        status: 200,
        message: 'Từ chối kết bạn thành công',
      }
    } catch (error) {
      console.log(error)
      throw new BadRequestException(error)
    }
  }

}
