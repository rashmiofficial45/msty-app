"use client"
import React from 'react'
import Link from 'next/link'
import { useSession , signOut } from 'next-auth/react'
import {User} from "next-auth"
import { Button } from './ui/button'
function Navbar() {
    const {data: session} = useSession()
    console.log(session)
    const user:User= session?.user as User
    console.log(user)

  return (
    <>
        <nav className={` p-2 md:p-6 shadow-md`}>
            <div className=' container mx-auto flex flex-col md:flex-row justify-between items-center'>
                <a href="#" className=' text-xl font-bold mb-4 md:mb-0'>Msty Msg</a>
                {
                session?(
                    <>
                    <span className='mr-4'>Welcome {user.username || user.email}</span>
                    <Button className=' w-full md:w-auto' onClick={()=>{
                        signOut()
                    }}>Log Out</Button>
                    </>
                ):(
                    <Link href="/signin"><Button className=' w-full md:w-auto'>Login</Button></Link>
                )
                }
            </div>
        </nav>    
    </>
  )
}

export default Navbar
