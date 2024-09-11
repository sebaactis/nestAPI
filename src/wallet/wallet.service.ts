import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { createUserDto } from "src/users/dto/createUserDto";
import { ChargeDto } from "./dto/chargeDto";
import { UsersService } from "src/users/users.service";

@Injectable()
export class WalletService {
    constructor(private readonly prismaService: PrismaService) { }

    async create() {
        const wallet = await this.prismaService.wallet.create({
            data: {
                currencyId: 1,
                balance: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        })

        return wallet.id;
    }

    async getBalance(email: string) {

        const balance = await this.prismaService.wallet.findFirst({
            where: {
                user: {
                    email
                }
            }
        })

        return balance;
    }

    async delete(id: number) {
        const deleteU = await this.prismaService.wallet.delete({
            where: {
                id
            }
        })

        return deleteU;
    }

    async charge(chargeDto: ChargeDto) {

        const { email, amount } = chargeDto;

        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })

        console.log(user)

        if (!user) {
            throw new Error('User not found')
        }

        const charge = await this.prismaService.wallet.update({
            where: {
                userId: user.id
            },
            data: {
                balance: {
                    increment: amount
                }
            }
        })

        return charge;
    }

    async extraction(chargeDto: ChargeDto) {

        const { email, amount } = chargeDto;

        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })

        if (!user) {
            throw new Error('User not found')
        }

        const wallet = await this.prismaService.wallet.findUnique({
            where: {
                userId: user.id,
            },
            select: {
                balance: true,
            },
        });

        if (!wallet || wallet.balance < amount || wallet.balance <= 0) {
            throw new Error('Insufficient funds')
        }

        const extraction = await this.prismaService.wallet.update({
            where: {
                userId: user.id
            },
            data: {
                balance: {
                    decrement: amount
                }
            }
        })

        return extraction;
    }
}
