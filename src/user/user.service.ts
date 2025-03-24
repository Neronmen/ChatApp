import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.entity';
import { Model } from 'mongoose';
import { hashPasswordHelper } from 'src/helpers/jwtHelper';
import { isValidObjectId } from 'mongoose';
import { FriendsService } from 'src/friends/friends.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @Inject(forwardRef(() => FriendsService))
    private readonly friendsService: FriendsService

  ) { }

  async create(createUserDto: CreateUserDto) {
    let { name, email, password, phone, address, image } = createUserDto;
    const emailExisted = await this.checkEmailExisted(email);
    if (emailExisted) {
      throw new BadRequestException(`Email ${email} đã tồn tại. Vui lòng nhập email khác`)
    }
    const hashPassword = await hashPasswordHelper(password)
    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      phone,
      address,
      image: "/avatar.jpg"
    })
    const result = await this.userModel.findById(user._id).select("-password")
    return result;
  }

  async getProfile(id: string) {
    const checkFormatIdMongoDB = isValidObjectId(id)
    if (!checkFormatIdMongoDB) {
      throw new BadRequestException(`ID không đúng định dạng MongoDB`);
    }
    const user = await this.userModel.findById(id).lean();
    if (!user) {
      throw new BadRequestException(`Người dùng ID: ${id} không tồn tại`)
    }
    const { password, ...result } = user;
    return result
  }

  async getAllUser(req) {
    const listUsers = await this.userModel.find({
      isActive: true
    })
    const user = await this.userModel.find({
      email: req.username
    }).lean();
    const listFriendOfUser = await this.friendsService.findAllByUserID(req, "");
    const suggestedFriends = listUsers.filter(
      user => !listFriendOfUser.some(friend => friend.id === user.id)
    );
    return suggestedFriends
  }

  checkEmailExisted = async (email: string) => {
    const user = await this.userModel.findOne({ email });
    if (user) return true;
    return false
  }

  findByEmail = async (email: string) => {
    const user = await this.userModel.findOne({ email }).lean();
    if (!user) return null;
    return user
  }


  findById = async (id: string) => {
    const user = await this.userModel.findById(id).lean();
    if (!user) return null;
    const { password, ...result } = user
    return result
  }


}
