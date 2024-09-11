import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { UsersService } from 'src/users/users.service';

@Module({
    providers: [WalletService, PrismaService],
    controllers: [WalletController],
    exports: [WalletService]
})
export class WalletModule { }