import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service';
import { UserController } from './user.controller';
import { WalletService } from 'src/wallet/wallet.service';
import { AuthJwtGuard } from 'src/auth/guards/authJwt.guard';


@Module({
  providers: [UsersService, PrismaService, WalletService, AuthJwtGuard],
  controllers: [UserController],
  exports: [UsersService]
})
export class UsersModule { }
