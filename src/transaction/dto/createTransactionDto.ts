import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTransactionDto {
    @IsNumber()
    @IsNotEmpty()
    walletId: number;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    currencyId: number;

}