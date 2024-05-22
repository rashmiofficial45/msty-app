import { getServerSession } from 'next-auth/next';
import { User } from 'next-auth';
// import { Message } from '@/app/(app)/dashboard/page';
import prisma from "@/prisma/db"
import { authOptions } from '../../auth/[...nextauth]/options';

export async function DELETE(
  request: Request,
  { params }: { params: { id: number } }
) {
  const messageId = params.id;
  console.log(messageId);
  
  const session = await getServerSession(authOptions);
  const _user: User = session?.user as User;
  if (!session || !_user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const deleteResult = await prisma.message.delete({
      where: { id:Number(messageId) },
    });
    
    if (!deleteResult) {
      return Response.json(
        { message: 'Message not found or already deleted', success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { message: 'Message deleted', success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log('Error on deleting message:', error);
    return Response.json(
      { message: 'Error in deleting message', success: false },
      { status: 500 }
    );
  }
}