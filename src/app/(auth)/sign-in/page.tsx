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
            <div className="sign-up h-[100vh] w-[100vw] flex flex-col justify-center items-center ">
                <div className='email py-2 flex flex-col' >
                    <label htmlFor="email">Identifier</label>
                    <input onChange={(e) => {
                        e.preventDefault()
                        setText(e.target.value)
                        }} placeholder="email or username" className='border-2' name='email' type="email" />
                </div>
                <div className='password py-2 flex flex-col' >
                    <label htmlFor="password">password</label>
                    <input onChange={(e) => {
                        e.preventDefault()
                        setPassword(e.target.value)
                        }} placeholder="123456" className='border-2' name='password' type="password" />
                </div>
                <div className="text-center m-10">
                    <button disabled={loading} className=" bg-blue-400 py-2 px-5 rounded-full" onClick={handleSubmit }>Sign in</button>
                </div>

                <button onClick={()=>router.push('/sign-up')} >signup</button>
            </div>
        </>
    )
}