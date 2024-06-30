import dbConnect from "@/lib/db.connect";
import UserModel from "@/model/user";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  // const user = session?.user
  const user: User = session?.user as User;

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

  //aggregation pipeline
  //todo : aggregation pipeline samjhna hai
  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      //pahle exact user dhoondenge
      { $match: { _id: userId } },

      // objects ko array se unbind karenge taki sorting apply kar sake
      { $unwind: "$messages" },

      //applying sorting
      { $sort: { "messages.createdAt": -1 } },

      //grouping
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    if (!user || user.length === 0) {
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
    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("error calling accept-messages api", error);
    return Response.json(
      {
        success: false,
        message: "error updating isacceptingmessage status",
      },
      {
        status: 500,
      }
    );
  }
}
