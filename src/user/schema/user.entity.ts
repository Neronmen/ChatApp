import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop()
    password: string;
    @Prop({ default: false })
    isActive: boolean;

    @Prop({ default: 'USERS' })
    role: string;

    @Prop({ default: 'LOCAL' })
    accountType: string;

    @Prop()
    phone: string;

    @Prop()
    address: string;

    @Prop()
    image: string;
    @Prop()
    codeId: string;
    @Prop()
    codeExpire: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
