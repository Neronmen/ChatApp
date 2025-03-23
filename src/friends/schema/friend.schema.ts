import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type FriendsDocument = HydratedDocument<Friends>;

@Schema({ timestamps: true })
export class Friends {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    friend_ID: Types.ObjectId;

    @Prop({ type: Boolean, default: false })
    is_favorite: Boolean;

    @Prop({ type: Boolean, default: false })
    is_blocked: Boolean;

}

export const FriendsSchema = SchemaFactory.createForClass(Friends);
