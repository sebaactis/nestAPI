import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { createUserDto } from './dto/createUserDto';
import { WalletService } from 'src/wallet/wallet.service';
import { UserResponse } from 'src/utils/types';
import { updateUserDto } from './dto/updateUserDto';
import { ChangePasswordDto } from './dto/changePasswordDto';
import { createHash, validatePassword } from 'src/utils/password';
import { randomUUID } from 'crypto';
import { RecoveryPasswordDto } from './dto/recoveryPasswordDto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService, private readonly walletService: WalletService, @Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    async findAll(): Promise<UserResponse[]> {
        const cacheKey = 'usersFindAll';
        const ttl = 60 * 1000;

        const usersCached: UserResponse[] = await this.cacheManager.get(cacheKey)

        if (usersCached) {

            return usersCached.map(user => ({
                email: user.email,
                username: user.username,
                userType: user.userType,
                wallet: user.wallet,
            }))
        }

        const users = await this.prisma.user.findMany({

            include: {
                userType: true,
                wallet: true
            }
        })

        await this.cacheManager.set(cacheKey, users, ttl)

        return users.map(user => ({
            email: user.email,
            username: user.username,
            userType: user.userType,
            wallet: user.wallet
        }))
    }

    async findOne(email: string): Promise<User | undefined> {

        const user = await this.prisma.user.findFirst({
            where: {
                email
            },
            include: {
                userType: true,
                wallet: true
            }
        });

        return user;
    }

    async create(user: createUserDto) {

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


        return await this.prisma.$transaction(async (prisma) => {
            const newUser = await prisma.user.create({
                data: {
                    email: user.email,
                    username: user.username,
                    password: await createHash(user.password),
                    userTypeId: +user.userTypeId,
                    walletId: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });

            const newWallet = await prisma.wallet.create({
                data: {
                    userId: newUser.id,
                    currencyId: 1,
                    balance: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });

            await prisma.user.update({
                where: { id: newUser.id },
                data: {
                    walletId: newWallet.id,
                },
            });

            return { newUser: { ...newUser, walletId: newWallet.id, password: undefined }, newWallet };
        })
    }

    async update(email: string, user: updateUserDto): Promise<User> | null {
        const userCheck = await this.prisma.user.findFirst({
            where: {
                email
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

    async delete(email: string): Promise<User | null> {
        const userCheck = await this.prisma.user.findFirst({
            where: {
                email
            }
        })

        if (!userCheck) {
            throw new Error('User not found')
        }


        const wallet = await this.walletService.getBalance(email);

        if (wallet.balance !== 0) {
            throw new Error('You cant delete a user when the wallet has money inside. Please let the wallet in 0 and try again')
        }

        const deleteUser = await this.prisma.user.delete({
            where: {
                email
            }
        })

        return deleteUser;
    }

    async changePassword(email: string, changePasswordDto: ChangePasswordDto) {
        const user = await this.prisma.user.findFirst({
            where: {
                email
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
                email
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

    async forgetPassword(email: string) {

        const user = await this.prisma.user.findFirst({
            where: {
                email
            }
        })

        if (!user) {
            throw new Error('User not found, please try with another user')
        }

        return await this.prisma.user.update({
            where: {
                email
            },
            data: {
                recoveryPasswordToken: randomUUID(),
                recoveryPasswordTokenExpiration: new Date(new Date().getTime() + 5 * 60 * 1000)
            }
        })
    }

    async recoveryPassword(recoveryPasswordDto: RecoveryPasswordDto) {
        const user = await this.prisma.user.findFirst({
            where: {
                email: recoveryPasswordDto.email,
                recoveryPasswordTokenExpiration: {
                    gt: new Date()
                }
            }
        })

        if (!user) {
            throw new Error('User not found, or token expiration, please try with another user')
        }

        if (user.recoveryPasswordToken !== recoveryPasswordDto.recoveryToken) {
            throw new Error('The recovery token is invalid, please check and try again')
        }

        if (recoveryPasswordDto.newPassword !== recoveryPasswordDto.confirmNewPassword) {
            throw new Error('The new password and the confirme new password do not match')
        }

        const update = await this.prisma.user.update({
            where: {
                email: recoveryPasswordDto.email
            },
            data: {
                password: await createHash(recoveryPasswordDto.newPassword),
                recoveryPasswordToken: null,
                recoveryPasswordTokenExpiration: null
            }
        })

        if (!update) {
            throw new Error('Error while updated the password, please try again')
        }

        return {
            message: "The password has been updated successfully",
            status: 200
        }

    }
}
