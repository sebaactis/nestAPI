import * as bycrypt from 'bcrypt'

export const createHash = async (password: string) => {
    return await bycrypt.hash(password, 10);
}

export const validatePassword = async (userPassword: string, password: string) => {
    console.log(userPassword, password)
    return await bycrypt.compare(password, userPassword);
}