import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@Injectable()
export class ConversationsService {
  create(createConversationDto: CreateConversationDto) {
    return 'This action adds a new conversation';
  }

}
