import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';
import { TransferModule } from './transfer/transfer.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [UsersModule, AuthModule, WalletModule, TransferModule, TransactionModule],
  providers: []
})
export class AppModule { }
