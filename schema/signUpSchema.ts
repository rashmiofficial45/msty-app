import { z } from "zod"
export const usernameValidation = z.
      string().
      min(3, { message: "Username must be at least 3 characters" }).
      max(30, { message: "Username must be at most 30 characters" }).
      regex(/^[a-zA-Z0-9._]+$/, { message: "Username must not contain Special Characters , only contain Underscore and Dot" })

export const signUpSchema = z.object({
      username: usernameValidation,
      email: z.string().email({ message: "Invalid email address" }),
      password: z.string().min(8, { message: "Password must be at least 8 characters" })
})
