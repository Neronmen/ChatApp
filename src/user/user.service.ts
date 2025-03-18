import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.entity';
import { Model } from 'mongoose';
import { hashPasswordHelper } from 'src/helpers/jwtHelper';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

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
      image
    })
    return user;
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


}
