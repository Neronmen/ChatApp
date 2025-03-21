import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { RequestAddFriendService } from './request_add_friend.service';
import { CreateRequestAddFriendDto } from './dto/create-request_add_friend.dto';
import { FriendRequestQueryDto } from './dto/status.dto';

enum FriendRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}


@Controller('request')
export class RequestAddFriendController {
  constructor(private readonly requestAddFriendService: RequestAddFriendService) { }

  @Post('')
  async request(@Body('') dataRequest: CreateRequestAddFriendDto) {
    return await this.requestAddFriendService.requestAddFriend(dataRequest)
  }


  @Get(':id')
  async getRequests(@Param('id') id: string, @Query('status') status: FriendRequestQueryDto) {

    return await this.requestAddFriendService.getRequestsById(id, status)
  }



  // @Put(':id')
  // async up(@Param('id') id: string, @Query('status') status: FriendRequestQueryDto) {

  //   return await this.requestAddFriendService.getRequestsById(id, status)
  // }



}
