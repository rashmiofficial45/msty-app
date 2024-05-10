import {resend} from "@/lib/resend"
import VerificationEmail from "@/emails/VerificationEmail"
import { ApiResponse } from "@/types/ApiResponse"

export default async function sendVerificationEmail(
    email: string,
    username: string,
    verificationCode: string
):Promise<ApiResponse>{
    try {
        const data = await resend.emails.send({
            from: '<onboarding@resend.dev>',
            to: email,
            subject: "Verification Code",
            react: VerificationEmail({username , otp:verificationCode}),
          });
        return {
            success: true,
            message: "Verification Email sent successfully"
        }
    } catch (emailError) {
        console.error("Error while sending Email");
        return {
            success: false,
            message: "Error while sending Email"
        }
        
    }
}