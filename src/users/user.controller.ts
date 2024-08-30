import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Request, UseGuards, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './dto/createUserDto';

@Controller('user')
export class UserController {
    constructor(private readonly usersService: UsersService) { }

    @Get('users')
    async getAll() {
        return await this.usersService.findAll();
    }

    @Get('users/:username')
    async getOne(@Param('username') username: string) {
        const user = await this.usersService.findOne(username);

        return {
            email: user.email,
            username: user.username
        }
    }

    @Post('users')
    
    create(@Body() createUserDto: createUserDto) {
        return this.usersService.create(createUserDto);
    }
}
