import { z } from "zod";
import { usernameValidation } from "@/schema/signUpSchema";
import prisma from "@/prisma/db";
import { NextRequest , NextResponse } from "next/server";
const usernameQuerySchema = z.object({
    username: usernameValidation,
    // queue: z.string()
})

export async function GET(req:NextRequest){
    try {
        const { searchParams } = new URL(req.url)
        console.log(searchParams)
        const queryParams = {
            username: searchParams.get('username')
        }
        const result = usernameQuerySchema.safeParse(queryParams)
        console.log(result)
        if(!result.success) {
            const errors = result.error.format().username?._errors || []
            return new NextResponse(errors[0], { status: 400 })
        }
        const { username } = result.data
        const existingUser =await prisma.user.findUnique({
            where: {
                username,
                isVerified:true
            }
        })
        if (existingUser){
            return new NextResponse("User already exist" , { status: 400 })
        }
        return new NextResponse("Username Available", { status: 200 })
        } 
        catch (error) {
        console.error("Error while checking Username", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
