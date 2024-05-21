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
                identifier: { label: "Email / Username", type: "text" },
                password: { label: "Password", type: "password" }
              },
            async authorize(credentials: any): Promise<any> {
                try {
                    if (!credentials || !credentials.identifier || !credentials.password) {
                        throw new Error("Missing credentials");
                      }
                      const user = await prisma.user.findFirst({
                        where: {
                            OR: [
                                { username: credentials.identifier },
                                { email: credentials.identifier }
                            ]
                        }
                    });
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
    pages: {
        signIn: '/signin'
    },
    secret: process.env.NEXTAUTH_SECRET
    
}
