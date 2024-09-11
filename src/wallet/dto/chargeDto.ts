import { IsEmail, IsNotEmpty, IsNumber, Min } from "class-validator";

export class ChargeDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    amount: number;
}