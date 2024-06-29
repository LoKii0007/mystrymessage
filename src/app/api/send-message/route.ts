import dbConnect from "@/lib/db.connect";
import UserModel, { Message } from "@/model/user";

export async function GET(req:Request) {
    await dbConnect()

    const {username , content} = await req.json()

    try {
        const user = await UserModel.findOne({username})
        if(!user){
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
        if(!user.isAcceptingMessage){
            return Response.json(
                {
                  success: false,
                  message: "user is not accepting any messages",
                },
                {
                  status: 400,
                }
            );
        }

        const newMessage = {
          content , 
          createdAt : new Date()
        }

        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json(
            {
              success: true,
              messages : "message sent successfully",
            },
            {
              status: 200,
            }
        );
    } catch (error) {
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