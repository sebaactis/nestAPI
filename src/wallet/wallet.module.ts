import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { WalletService } from './wallet.service';



@Module({
    providers: [WalletService, PrismaService],
    controllers: [],
    exports: [WalletService]
})
export class WalletModule { }