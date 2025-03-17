import {z} from 'zod'; 
export const messageSchema = z.object({
        content : z
        .string()
        .min(10 , {message : "content must be at least 1 character long"})
        .max(300 , {message : "content must be no more than 300 characters"})
})
