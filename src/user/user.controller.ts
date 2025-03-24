import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JWTGuard } from 'src/auth/guards/jwt.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JWTGuard)
  @Get(':id')
  getProfile(@Param('id') id: string) {
    return this.userService.getProfile(id);
  }



  @UseGuards(JWTGuard)
  @Get('')
  getAll(@Request() req) {
    return this.userService.getAllUser(req);
  }

}
