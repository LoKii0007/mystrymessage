"use client"

import { signOut, useSession } from 'next-auth/react'
import React from 'react'

export default function Navbar() {
    const { data: session } = useSession()
    return (
        <div className='sticky p-5 h-[10vh] bg-gray-600 text-white'>
            <div className="navbar flex items-center justify-around">
                <div className="nav-left">
                    True feedback
                </div>
                <div className="nav-right flex">
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
