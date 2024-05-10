import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import prisma from "@/prisma/db"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                try {
                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email
                        }
                    })
                    if (!user) {
                        const user = await prisma.user.findUnique({
                            where: {
                                username: credentials.email
                            }
                        })
                    }
                    if (!user) {
                        throw new Error('User not found');
                    }
                    if (!user.isVerified) {
                        throw new Error('Verify your User first before login');
                    }
                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isValid) {
                        throw new Error('Invalid password');
                    }
                    return user;
                }
                catch (error:any) {
                    throw new Error("Error is " , error);

                }
            }})
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.isVerified = user.isVerified
                token.username= user.username
                token.isAcceptingMessages = user.isAcceptingMessages
            }
         return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.isVerified = token.isVerified as string;
                session.user.username = token.username as string | undefined;
                session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
            }
           return session
        }
    },
    pages:{
        signIn:'/signin'
    },
    session:{
        strategy:"jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
    
}
