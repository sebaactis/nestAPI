import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { validatePassword } from 'src/utils/password';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async signIn(username: string, pass: string): Promise<{
        user: string,
        access_token: string,
        status: string
    }> {
        const user = await this.usersService.findOne(username);
        const passwordValidation = await validatePassword(user.password, pass);

        if (!passwordValidation) {
            throw new UnauthorizedException();
        }

        const payload = { id: user.id, username: user.username }

        return {
            user: user.username,
            access_token: await this.jwtService.signAsync(payload),
            status: "Login success"
        }
    }
}
