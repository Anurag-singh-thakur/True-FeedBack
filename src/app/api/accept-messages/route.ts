import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user: User = session?.user

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "not authenticated"
        }, { status: 401 }
        )
    }

    const userId = user._id
    const { acceptMessages } = await request.json()

    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Failed to update user status to accept messages"
            }, { status: 401 })
        } else {
            return Response.json({
                success: true,
                message: "message acceptance status update successfully",
                updatedUser
            }, { status: 200 })
        }
    } catch (error) {
        console.log("Failed to update user status to accept messages");
        return Response.json({
            success: false,
            message: "Failed to update user status to accept messages"
        }, { status: 500 })
    }
}

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user: User = session?.user

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "not authenticated"
        }, { status: 401 }
        )
    }

    const userId = user._id

    try {
        const foundUser = await userModel.findById(userId)
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "Failed to found the  user"
            }, { status: 404 })
        }


        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessage
        }, { status: 200 })
    } catch (error) {
        console.log("Error in  getting message acceptance");
        return Response.json({
            success: false,
            message: "Error in  getting message acceptance"
        }, { status: 500 })
    }

}