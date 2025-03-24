import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { JWTGuard } from 'src/auth/guards/jwt.guard';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) { }

  @UseGuards(JWTGuard)
  @Post('')
  create(@Body() data: CreateConversationDto) {
    return this.conversationsService.create(data);
  }

  @UseGuards(JWTGuard)
  @Get('')
  getAll(@Request() req) {
    return this.conversationsService.getAllByUserID(req.user);
  }

}
