import { z } from "zod";
import { usernameValidation } from "@/schema/signUpSchema";
import prisma from "@/prisma/db";
const usernameQuerySchema = z.object({
    username: usernameValidation,
    // queue: z.string()
})

export async function GET(req:Request){
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
            return Response.json({success:false , message:errors?.length > 0? 
                errors.join(" ,"):"invalid query parameter"
            }, { status: 400 })
        }
        const { username } = result.data
        const existingUser =await prisma.user.findUnique({
            where: {
                username,
                isVerified:true
            }
        })
        if (existingUser){
            return  Response.json({success:false, message:"User already exist"} , { status: 400 })
        }
        return Response.json({success:true,message:"Username Available"}, { status: 200 })
        } 
        catch (error) {
        console.log("Error while checking Username", error)
        return Response.json({success:false, message:"Error checking Username"}, { status: 500 })
    }
}
