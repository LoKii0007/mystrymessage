"use client"

import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Navbar() {
    const { data: session } = useSession()
    const router = useRouter()
    return (
        <div className='sticky p-5 h-[10vh] bg-gray-600 text-white flex justify-center items-center '>
            <div className="navbar flex items-center justify-between">
                <div className="nav-left px-12">
                    <div className='cursor-pointer' onClick={()=>router.push('/')} >True feedback</div>
                </div>
                <div className="nav-right flex px-12">
                    {session ?
                    <>
                    <div className="nav-item mx-5">{session.user.username} </div>
                    <button onClick={() => signOut()}>Sign out</button>
                    </>
                     :
                     <button>Login</button>
                    }
                </div>
            </div>
        </div>
    )

}
