import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { UsersService } from 'src/users/users.service';
import { validatePassword } from 'src/utils/password';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async registerByOAuth(user: any) {
        const userExists = await this.usersService.findOne(user.email)

        if (userExists) {
            return { email: userExists.email, accessToken: await this.jwtService.signAsync({ id: userExists.id, email: userExists.email }), status: 200 }
        }

        const newUser = {
            email: user.email,
            username: user.username,
            password: randomUUID(),
            userTypeId: 1,
        }

        const userCreate = await this.usersService.create(newUser)

        return {
            message: "User registered succesfully",
            accessToken: await this.jwtService.signAsync({ id: userCreate.newUser.id, email: userCreate.newUser.email }),
            status: 201
        };
    }

    async signIn(email: string, pass: string): Promise<{
        user: string,
        access_token: string,
        status: string
    }> {

        const user = await this.usersService.findOne(email);
        const passwordValidation = await validatePassword(user.password, pass);

        console.log(passwordValidation)

        if (!passwordValidation) {
            throw new UnauthorizedException();
        }

        const payload = { id: user.id, email: user.email }

        return {
            user: user.username,
            access_token: await this.jwtService.signAsync(payload),
            status: "Login success"
        }
    }

}
