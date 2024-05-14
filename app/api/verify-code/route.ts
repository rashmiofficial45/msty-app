import prisma from "@/prisma/db";
import { NextRequest , NextResponse } from "next/server";
import { verifySchema } from "@/schema/verifySchema";

export async function POST(req:NextRequest){
    try {
        const body = await req.json()
        const parsedSchema=verifySchema.safeParse(body)
        if(!parsedSchema.success){
            return NextResponse.json({success:false, message:"Invalid request"})
        }
        const {username,code} = parsedSchema.data
        console.log(username , code)
        const decodedUser = decodeURIComponent(username)
        const user = await prisma.user.findUnique({
            where:{
                username: decodedUser
            }
        });
        if(!user){
            return NextResponse.json({success:false, message:"User not found"})
        }

        const isCodeValid = user.verifyCode == code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
        if(isCodeValid && isCodeNotExpired){
            await prisma.user.update({
                where:{
                    username: decodedUser
                },
                data:{
                    isVerified:true
                }
            })
            return NextResponse.json({
                success:true,
                message:"Account Verified Successfully"
            })
        }
        else if(!isCodeNotExpired){
            return NextResponse.json({
                success:false,
                message:"Code Expired"
            })
            }
        else if(!isCodeValid){
            return NextResponse.json({
                success:false,
                message:"Invalid Code"
            })
        }
        return NextResponse.json({success:false, message:"Something went wrong"})
    } catch (error) {
        console.error('Error verifying user', error);
        return NextResponse.json({ success: false, message: 'Failed to send verification email.' });
    }
}