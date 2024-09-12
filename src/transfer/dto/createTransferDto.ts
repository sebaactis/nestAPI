import { IsNotEmpty, IsNumber } from "class-validator"

export class CreateTransferDto {
    @IsNumber()
    @IsNotEmpty()
    fromWalletId: number;
    
    @IsNumber()
    @IsNotEmpty()
    toWalletId: number;
    
    @IsNumber()
    @IsNotEmpty()
    currencyId: number;
    
    @IsNumber()
    @IsNotEmpty()
    amount: number;
}