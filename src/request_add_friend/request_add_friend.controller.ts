import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseGuards, Request } from '@nestjs/common';
import { RequestAddFriendService } from './request_add_friend.service';
import { CreateRequestAddFriendDto } from './dto/create-request_add_friend.dto';
import { FriendRequestQueryDto } from './dto/status.dto';
import { JWTGuard } from 'src/auth/guards/jwt.guard';

enum FriendRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}


@Controller('request')
export class RequestAddFriendController {
  constructor(private readonly requestAddFriendService: RequestAddFriendService) { }

  @UseGuards(JWTGuard)
  @Post('')
  async request(@Body('') dataRequest: CreateRequestAddFriendDto) {
    return await this.requestAddFriendService.requestAddFriend(dataRequest)
  }

  @UseGuards(JWTGuard)
  @Get(':id')
  async getRequests(@Param('id') id: string, @Query('status') status: FriendRequestQueryDto) {

    return await this.requestAddFriendService.getRequestsById(id, status)
  }

  @UseGuards(JWTGuard)
  @Put(':id')
  async isRead(@Param('id') id: string, @Request() req) {
    return await this.requestAddFriendService.isReadRequest(id, req)
  }


  @UseGuards(JWTGuard)
  @Put('/accept/:id')
  async acceptRequest(@Param('id') id: string, @Request() req) {
    return await this.requestAddFriendService.acceptRequest(id, req)
  }


  @UseGuards(JWTGuard)
  @Put('/reject/:id')
  async rejectRequest(@Param('id') id: string, @Request() req) {
    return await this.requestAddFriendService.rejectRequest(id, req)
  }

}
