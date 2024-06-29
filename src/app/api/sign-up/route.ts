// import sendverificationEmail from "@/components/emailVerification";
import dbConnect from "@/lib/db.connect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await req.json();
    const existingUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "username is already taken",
        },
        {
          status: 400,
        }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "user with this email already exists",
          },
          {
            status: 500,
          }
        );
      }
      const hashesdPass = await bcrypt.hash(password, 10);
      existingUserByEmail.password = hashesdPass;
      existingUserByEmail.verifyCode = verificationCode;
      existingUserByEmail.verifyCodeExpiry = new Date(
        Date.now() + 60 * 60 * 1000
      );

      await existingUserByEmail.save();
    } else {
      const hashesdPass = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username: username,
        email: email,
        password: hashesdPass,
        verifyCode: verificationCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    // send verification email using resend
    // const emailResponse = await sendverificationEmail(username,email, verificationCode)
    // if(!emailResponse.success){
    //   return Response.json({
    //     success : false,
    //     message : emailResponse.message
    //   }),{
    //     status : 500
    //   }
    // }
    // return Response.json(
    //   {
    //     success: true,
    //     message: "user registerd successfully, please check your email",
    //   },
    //   {
    //     status: 200,
    //   }
    // );

    //email using nodemailer
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "truefeedback verification code",
      text: `Your verification code is ${verificationCode}`,
      amp : `<!DOCTYPE html>
      <html>
      <head>
        <title>truefeedback verification code</tittle>
        <meta charset="utf-8">
      </head>
      <body>
        <h2>Your verification code is ${verificationCode}</h2>
        <h5>Your verification code is ${verificationCode}</h5>
        <div style={{color:"white"}} >hi</div>
      </body>
      </html>
      `
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log("error sending email", err);
        return Response.json(
          {
            success: false,
            message: "error sending email",
          },
          {
            status: 400,
          }
        );
      }
    });
    return Response.json(
      {
        success: true,
        message: "user registerd successfully, please check your email",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("error registering user req", error);
    return Response.json(
      {
        success: false,
        message: "error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
