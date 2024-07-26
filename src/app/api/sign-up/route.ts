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

    // *existing user and verified
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

    //*  existing user and not verified
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

    //email using nodemailer
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "TrueFeedback verification code",
      text: `Your verification code is ${verificationCode}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return new Response(
        JSON.stringify({
          success: true,
          message: "user registered successfully, please check your email",
        }),
        {
          status: 200,
        }
      );
    } catch (err) {
      console.log("error sending email", err);
      return new Response(
        JSON.stringify({
          success: false,
          message: "error sending email",
        }),
        {
          status: 500,
        }
      );
    }

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
