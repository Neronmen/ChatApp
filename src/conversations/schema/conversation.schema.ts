import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ConversationsDocument = HydratedDocument<Conversations>;

@Schema()
export class Conversations {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String })
    image: string;

    @Prop({ type: Boolean, default: false })
    isGroup: boolean;

    @Prop({ type: [Types.ObjectId], ref: 'User', required: true })
    participants: Types.ObjectId[];

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    createdBy: Types.ObjectId

    @Prop({ type: String, default: null })
    last_message: string;

    @Prop({ type: Date, default: null })
    last_interacted_at: Date;
}

export const ConversationsSchema = SchemaFactory.createForClass(Conversations);
