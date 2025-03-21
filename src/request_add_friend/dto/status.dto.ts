import { Transform } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";

export enum FriendRequestStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
}

export class FriendRequestQueryDto {
    @IsEnum(FriendRequestStatus, { message: 'Status must be pending, accepted, or rejected' })
    @Transform(({ value }) => value.toLowerCase()) 
    @IsOptional()
    status?: FriendRequestStatus;
}