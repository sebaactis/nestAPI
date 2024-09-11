import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { ChargeDto } from "./dto/chargeDto";

@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService: WalletService) { }

    @HttpCode(200)
    @Post("/charge")
    async chargeWallet(@Body() chargeDto: ChargeDto) {

        try {
            const charge = await this.walletService.charge(chargeDto)

            return {
                message: "Charge successfully",
                status: 200,
                balance: charge.balance
            }
        } catch (error) {

            if (!(error instanceof HttpException)) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
            }

            throw new HttpException(error.message, error.getStatus())
        }

    }

    @HttpCode(200)
    @Post("/extraction")
    async extractionWallet(@Body() chargeDto: ChargeDto) {

        try {
            const charge = await this.walletService.extraction(chargeDto)

            return {
                message: "Extraction successfully",
                status: 200,
                balance: charge.balance
            }
        } catch (error) {

            if (!(error instanceof HttpException)) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
            }

            throw new HttpException(error.message, error.getStatus())
        }

    }
}