import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './dto/createUserDto';
import { UserResponse } from 'src/utils/types';
import { updateUserDto } from './dto/updateUserDto';
import { ChangePasswordDto } from './dto/changePasswordDto';
import { RecoveryPasswordDto } from './dto/recoveryPasswordDto';
import { AuthJwtGuard } from 'src/auth/guards/authJwt.guard';

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

    @Get('/:email')
    async getOne(@Param('email') email: string) {

        try {
            const user = await this.usersService.findOne(email);

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

            const userCreate = await this.usersService.create(createUserDto);

            return { ...userCreate, password: undefined };

        } catch (error) {

            if (!(error instanceof HttpException)) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
            }
            throw new HttpException('Error while creating user', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @UseGuards(AuthJwtGuard)
    @HttpCode(200)
    @Put()
    async update(@Req() req, @Body() updateUserDto: updateUserDto) {

        try {
            const email = req.user.email;
            const updateUser = await this.usersService.update(email, updateUserDto);

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

    @UseGuards(AuthJwtGuard)
    @Delete('/:email')
    async delete(@Req() req) {
        try {
            const email = req.user.email;
            const deleteUser = await this.usersService.delete(email);

            if (!deleteUser) {
                throw new Error('We cant delete the user, please check your information and try again');
            }

            return {
                message: `The user ${email} has been deleted`,
                status: HttpStatus.OK
            }

        } catch (error) {
            if (!(error instanceof HttpException)) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
            }
            throw new HttpException('Error while creating user', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @UseGuards(AuthJwtGuard)
    @HttpCode(200)
    @Post("/changePassword")
    async changePassword(@Req() req, @Body() changePasswordDto: ChangePasswordDto) {
        try {
            const email = req.user.email;
            const changePassword = await this.usersService.changePassword(email, changePasswordDto);

            if (!changePassword) {
                throw new Error('We cant update the password user, please check your information and try again');
            }

            return {
                message: "The user password has been changed",
                status: HttpStatus.OK
            }
        } catch (error) {
            if (!(error instanceof HttpException)) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
            }
            throw new HttpException(error.message, error.getStatus())
        }
    }

    @HttpCode(200)
    @Post("/forgetPassword")
    async forgetPassword(@Body() body) {

        const { email } = body;

        try {
            const forgetPassword = await this.usersService.forgetPassword(email);

            return {
                forgetPassword: { ...forgetPassword, password: undefined },
                status: HttpStatus.OK
            };

        } catch (error) {
            if (!(error instanceof HttpException)) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
            }
            throw new HttpException(error.message, error.getStatus())
        }
    }

    @HttpCode(200)
    @Post("/recoveryPassword")
    async recoveryPassword(@Body() recoveryPasswordDto: RecoveryPasswordDto) {
        try {
            const recovery = await this.usersService.recoveryPassword(recoveryPasswordDto);

            if (!recovery) {
                throw new Error('We cant recovery the password user, please check your information and try again');
            }

            return {
                message: "The password has been reset successfully",
                status: HttpStatus.OK
            };
        } catch (error) {
            if (!(error instanceof HttpException)) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
            }
            throw new HttpException(error.message, error.getStatus())
        }
    }

}
