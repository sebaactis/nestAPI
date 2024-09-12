import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { ChargeDto } from "./dto/chargeDto";
import { AuthJwtGuard } from "src/auth/guards/authJwt.guard";
import { TransferDto } from "./dto/transferDto";

@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService: WalletService) { }

    @UseGuards(AuthJwtGuard)
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

    @UseGuards(AuthJwtGuard)
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

    @HttpCode(200)
    @Post("/transfer")
    @UseGuards(AuthJwtGuard)
    async transfer(@Req() req, @Body() transferDto: TransferDto) {
        try {
            const transfer = await this.walletService.transfer(req.user.email, transferDto)

            return {
                "message": "Transfer successfully",
                status: 200
            }
        } catch (error) {
            if (!(error instanceof HttpException)) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
            }

            throw new HttpException(error.message, error.getStatus())
        }
    }
}