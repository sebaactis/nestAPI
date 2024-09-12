import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTransactionDto } from './dto/createTransactionDto';

@Injectable()
export class TransactionService {
    constructor(private readonly prismaService: PrismaService) { }

    async createDebit(createTransactionDto: CreateTransactionDto) {

        const transaction = await this.prismaService.transaction.create({
            data: {
                walletId: createTransactionDto.walletId,
                typeId: 4,
                amount: -createTransactionDto.amount,
                description: createTransactionDto.description,
                currencyId: createTransactionDto.currencyId,
                statusId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        })

        return transaction;

    }

    async createCredit(createTransactionDto: CreateTransactionDto) {

        const transaction = await this.prismaService.transaction.create({
            data: {
                walletId: createTransactionDto.walletId,
                typeId: 5,
                amount: createTransactionDto.amount,
                description: createTransactionDto.description,
                currencyId: createTransactionDto.currencyId,
                statusId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        })

        return transaction;

    }
}
