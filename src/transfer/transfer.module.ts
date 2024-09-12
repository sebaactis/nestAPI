import { Module } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [TransferService, PrismaService],
  exports: [TransferService]
})
export class TransferModule { }
