'use client'

import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

export default function Verify() {

    const [isVerifying, setIsVerifying] = useState(false)
    const params = useParams<{username : string}>()
    const [otp, setOtp] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log('verifying')
        setIsVerifying(true)
        try {
            const res = await axios.post('/api/verify-code', {username : params.username,code : otp })
            console.log(res.data)
            if(res.data.success){
                toast.success('verified successfully , please login')
                router.push('/sign-in')
            }else{
                toast.success(`${res.data.message}`)
                console.log(res.data.message)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsVerifying(false)
        }
    }

    return (
        <>
            <div className="verify-code h-[100vh] w-[100vw] flex justify-center items-center" >
                <form onSubmit={(e) => handleSubmit(e)} className="" >
                    <div className='password py-2 pb-5 flex flex-col' >
                        <label htmlFor="string">Code</label>
                        <input onChange={(e)=>setOtp(e.target.value)} className='border-2' name='otp' type="string" />
                    </div>
                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={isVerifying}
                            className=" bg-blue-500 px-5 py-2 rounded-full"
                        >
                            {isVerifying ? "verifying..." : "Verify code"}
                        </button>
                    </div>
                </form>

            </div>
        </>)
}