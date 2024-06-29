import { signOut, useSession } from 'next-auth/react'
import React from 'react'

export default function Navbar() {

    const {data:session} = useSession()

    if (session) {
        return (
            <div className=' sticky p-5 bg-gray-600 text-white'>
            <div className="navbar flex items-center justify-around">
                <div className="nav-left">
                    True feedback
                </div>
                <div className="nav-right">
                    <div className="nav-item">{session.user.email} </div>
                    <button onClick={() => signOut()}>Sign out</button>
                </div>
            </div>
            </div>
        )
    }
}
