"use client"

import { signOut, useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

export default function Navbar() {
    const { data: session } = useSession()
    const router = useRouter()
    const pathname = usePathname()
    console.log(pathname)
    return (
        <div className='sticky p-5 h-[10vh] bg-gray-600 text-white flex justify-center items-center '>
            <div className="navbar flex items-center justify-between">
                <div className="nav-left px-12">
                    <div className='cursor-pointer' onClick={()=>router.push('/dashboard')} >True feedback</div>
                </div>
                <div className="nav-right flex px-12">
                    {session ?
                    <>
                    <div className="nav-item mx-5">{session.user.username} </div>
                    <button onClick={() => signOut()}>Sign out</button>
                    {pathname === '/dashboard' && <button onClick={()=>router.push('/send-message')} className="send-btn px-10 ml-5 py-3 bg-black text-white rounded-2xl ">Send message</button> }
                    </>
                     :
                     <div>
                        <button>Login</button>
                        <button onClick={()=>router.push('/send-message')} className="send-btn px-10 ml-5 py-3 bg-black text-white rounded-2xl ">Send message</button>
                     </div>
                     
                    }
                </div>
            </div>
        </div>
    )

}
