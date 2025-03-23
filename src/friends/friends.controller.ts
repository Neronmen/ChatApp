import { Controller, Get, Post, Body, Patch, Delete, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { JWTGuard } from 'src/auth/guards/jwt.guard';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) { }

  @UseGuards(JWTGuard)
  @Get('')
  findAllUserID(@Request() req) {
    const { status } = req.query;
    if (status && !['block', 'favorite'].includes(status)) {
      throw new BadRequestException('Status không hợp lệ ( block hoặc favorite ) ');
    }
    return this.friendsService.findAllByUserID(req,status);
  }

}
