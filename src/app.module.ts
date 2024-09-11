import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [UsersModule, AuthModule, WalletModule],
  providers: []
})
export class AppModule { }
