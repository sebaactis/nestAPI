import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Contact } from './dto/createContact';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ContactService {
    constructor(private readonly prismaService: PrismaService, private readonly usersService: UsersService) { }

    async getAll(email: string) {
        const contacts = await this.prismaService.contact.findMany({
            where: {
                user: {
                    email
                }
            }
        })

        if (!contacts) {
            throw new Error('No contacts found')
        }

        return contacts.map(contact => ({ ...contact }))
    }

    async getOne(email: string, userAlias: string) {
        const contact = await this.prismaService.contact.findFirst({
            where: {
                AND: [
                    { userAlias },
                    { user: { email } }
                ]
            }
        })

        if (!contact) {
            throw new Error('No contact found')
        }

        return contact;
    }

    async create(email: string, contact: Contact) {
        const contactExis = await this.prismaService.contact.findFirst({
            where: {
                walletId: contact.walletId
            }
        })

        if (contactExis) {
            throw new Error('Contact exists')
        }

        const user = await this.usersService.findOne(email)

        const create = await this.prismaService.contact.create({
            data: {
                userId: user.id,
                walletId: contact.walletId,
                userAlias: contact.userAlias,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        })

        return create;
    }

    async delete(contact: Contact) {
        const contactExis = await this.prismaService.contact.findFirst({
            where: {
                walletId: contact.walletId
            }
        })

        if (!contactExis) {
            throw new Error('Contact doesnt exists')
        }


        const deleteContact = await this.prismaService.contact.delete({
            where: {
                id: contactExis.id
            }
        })

        return deleteContact;
    }
}
