import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { JWTGuard } from 'src/auth/guards/jwt.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  
  @UseGuards(JWTGuard)
  @Post('')
  async create(@Body() message: CreateChatDto) {
    return this.chatService.createChat(message)
  }

  @UseGuards(JWTGuard)
  @Get('')
  async getAll() {
    return this.chatService.getAllChat()
  }

}
