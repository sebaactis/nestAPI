import { UserType, Wallet } from "@prisma/client";

export interface UserResponse {
    email: string;
    username: string;
    userType: UserType;
    wallet: Wallet;
}