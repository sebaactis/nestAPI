import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TransferService } from 'src/transfer/transfer.service';
import { TransactionService } from 'src/transaction/transaction.service';

@Module({
    providers: [WalletService, PrismaService, TransferService, TransactionService],
    controllers: [WalletController],
    exports: [WalletService]
})
export class WalletModule { }