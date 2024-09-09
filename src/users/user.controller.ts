import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './dto/createUserDto';
import { createHash } from 'src/utils/password';
import { UserResponse } from 'src/utils/types';
import { updateUserDto } from './dto/updateUserDto';
import { ChangePasswordDto } from './dto/changePasswordDto';
import { RecoveryPasswordDto } from './dto/recoveryPasswordDto';

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

            return { ...user, password: undefined };
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

    @Put()
    async update(@Body() updateUserDto: updateUserDto) {

        try {
            const updateUser = await this.usersService.update(updateUserDto);

            if (!updateUser) {
                throw new Error('We cant update the user, please check your information and try again');
            }

            return {
                message: `The username with email: ${updateUser.email} has been updated successfully. Your new username is ${updateUser.username}`,
                status: HttpStatus.OK
            }

        } catch (error) {
            if (!(error instanceof HttpException)) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
            }
            throw new HttpException('Error while creating user', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    @Delete('/:email')
    async delete(@Param('email') email: string) {
        try {
            const deleteUser = await this.usersService.delete(email);

            return deleteUser;

        } catch (error) {
            if (!(error instanceof HttpException)) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
            }
            throw new HttpException('Error while creating user', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Post("/changePassword")
    async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
        try {
            const changePassword = await this.usersService.changePassword(changePasswordDto);

            return changePassword;
        } catch (error) {
            if (!(error instanceof HttpException)) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
            }
            throw new HttpException(error.message, error.getStatus())
        }
    }

    @Post("/forgetPassword")
    async forgetPassword(@Body() body) {

        const { email } = body;

        try {
            const forgetPassword = await this.usersService.forgetPassword(email);

            return forgetPassword;
        } catch (error) {
            if (!(error instanceof HttpException)) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
            }
            throw new HttpException(error.message, error.getStatus())
        }
    }

    @Post("/recoveryPassword")
    async recoveryPassword(@Body() recoveryPasswordDto: RecoveryPasswordDto) {
        try {
            const recovery = await this.usersService.recoveryPassword(recoveryPasswordDto);
            
            return recovery;
        } catch (error) {
            if (!(error instanceof HttpException)) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
            }
            throw new HttpException(error.message, error.getStatus())
        }
    }
}
