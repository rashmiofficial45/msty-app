import { getServerSession } from "next-auth";
import prisma from "@/prisma/db";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import { acceptMessageSchema } from "@/schema/acceptMessageSchema";
export async function POST(req:Request){
    try{
    const session = await getServerSession(authOptions)
    const user:User = session?.user as User
    if (!session || !session.user){
        return Response.json({success:false , message:"Not Authenticated"}, { status: 401 })
    }
    const userId = session.user.id
    const body = await req.json();
    const parsedMessage = acceptMessageSchema.safeParse(body);

    if (!parsedMessage.success) {
      return Response.json(
        { success: false, errors: parsedMessage.error.errors },
        { status: 400 }
      );
    }

    const { acceptMessages } = parsedMessage.data;

    const updatedUser = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        isAcceptingMessages: acceptMessages,
      },
    });

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update the User status to accept messages",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Successfully updated the User status",
        data: updatedUser,
      },
      { status: 200 }
    );
}
   catch (error) {
    console.error("Failed to update the User status to accept messages", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update the User status to accept messages",
      },
      { status: 500 }
    );
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