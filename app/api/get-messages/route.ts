import { getServerSession } from "next-auth";
import prisma from "@/prisma/db";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function GET(req:Request){
    const session = await getServerSession(authOptions)
    const user:User = session?.user as User
    if (!session || !session.user){
        return Response.json({success:false , message:"Not Authenticated"}, { status: 401 })
    }
    const userId = user.id
    
    try {
        const userWithMessage = await prisma.user.findUnique({
            where: { id: Number(userId) }, // Assuming userId is the string ID of the user
            include: {
              messages: {
                orderBy: { createdAt: 'desc' } // Sort messages by createdAt in descending order
              }
            }
          });
    if (!userWithMessage) {
        return Response.json(
          { message: 'No Messages found', success: false },
          { status: 404 }
        );
      }
    if (userWithMessage.messages.length === 0) {
        return Response.json(
          { message: 'No messages to display', success: true },
          { status: 200 }
        );
      }
  
      return Response.json(
        { messages: userWithMessage.messages },
        {
          status: 200,
        }
      );
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      return Response.json(
        { message: 'Internal server error', success: false },
        { status: 500 }
      );
    }
}