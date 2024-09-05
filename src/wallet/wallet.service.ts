import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { createUserDto } from "src/users/dto/createUserDto";

@Injectable()
export class WalletService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(username: createUserDto) {
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
}
