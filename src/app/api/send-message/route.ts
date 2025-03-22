import userModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";

export async function POST(request : Request){
    await dbConnect()
    await request.json() 

    const {username , content} = await request.json() 
    try {
         const user =    await userModel.findOne({username})
        if(!user){
         return Response.json({
        success : false , 
        message : 'user not found'
    } ,{status: 404})
   }

   //is user accepting the messages 

   if(!user.isAcceptingMessage){
    return Response.json({
        success : false , 
        message : 'user is not accepting messages'
    } ,{status: 403})
   }

    const newMessage = {content , createdAt : new Date()}

    user.messages.push(newMessage as Message) 
    await user.save();

    return Response.json({
        success : true , 
        message : 'message sent successfully'
    } ,{status: 200})
    } catch (error) {
        console.log("Error adding messages "  , error);
        return Response.json({
            success : false , 
            message : 'Internal server error'
        } ,{status: 500})
        
    }
}