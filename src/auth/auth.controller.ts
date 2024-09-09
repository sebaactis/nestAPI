import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';


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

    @Get('/google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) { }

    @Get('/google/callback')
    @UseGuards(AuthGuard('google'))
    googleAuthRedirect(@Req() req) {
        return { user: req.user };
    }
}

