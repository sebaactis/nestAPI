import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstats } from './constants';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstats.secret,
      signOptions: { expiresIn: '2m'}
    })
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
