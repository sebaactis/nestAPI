import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Post, Request, UseGuards, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './dto/createUserDto';

@Controller('user')
export class UserController {
    constructor(private readonly usersService: UsersService) { }

    @Get('users')
    async getAll() {
        try {
            return await this.usersService.findAll();
        }
        catch {
            throw new HttpException('Error while fetching users', HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }

    @Get('users/:username')
    async getOne(@Param('username') username: string) {

        try {
            const user = await this.usersService.findOne(username);

            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND)
            }

            return {
                email: user.email,
                username: user.username
            }
        } catch (error) {

            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException('Error while fetching user', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Post('users')

    create(@Body() createUserDto: createUserDto) {
        return this.usersService.create(createUserDto);
    }
}
