import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/db.connect";
import UserModel, { User } from "@/model/user";

export async function POST(req : Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    // const user = session?.user
    const user:User = session?.user as User

    if(!session || !session.user){
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

    const userId = user._id
    const {acceptMessages} = await req.json()

    try {
        const updatedUser = UserModel.findByIdAndUpdate(userId, 
            {isAcceptingMessages : acceptMessages },
            {new : true}
            //implementing the above return the updated value
        )
        if(!updatedUser){
            return Response.json(
                {
                  success: false,
                  message: "user not found",
                },
                {
                  status: 404,
                }
              );
        }
        return Response.json(
            {
              success: true,
              message: "isacceptingmessage status updated successfully",
            },
            {
              status: 200,
            }
          );
    } catch (error) {
      console.log('error calling accept-messages post api', error)
        return Response.json(
            {
              success: false,
              message: "error updating isacceptingmessage status",
            },
            {
              status: 400,
            }
          );
    }

}

export async function GET(req:Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    // const user = session?.user
    const user:User = session?.user as User

    if(!session || !session.user){
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

    const userId = user._id

    try {
        const foundUser = await UserModel.findById(userId)
        if(!foundUser){
            return Response.json(
                {
                  success: false,
                  message: "user not found",
                },
                {
                  status: 404,
                }
              );
        }
        return Response.json(
            {
              success: true,
              message: "status fetched successfully",
              isAcceptingMessages : foundUser.isAcceptingMessage
            },
            {
              status: 200,
            }
          );
    } catch (error) {
      console.log('error calling accept-messages get api', error)
        return Response.json(
            {
              success: false,
              message: "error updating isacceptingmessage status",
            },
            {
              status: 400,
            }
          );
    }
}