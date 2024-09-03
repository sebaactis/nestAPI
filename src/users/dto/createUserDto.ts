import { IsAlphanumeric, IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class createUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(6, 15)
    username: string;

    @IsNotEmpty()
    @IsString()
    @Length(5, 20)
    password: string;
}