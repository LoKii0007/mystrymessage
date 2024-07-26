"use client"

import { signOut, useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
    const { data: session } = useSession()
    const router = useRouter()
    const pathname = usePathname()
    const [flag, setFlag] = useState(false)

    useEffect(() => {
        const responsive = () => setFlag(window.innerWidth < 600)
        
        responsive()
        window.addEventListener('resize', responsive)
        
        return () => window.removeEventListener('resize', responsive)
    }, [])

    return (
        <div className='sticky w-full p-5 h-[10vh] bg-gray-500 text-white flex justify-center items-center '>
            <div className="navbar w-full flex items-center justify-between">
                <div className="nav-left md:px-12 px-4">
                    <div className='cursor-pointer' onClick={() => router.push('/dashboard')}>True Feedback</div>
                </div>
                <div className="nav-right flex md:px-12 px-4">
                    {session ? (
                        <>
                            {!flag ? (
                                <>
                                    <div className="nav-item mx-5 flex items-center">{session.user.username}</div>
                                    <button onClick={() => signOut()}>Sign out</button>
                                    {pathname === '/dashboard' && (
                                        <button 
                                            onClick={() => router.push('/send-message')}
                                            className="send-btn px-10 ml-5 py-3 bg-black text-white rounded-2xl"
                                        >
                                            Send message
                                        </button>
                                    )}
                                </>
                            ) : (
                                <DropdownMenu>
                                    <DropdownMenuTrigger>{session.user.username}</DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>
                                            <button onClick={() => signOut()}>Sign out</button>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            {pathname === '/dashboard' && (
                                                <button onClick={() => router.push('/send-message')}>
                                                    Send message
                                                </button>
                                            )}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </>
                    ) : (
                        <div>
                            <button>Login</button>
                            <button 
                                onClick={() => router.push('/send-message')}
                                className="send-btn px-10 ml-5 py-3 bg-black text-white rounded-2xl"
                            >
                                Send message
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
