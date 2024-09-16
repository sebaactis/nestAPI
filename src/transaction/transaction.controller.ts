import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {

    constructor(private readonly transactionService: TransactionService) { }

    @Get('listTransactions/:userId')
    async getAllByUser(@Param('userId') userId: number) {

        try {
            const transactions = await this.transactionService.getAll(userId);

            return transactions.map(trx => {
                return (
                    {
                        id: trx.id,
                        amount: trx.amount,
                        type: trx.type.description,
                        status: trx.status.description,
                        currency: trx.currency.name + " - " + trx.currency.description,
                        description: trx.description,
                        date: trx.createdAt
                    }
                )
            })
        } catch (error) {
            if (!(error instanceof HttpException)) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
            }
            throw new HttpException(error.message, error.getStatus())
        }

    }

    @Get('/:trxId')
    async getOneByUser(@Param('trxId') trxId: number) {

        try {
            const transactions = await this.transactionService.getOne(trxId);

            return {
                id: transactions.id,
                amount: transactions.amount,
                type: transactions.type.description,
                status: transactions.status.description,
                currency: transactions.currency.name + " - " + transactions.currency.description,
                description: transactions.description,
                date: transactions.createdAt
            }

        } catch (error) {
            if (!(error instanceof HttpException)) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
            }
            throw new HttpException(error.message, error.getStatus())
        }

    }
}
