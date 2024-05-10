import "next-auth"
import { DefaultSession } from "next-auth"
declare module "next-auth" {
  interface User {
    id:string
    isVerified: string
    isAcceptingMessages?:boolean
    username?:string
  }
  interface Session {
    user:{
        id:string
        isVerified: string
        isAcceptingMessages?:boolean
        username?:string
    }&DefaultSession['user']
  }
}