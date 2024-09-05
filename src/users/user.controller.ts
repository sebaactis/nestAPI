import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './dto/createUserDto';
import { createHash } from 'src/utils/password';
import { UserResponse } from 'src/utils/types';

@Controller('users')
export class UserController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async getAll(): Promise<UserResponse[]> {
        try {
            return await this.usersService.findAll();
        }
        catch {
            throw new HttpException('Error while fetching users', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get('/:username')
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

    @Post()
    async create(@Body() createUserDto: createUserDto) {
        try {
            createUserDto.password = await createHash(createUserDto.password)
            const userCreate = await this.usersService.create(createUserDto);

            return userCreate;

        } catch (error) {

            if (!(error instanceof HttpException)) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
            }
            throw new HttpException('Error while creating user', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
