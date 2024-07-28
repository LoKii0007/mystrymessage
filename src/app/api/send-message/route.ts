import dbConnect from "@/lib/db.connect";
import UserModel, { Message } from "@/model/user";

export async function POST(req:Request) {
    await dbConnect()

    const {username , content} = await req.json()
    console.log(username , content)

    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json(
                {
                  success: false,
                  message: "user not found"
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
                  isAcceptingMessages : false
                },
                {
                  status: 200,
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
              isAcceptingMessages : true
            },
            {
              status: 200,
            }
        );
    } catch (error) {
      console.log('error calling send message api', error)
        return Response.json(
            {
              success: false,
              message: "error sednding messages",
            },
            {
              status: 500
            }
        );
    }
}