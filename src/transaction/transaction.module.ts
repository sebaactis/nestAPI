import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { PrismaService } from 'src/prisma.service';
import { TransactionController } from './transaction.controller';

@Module({
  providers: [TransactionService, PrismaService],
  exports: [TransactionService],
  controllers: [TransactionController]
})
export class TransactionModule { }
