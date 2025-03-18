import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.entity';
import { Model } from 'mongoose';
const bcrypt = require('bcrypt');

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

    const hashPassword = await this.hashPasswordHelper(password)
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


  checkEmailExisted = async (email: string) => {
    const user = await this.userModel.findOne({ email });
    if (user) return true;
    return false
  }

  findByEmail = async (email: string) => {
    const user = await this.userModel.findOne({ email }).lean();
    // console.log(user)
    if (!user) return null;
    return user
  }

  hashPasswordHelper = async (plainPassword: string) => {
    try {
      return await bcrypt.hash(plainPassword, 10)
    } catch (error) {
      return error
    }
  }

  comparePasswordHelper = async (plainPassword: string, hashPassword: string) => {
    try {
      return await bcrypt.compare(plainPassword, hashPassword);
    } catch (error) {
      return error
    }
  };


}
