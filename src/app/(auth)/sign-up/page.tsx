"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/apiResponse"
import '@/app/css/signup.css'
import toast from "react-hot-toast"
import { useToast } from "@/components/ui/use-toast"

function Signup() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [debouncedUsername, setDebouncedUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState<{ success: boolean, message: string }>({ success: false, message: '' })
  const [isCheckinUsername, setIsCheckingUsername] = useState<true | false>(false)
  const [isSubmitting, setIsSubmitting] = useState<true | false>(false)
  const [data, setData] = useState({
    email: '',
    username: username,
    password: ''
  })
  const {toast : shadToast} = useToast()


  const delay = 1000

  const handleData = (e: any) => {
    e.preventDefault()
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  // const debouncedUsername = useDebounceValue(username, 500)

  const checkUniqueUsername = async () => {
    setIsCheckingUsername(true)
    try {
      const res = await axios.get(`/api/check-unique-username?username=${debouncedUsername}`)
      // console.log('unique username res :', res.data)
      setUsernameMessage(res.data)
      if (res.data.message.success) {
        setUsername(res.data.message)
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      // setUsernameMessage(axiosError.response?.data.message ?? 'error checking username')
    } finally {
      setIsCheckingUsername(false)
    }
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      setDebouncedUsername(data.username)
    }, delay)

    return () => clearTimeout(debounce)
  }, [data.username])

  useEffect(() => {
    if (debouncedUsername) {
      checkUniqueUsername()
    }
  }, [debouncedUsername])

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log('Submitting form...')
    setIsSubmitting(true)
    try {
      const res = await axios.post('/api/sign-up', data)
      console.log('res :', res.data)
      if (res.data.success) {
        // toast
        console.log('res :', res.data)
        // toast.success('otp sent please check your mail')
        shadToast({
          title: "OTP Sent",
          description: `Please check your mail for otp`,
        });
        router.replace(`/verify-code/${data.username}`)

      } else {
        // toast
        console.log('res :', res.data)
        shadToast({
          title: "Error sending otp",
          description: `some error occured please try again`,
        });
      }
    } catch (error) {
      console.log('error calling sign-up api', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
  }, [isCheckinUsername])

  return (
    <>
      <div className="sign-up h-[100vh] w-[100vw] flex flex-col justify-center items-center bg-neutral-300 ">
        <div data-theme='light' className="flex md:w-[400px] flex-col shadow-xl bg-neutral-200 justify-center items-center p-12 rounded-md">
          <div className="text-3xl py-5">True Feedback</div>
          <form onSubmit={(e) => handleSubmit(e)} className="" >
            <div className='username py-2 flex flex-col md:flex-row' >
              <label className="p-3 w-[120px]" htmlFor="username">username</label>
              <div>
                <input onChange={(e) => handleData(e)} value={data.username} placeholder="someone" className="border-2 p-2 rounded-full" name='username' type="text" />
                {isCheckinUsername ? <p className="text-center" >checking username...</p> : <p className={` text-center ${usernameMessage.success === true ? 'text-green-500':'text-red-600' }`}>{usernameMessage.message}</p>}
              </div>
            </div>
            <div className='email py-2 flex flex-col md:flex-row' >
              <label className="p-3 w-[120px]" htmlFor="email">Email</label>
              <input onChange={(e) => handleData(e)} value={data.email} placeholder="someone@gmail.com" className='border-2 p-2 rounded-full' name='email' type="email" />
            </div>
            <div className='password py-2 flex flex-col md:flex-row' >
              <label className="p-3 w-[120px]" htmlFor="password">password</label>
              <input onChange={(e) => handleData(e)} value={data.password} placeholder="123456" className='border-2 p-2 rounded-full' name='password' type="password" />
            </div>
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className=" bg-blue-500 px-12 mt-5 py-2 rounded-full"
              >
                {isSubmitting ? "Submitting..." : "Sign Up"}
              </button>
            </div>
          </form>
          <div className="text-center pt-5">
            <button onClick={() => router.push('/sign-in')} >signin</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup