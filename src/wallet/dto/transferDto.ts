import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class TransferDto {
    @IsEmail()
    @IsNotEmpty()
    toEmail: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;
}