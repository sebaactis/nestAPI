import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: Record<string, any>) {
        try {
            const login = await this.authService.signIn(signInDto.username, signInDto.password);
            return login;
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}

