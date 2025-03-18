import { IsEmail, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsOptional()
    phone?: string;
    @IsOptional()
    address?: string;
    @IsOptional()
    image?: string;
}
