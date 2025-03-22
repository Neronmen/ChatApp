import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RequestAddFriendDocument = HydratedDocument<Request>;

@Schema({ timestamps: true })
export class RequestAddFriend {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    sender_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    receiver_id: Types.ObjectId;

    @Prop({ type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' })
    status: string;

    @Prop({ type: Boolean, default: 'false' })
    isRead: boolean;
}

export const RequestAddFriendSchema = SchemaFactory.createForClass(RequestAddFriend);
