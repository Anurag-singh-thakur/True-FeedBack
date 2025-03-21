import { z } from 'zod'
import dbConnect from '@/lib/dbConnect'
import userModel from '@/model/User'
import { usernameValidation } from '@/schemas/signupSchema'
import { log } from 'console'

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
   
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        }
        //validate username with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result);

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []

            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(',') : 'Invalid query parameter'
            }, {
                status: 400
            }
            )
        }

        const { username } = result.data

        const existingVerifiedUser = await userModel.findOne({ username, isVerified: true })
        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: "username is already taken"
                }, {
                status: 400
            }
            )
        }
        return Response.json(
            {
                success: true,
                message: "username is available "
            }, {
            status: 400
        }
        )
    } catch (error) {
        console.error("Error Checking username", error)
        return Response.json(
            {
                success: false,
                message: "error cheking username"
            }, {
            status: 500
        }
        )
    }
}