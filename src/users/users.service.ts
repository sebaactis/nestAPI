import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { createUserDto } from './dto/createUserDto';
import { WalletService } from 'src/wallet/wallet.service';
import { UserResponse } from 'src/utils/types';
import { updateUserDto } from './dto/updateUserDto';
import { ChangePasswordDto } from './dto/changePasswordDto';
import { createHash, validatePassword } from 'src/utils/password';
@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService, private readonly walletService: WalletService) { }

    async findAll(): Promise<UserResponse[]> {
        const users = await this.prisma.user.findMany({

            include: {
                userType: true,
                wallet: true
            }
        })

        return users.map(user => ({
            email: user.email,
            username: user.username,
            userType: user.userType,
            wallet: user.wallet
        }))
    }

    async findOne(username: string): Promise<User | undefined> {

        const user = await this.prisma.user.findFirst({
            where: {
                username
            },
            include: {
                userType: true,
                wallet: true
            }
        });

        return user;
    }

    async create(user: createUserDto): Promise<User> {

        const emailCheck = await this.prisma.user.findFirst({
            where: {
                email: user.email
            }
        })

        if (emailCheck) {
            throw new Error(`The email: ${user.email}, already exists`)
        }

        const userCheck = await this.prisma.user.findFirst({
            where: {
                username: user.username
            }
        });

        if (userCheck) {
            throw new Error(`The username: ${user.username}, already exists`)
        }

        const walletId = await this.walletService.create();

        const newUser = await this.prisma.user.create({
            data: {
                email: user.email,
                username: user.username,
                password: user.password,
                userTypeId: +user.userTypeId,
                walletId,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        })

        return newUser;

    }

    async update(user: updateUserDto): Promise<User> | null {
        const userCheck = await this.prisma.user.findFirst({
            where: {
                email: user.email
            }
        })

        if (userCheck) {
            const update = await this.prisma.user.update({
                where: {
                    email: userCheck.email
                },
                data: {
                    username: user.username,
                    updatedAt: new Date()
                }
            })
            return update;
        }
    }

    async delete(email: string) {
        const userCheck = await this.prisma.user.findFirst({
            where: {
                email
            }
        })

        if (!userCheck) {
            throw new Error('User not found')
        }

        const checkWalletBalance = await this.walletService.getBalance(email);

        if (checkWalletBalance.balance !== 0) {
            throw new Error('You cant delete a user when the wallet has money inside. Please let the wallet in 0 and try again')
        }

        const deleteUser = await this.prisma.user.delete({
            where: {
                email
            }
        })

        return deleteUser;
    }

    async changePassword(changePasswordDto: ChangePasswordDto) {
        const user = await this.prisma.user.findFirst({
            where: {
                email: changePasswordDto.email
            }
        })

        if (!user) {
            throw new Error('User not found, please try with another user')
        }

        const checkPassword = await validatePassword(user.password, changePasswordDto.password);

        if (!checkPassword) {
            throw new UnauthorizedException();
        }

        if (changePasswordDto.newPassword !== changePasswordDto.confirmNewPassword) {
            throw new Error('The new password and the confirme new password do not match')
        }

        if (changePasswordDto.newPassword === changePasswordDto.password) {
            throw new Error('The new password is the same as the old password')
        }

        const newPassword = await createHash(changePasswordDto.newPassword)

        const change = await this.prisma.user.update({
            where: {
                email: changePasswordDto.email
            },
            data: {
                password: newPassword
            }
        })

        if (change) {
            return {
                message: "The password has been updated successfully",
                status: 200
            }
        }

        throw new Error('We have an error updating the password')
    }
}
