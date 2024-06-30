import dbConnect from "@/lib/db.connect";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/model/user";

export async function DELETE(req: Request, {params} : {params:{messageId: string} }) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  const messageId = params.messageId;
  console.log(messageId)
  // const messageId = await req.json();

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "not authenticated",
      },
      {
        status: 400,
      }
    );
  }
  try {
    const res = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );
    if (res.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "message not foundor already deleted",
        },
        {
          status: 404,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "message deleted",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log('error in dlete api', error)
    return Response.json(
      {
        success: false,
        message: "error deleting message",
      },
      {
        status: 500,
      }
    );
  }
}
