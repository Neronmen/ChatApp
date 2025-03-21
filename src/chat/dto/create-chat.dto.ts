import { IsOptional, IsString } from "class-validator";

export class CreateChatDto {
    @IsString()
    userID: string;

    @IsString()
    content: string;

    @IsOptional()
    @IsString()
    images?: string

}
