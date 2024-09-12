import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTransferDto } from './dto/createTransferDto';

@Injectable()
export class TransferService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(createTransferDto: CreateTransferDto) {

        const transfer = await this.prismaService.transfer.create({
            data: {
                walletFromId: createTransferDto.fromWalletId,
                walletToId: createTransferDto.toWalletId,
                currencyId: createTransferDto.currencyId,
                amount: createTransferDto.amount,
                statusId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        })

        return transfer;
    }
}
