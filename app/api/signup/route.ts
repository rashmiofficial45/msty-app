import prisma from "@/prisma/db";
import bcrypt from "bcrypt";
import { NextRequest , NextResponse } from "next/server";
import {signUpSchema} from "@/schema/signUpSchema"
import sendVerificationEmail from "@/helpers/sendVerificationEmail"

export async function POST(req: NextRequest) {
    try {
        const { username, email, password } = await signUpSchema.parse(req.body);
        const existingUserVerifiedByUsername =  await prisma.user.findFirst({
            where: {
                username,
                isVerified: true,
            },
        });
        if (existingUserVerifiedByUsername) {
            return NextResponse.json({
                success: false,
                error: "Username already taken .",
            },
            {
                status: 400,
            });
        }
        const user =  await prisma.user.findUnique({
            where: {
                email,
            },
        });
        const verifyCode = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        if (user) {
            if (user.isVerified === true) {
                return NextResponse.json({
                    success: false,
                    error: "User already exist with this Email .",
                },
                {
                    status: 400,
                });
            }
            else{
                const hashedPassword = await bcrypt.hash(password, 10);
                user.password = hashedPassword;
                user.verifyCode = verifyCode;
                user.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await prisma.user.update({
                    where: {
                        email: user.email,
                    },
                    data: user,
                });
            }
        }
        else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 1);
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified: false,
                isAcceptingMessages:true,
                messages:{
                    create:[]
                }
            },
        });
    }
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );
        if (!emailResponse.success) {
            return NextResponse.json({
                success: false,
                error: "Error while sending Email",
            },
            {
                status: 500,
            });
        }
        return NextResponse.json({
            success: true,
            message: "User registered successfully , please verify your Email",
        });
        //send verification email
    } catch (error) {
        console.error("Error registering user");
        return NextResponse.json({ 
            success: false,
            error: "Error registering user",
        },
        {
            status: 500,
        });
    }
}
    