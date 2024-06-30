import dbConnect from "@/lib/db.connect";
import UserModel from "@/model/user";

export async function POST(req: Request) {
  dbConnect();
  try {
    const { username, code } = await req.json();
    console.log(username, code);
    const decodeUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodeUsername });
    console.log(user)
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        {
          status: 400,
        }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeExpired = new Date(user.verifyCodeExpiry) < new Date();

    if (!isCodeExpired && isCodeValid) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "user verified successfully",
        },
        {
          status: 200,
        }
      );
    } else if (isCodeExpired) {
      return Response.json(
        {
          success: false,
          message: "code expired please send the otp again",
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "incorrect verification code",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error("error registering user");
    return Response.json(
      {
        success: false,
        message: "error verifying user",
      },
      {
        status: 500,
      }
    );
  }
}
