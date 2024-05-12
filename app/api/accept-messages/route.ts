import { getServerSession } from "next-auth";
import prisma from "@/prisma/db";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function POST(req:Request){
    const session = await getServerSession(authOptions)
    const user:User = session?.user as User
    if (!session || !session.user){
        return Response.json({success:false , message:"Not Authenticated"}, { status: 401 })
    }
    const userId = user.id
    const {AcceptMessages} =await req.json()
    try {
        const updatedUser = await prisma.user.update({
            where:{
                id:Number(userId)
            },
            data:{
                isAcceptingMessages:AcceptMessages
            }
        })
        if (!updatedUser){
            return Response.json({
                success:false,
                message:"Failed to update the User status to update messages" 
            },
            {
                status:401
            })
        }
        return Response.json({
            success:true,
            message:"Successfully updated the User status" ,
            data:updatedUser
        },
        {
            status:200
        })
    } catch (error) {
        console.log("Failed to update the User status to update messages" , error);
        return Response.json({
            success:false,
            message:"Failed to update the User status to update messages"
            },
            {
                status:401
            })
        
    }

}

export async function GET(req:Request){
    const session = await getServerSession(authOptions)
    const user:User = session?.user as User
    if (!session || !session.user){
        return Response.json({success:false, message:"Not Authenticated"}, { status: 401 })
    }
    const userId = session.user.id
    try {
        const foundUser = await prisma.user.findUnique({
            where:{
                id:Number(userId)
            }
        })
        if (!foundUser){
            return Response.json({
                success:false,
                message:"Failed to fetch the User status"
            },
            {
                status:401
            })
        }
        return Response.json({
            success:true,
            message:"Successfully fetched the User status" ,
            data:foundUser,
            isAcceptingMessages:foundUser.isAcceptingMessages
        },
        {
            status:200
        }
        )
    }
    catch(error){
        console.error('Error retrieving message acceptance status:', error);
        return Response.json(
        {  
            success: false,
            message: 'Error retrieving message acceptance status' 
        },
        { 
            status: 500
        }
        )
    }
}