import {z} from 'zod'; 


export const usernameValidation = z
    .string()
    .min(2 , "Username must be at least 2 characters long")
    .max(20 , "Username must be no more than 20 characters")
    .regex(/^[a-zA-Z0-9]*$/ , "Username must contain only letters and numbers");



export const signupSchema = z.object({
    username :usernameValidation, 
    email : z.string().email({message : "Invalid email address"}),
    password : z.string().min(6 , {message : "Password must be at least 6 characters long"})
})