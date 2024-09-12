import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ChargeDto } from "./dto/chargeDto";
import { TransferDto } from "./dto/transferDto";
import { TransferService } from "src/transfer/transfer.service";
import { TransactionService } from "src/transaction/transaction.service";

@Injectable()
export class WalletService {
    constructor(private readonly prismaService: PrismaService, private readonly transferService: TransferService, private readonly transactionService: TransactionService) { }

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

    async transfer(email: string, transferDto: TransferDto) {
        const fromWallet = await this.prismaService.wallet.findFirst({
            where: {
                user: {
                    email
                }
            }
        })

        if (!fromWallet) {
            throw new Error('From user not found')
        }

        const toWallet = await this.prismaService.wallet.findFirst({
            where: {
                user: {
                    email: transferDto.toEmail
                }
            }
        })

        if (!toWallet) {
            throw new Error('Destiny user not found')
        }

        if (fromWallet.balance < transferDto.amount) {
            throw new Error('Insufficient funds')
        }

        try {
            const transferProcess = await this.prismaService.$transaction(async (prisma) => {


                const transfer = await this.transferService.create({
                    fromWalletId: fromWallet.id,
                    toWalletId: toWallet.id,
                    currencyId: fromWallet.currencyId,
                    amount: transferDto.amount
                })


                const debit = await this.transactionService.createDebit({
                    walletId: fromWallet.id,
                    amount: transferDto.amount,
                    description: `Transfer to ${transferDto.toEmail}`,
                    currencyId: fromWallet.currencyId
                })

                const credit = await this.transactionService.createCredit({
                    walletId: toWallet.id,
                    amount: transferDto.amount,
                    description: `Transfer from ${email}`,
                    currencyId: toWallet.currencyId
                })

                await this.prismaService.wallet.update({
                    where: { id: fromWallet.id },
                    data: { balance: { decrement: transferDto.amount } }
                });

                await this.prismaService.wallet.update({
                    where: { id: toWallet.id },
                    data: { balance: { increment: transferDto.amount } }
                });
            })
        } catch (error) {
            return error;
        }
    }
}
