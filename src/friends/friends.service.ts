import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Friends } from './schema/friend.schema';
import { isValidObjectId, Model, Types } from 'mongoose';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(Friends.name)
    private readonly friendsModel: Model<Friends>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) { }

  async findAllByUserID(req, status) {
    const filterQuery: any = {}
    if (status === "block") {
      filterQuery.is_blocked = true
    } else if (status === "favorite") {
      filterQuery.is_favorite = true
    }
    const user: any = await this.userService.findByEmail(req.user.username);
    const listFriends = await this.friendsModel.find({
      $and: [
        {
          $or: [
            { user_id: user._id.toString() },
            { friend_ID: user._id.toString() }
          ]
        },
        filterQuery 
      ]
    }).exec();
    return listFriends;
  }


  async createFriend(data: CreateFriendDto) {
    const { userID, friendID } = data;
    await this.friendsModel.create({
      user_id: userID,
      friend_ID: friendID
    })
  }

}
