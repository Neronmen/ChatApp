import { IsMongoId, IsNotEmpty } from "class-validator";

export class CreateFriendDto {
    @IsMongoId()
    @IsNotEmpty()
    userID: string;
    @IsMongoId()
    @IsNotEmpty()
    friendID: string;

}
