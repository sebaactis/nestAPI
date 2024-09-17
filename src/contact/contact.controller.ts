import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { AuthJwtGuard } from 'src/auth/guards/authJwt.guard';
import { Contact } from './dto/createContact';

@Controller('contact')
export class ContactController {

    constructor(private readonly contactService: ContactService) { }

    @Get()
    @UseGuards(AuthJwtGuard)
    async getAll(@Req() req) {
        const email = req.user.email;

        try {
            const contacts = await this.contactService.getAll(email);

            return contacts;

        } catch (error) {
            if (!(error instanceof HttpException)) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
            }

            throw new HttpException(error.message, error.getStatus());
        }

    }

    @Get("/:userAlias")
    @UseGuards(AuthJwtGuard)
    async getOne(@Req() req, @Param('userAlias') userAlias: string) {

        const email = req.user.email;
        try {
            const contact = await this.contactService.getOne(email, userAlias);

            return contact;

        } catch (error) {
            if (!(error instanceof HttpException)) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
            }

            throw new HttpException(error.message, error.getStatus());
        }

    }

    @Post()
    @UseGuards(AuthJwtGuard)
    async create(@Req() req, @Body() createContact: Contact) {
        const email = req.user.email;
        try {
            const create = await this.contactService.create(email, createContact);

            return create;

        } catch (error) {
            if (!(error instanceof HttpException)) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
            }

            throw new HttpException(error.message, error.getStatus());
        }
    }

    @Delete()
    @UseGuards(AuthJwtGuard)
    async delete(@Body() contact: Contact) {
        try {
            const deleteContact = await this.contactService.delete(contact);

            return deleteContact;

        } catch (error) {
            if (!(error instanceof HttpException)) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
            }

            throw new HttpException(error.message, error.getStatus());
        }
    }
}
