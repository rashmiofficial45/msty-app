import prisma from "@/prisma/db";
// import { getServerSession } from "next-auth";
import { messageSchema } from "@/schema/messageSchema";
export async function POST(req:Request){
    const body = await req.json()
    const parsedMessage = messageSchema.safeParse(body)
    if (!parsedMessage.success){
        return Response.json("message is required", {status:400})
    }
    const {username, content} = parsedMessage.data
    // const session =await getServerSession()
    // const user = session?.user
    // if (!session || !session.user){
    //     return Response.json("user is not logged in", {status:400})
    // }
    try {
        const user = await prisma.user.findUnique({
            where:{
                username 
            }
        })
        if (!user){
            return Response.json("username is required", {status:400})
        }
        if (!user.isAcceptingMessages){
            return Response.json("user is not accepting messages", {status:400})
        }
        const newMessage = await prisma.message.create({
            data:{
                content,
                createdAt: new Date(),
                user: {
                connect: { id: user.id }
                }
            }
        })
        console.log(newMessage)
        if (!newMessage){
            return Response.json("message not sent", {status:400})
        }
        return Response.json(
            { message: 'Message sent successfully', success: true },
            { status: 201 }
          );
    } catch (error) {
        console.error('Error adding message:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
    }
    finally {
        await prisma.$disconnect();
      }
}