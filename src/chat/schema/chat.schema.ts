import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
    @Prop()
    userID: string;

    @Prop()
    content: string;

    @Prop()
    Images: string

    @Prop({ default: Date.now })
    createdAt: Date
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
