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

    async create(user: createUserDto): Promise<any> {
        return this.prisma.user.create({
            data: {
                email: user.email,
                username: user.username,
                password: user.password
            }
        })
    }
}
