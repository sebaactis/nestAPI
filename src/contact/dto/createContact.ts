import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class Contact {
    @IsNumber()
    @IsNotEmpty()
    walletId: number;

    @IsString()
    @IsNotEmpty()
    userAlias: string;
}