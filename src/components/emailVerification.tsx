import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/apiResponse";

export default async function sendverificationEmail(username: string, email: string, otp : string):Promise<ApiResponse>{
  console.log(username, email, otp)
  try {
    await resend.emails.send({
      from: 'lokeshyadv8177@gmail.com',
      to: email,
      subject: 'TrueFeedback Verification Code',
      react: VerificationEmail ({username ,otp}),
    })
    return{success:true, message :"verication email sent successfully"}
  } catch (error) {
    console.log('error sending verification email', error)
    return {success : false, message:'failed to send verification email'}
  }
}
