import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { WalletService } from 'src/wallet/wallet.service';
import { TransferService } from 'src/transfer/transfer.service';
import { TransactionService } from 'src/transaction/transaction.service';

@Module({
  controllers: [ContactController],
  providers: [ContactService, PrismaService, UsersService, WalletService, TransferService, TransactionService]
})
export class ContactModule {}
