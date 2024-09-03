import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { createUserDto } from './dto/createUserDto';

type UserResponse = Omit<User, 'password'>

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(): Promise<UserResponse[]> {
        return await this.prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true
            }
        })
    }

    async findOne(username: string): Promise<User | undefined> {

        const user = await this.prisma.user.findFirst({
            where: {
                username
            }
        });
        return user;
    }

    async create(user: createUserDto): Promise<createUserDto> {

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

        return await this.prisma.user.create({
            data: {
                email: user.email,
                username: user.username,
                password: user.password
            }
        })
    }
}
