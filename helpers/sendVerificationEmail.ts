import VerificationEmail from "@/emails/VerificationEmail"
import { ApiResponse } from "@/types/ApiResponse"
import {resend} from "@/lib/resend"
export default async function sendVerificationEmail(
    email: string,
    username: string,
    verificationCode: string
):Promise<ApiResponse>{
    try {
        await resend.emails.send({
          from: '<onboarding@resend.dev>',
          to: email,
          subject: 'Mystery Message Verification Code',
          react: VerificationEmail({ username, otp: verificationCode }),
        });
        return { success: true, message: 'Verification email sent successfully.' };
      } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        return { success: false, message: 'Failed to send verification email.' };
      }
}