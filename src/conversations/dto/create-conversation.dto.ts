import { IsArray, IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateConversationDto {
    @IsOptional()
    @IsString()
    image?: string

    @IsOptional()
    @IsString()
    name?: string;

    @IsBoolean()
    isGroup: boolean;

    @IsArray()
    @IsNotEmpty({ message: "Participants array should not be empty" })
    participants: string[];




}