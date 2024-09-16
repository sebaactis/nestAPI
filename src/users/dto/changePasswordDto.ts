import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class ChangePasswordDto {

    @IsNotEmpty()
    @IsString()
    @Length(5, 20)
    password: string;

    @IsNotEmpty()
    @IsString()
    @Length(5, 20)
    newPassword: string;

    @IsNotEmpty()
    @IsString()
    @Length(5, 20)
    confirmNewPassword: string;
}