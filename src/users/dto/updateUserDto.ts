import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class updateUserDto {

    @IsNotEmpty()
    @IsString()
    @Length(6, 15)
    username: string;
}