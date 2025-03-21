import { IsMongoId, IsNotEmpty } from "class-validator";

export class CreateRequestAddFriendDto {
    @IsMongoId() 
    @IsNotEmpty()
    senderID: string;
    @IsMongoId() 
    @IsNotEmpty()
    receiverID: string;
}
