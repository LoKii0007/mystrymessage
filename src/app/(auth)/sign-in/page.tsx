'use client'

import {  signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function Signin() {
    const [text, setText] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(){
        setLoading(true)
        const res = await signIn('credentials', {
            redirect:false,
            identifier : text,
            password : password
        })
        if(res?.status === 200){
            toast.success(`logged in as ${text}`)
            router.push('/dashboard')
        }else{
            toast.error(`some error occured please try again`)
        }
        setLoading(false)
        // console.log('signin res :' , res)
    }

    useEffect(()=>{
    }, [loading])

    return (
        <>
            <div className=" h-[100vh] w-[100vw] flex flex-col justify-center items-center  bg-neutral-300">
                <div data-theme='light' className="flex w-[30vw] flex-col shadow-xl bg-neutral-200 justify-center items-center p-12 rounded-md" >
                    <div className="text-3xl py-5">True Feedback</div>
                <div className='email p-2 flex' >
                    <label className="p-3 w-[120px]"  htmlFor="email">Identifier</label>
                    <input onChange={(e) => {
                        e.preventDefault()
                        setText(e.target.value)
                        }} placeholder="email or username" className='border-2 px-2 rounded-full' name='email' type="email" />
                </div>
                <div className='password p-2 flex' >
                    <label className="p-3 w-[120px]" htmlFor="password">Password</label>
                    <input onChange={(e) => {
                        e.preventDefault()
                        setPassword(e.target.value)
                        }} placeholder="123456" className='border-2 px-2 rounded-full' name='password' type="password" />
                </div>
                <div className="text-center m-10">
                    <button disabled={loading} className=" bg-neutral-300 py-2 px-12 rounded-full" onClick={handleSubmit }>Sign in</button>
                </div>

                <button className="text-sm" onClick={()=>router.push('/sign-up')} >signup</button>
                </div>
            </div>
        </>
    )
}