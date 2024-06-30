"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/apiResponse"
import '@/app/css/signup.css'

function Signup() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [debouncedUsername, setDebouncedUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState<{success : boolean, message : string}>({success : false, message : ''})
  const [isCheckinUsername, setIsCheckingUsername] = useState<true | false>(false)
  const [isSubmitting, setIsSubmitting] = useState<true | false>(false)
  const [data, setData] = useState({
    email : '', 
    username : username,
    password : ''
  })

  const delay = 1000

  const handleData = (e:any)=>{
    e.preventDefault()
    setData((prev)=>({
      ...prev,
      [e.target.name] : e.target.value
    }))
  }

  // const debouncedUsername = useDebounceValue(username, 500)

  const checkUniqueUsername = async () => {
    setIsCheckingUsername(true)
    try {
      const res = await axios.get(`/api/check-unique-username?username=${debouncedUsername}`)
      // console.log('unique username res :', res.data)
      setUsernameMessage(res.data)
      if(res.data.message.success){
        setUsername(res.data.message)
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      // setUsernameMessage(axiosError.response?.data.message ?? 'error checking username')
    } finally {
      setIsCheckingUsername(false)
    }
  }

  useEffect(()=>{
    const debounce = setTimeout(() => {
      setDebouncedUsername(data.username)
    }, delay)

    return ()=> clearTimeout(debounce)
  }, [data.username])

  useEffect(() => {
    if (debouncedUsername) {
      checkUniqueUsername()
    }
  }, [debouncedUsername])

  const handleSubmit = async (e : any) => {
    e.preventDefault(); 
  console.log('Submitting form...')
    setIsSubmitting(true)
    try {
      const res = await axios.post('/api/sign-up', data)
      console.log('res :', res.data)
      if (res.data.success) {
        // toast
        console.log('res :', res.data)
        router.replace(`/verify-code/${data.username}`)

      } else{
        // toast
        console.log('res :', res.data)
    }
    } catch (error) {
      console.log('error calling sign-up api', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="sign-up h-[100vh] w-[100vw] flex flex-col justify-center items-center ">
        <form  onSubmit={(e)=>handleSubmit(e)} className="" >
          <div className='username py-2 flex flex-col' >
             <label htmlFor="username">username</label>
             <input onChange={(e)=>handleData(e)} value={data.username} className={`${usernameMessage.success ? 'name-yes' : 'name-not'} border-2 `} name='username' type="text" />
             <p >{usernameMessage.message}</p>
          </div>
          <div className='email py-2 flex flex-col' >
             <label htmlFor="email">someone@gmail.com</label>
             <input onChange={(e)=>handleData(e)} value={data.email} className='border-2' name='email' type="email" />
          </div>
          <div className='password py-2 flex flex-col' >
             <label htmlFor="password">password</label>
             <input onChange={(e)=>handleData(e)} value={data.password} className='border-2' name='password' type="password" />
          </div>
          <div className="text-center">
          <button 
            type="submit"
            disabled={isSubmitting}
            className=" bg-blue-500 px-5 py-2 rounded-full"
            >
          {isSubmitting ? "Submitting..." : "Sign Up"}
        </button>
          </div>
        </form>
        <div  className="text-center pt-5">
          <button onClick={()=>router.push('/sign-in')} >signin</button>
          </div>
      </div>
    </>
  )
}

export default Signup