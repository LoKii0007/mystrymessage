import dbConnect from "@/lib/db.connect";
import UserModel from "@/model/user";

export async function GET(req: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    const username = queryParam.username
    console.log('username', username)
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "username is already taken",
        },
        {
          status: 200,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "username is available",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "error checking username",
      },
      {
        status: 500,
      }
    );
  }
}
