import {z} from 'zod';
import { usernameValidation } from './signUpSchema';
export const messageSchema = z.object({
    username:usernameValidation,
    content:z.string().
    min(10, 'Content must be at least of 10 characters').
    max(300, 'Content must be no longer than 300 characters')
}) 
