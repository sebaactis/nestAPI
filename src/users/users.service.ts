import { Injectable } from '@nestjs/common';
import { User, UserType, Wallet } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { createUserDto } from './dto/createUserDto';
import { WalletService } from 'src/wallet/wallet.service';
import { UserResponse } from 'src/utils/types';
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
            wallet: user.wallet,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }))
    }

    async findOne(username: string): Promise<User | undefined> {

        const user = await this.prisma.user.findFirst({
            where: {
                username
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

        const walletId = await this.walletService.create(user);

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
}
