import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class RecoveryPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    recoveryToken: string;

    @IsNotEmpty()
    @IsString()
    @Length(5, 20)
    newPassword: string;

    @IsNotEmpty()
    @IsString()
    @Length(5, 20)
    confirmNewPassword: string;
}