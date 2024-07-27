'use client'

import { ApiResponse } from '@/types/apiResponse'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import '@/app/css/common.css'

function Page() {
    const [message, setMessage] = useState<string>('')
    const [url, setUrl] = useState<string>('')
    const [loading, setLoading] = useState(false)

    async function handleSuggestMessages() {
        const res = await axios.post('/api/suggest-messages')
        console.log(res)
    }

    function isValidURL(urlString: any) {
        try {
            new URL(urlString);
            return true;
        } catch (e) {
            return false;
        }
    }

    async function handleSendMessage() {
        if (isValidURL(url) && message.length > 5) {
            setLoading(true)
            const segments = url.split('/')
            const username = segments[segments.length - 1]
            console.log(username)
            const res = await axios.post<ApiResponse>('/api/send-message', { username: username, content: message })
            if (res.data.success) {
                setLoading(false)
                toast.success('message sent successfully', {
                    duration: 1000
                })
            }
            else if(!res.data.isAcceptingMessages){
                setLoading(false)
                toast((t) => (
                    <span>
                      {res.data.message}
                    </span>
                ));
            }
        } else if (!isValidURL(url)) {
            toast.error('please enter a valid url', {
                duration: 1000
            })
        }else{
            toast.error('message should be of at least 5 characters', {
                duration: 1000
            })
        }
    }

    return (
        <>
            <div data-theme="cupcake" className="send w-full p-7 md:p-12 h-[90vh] flex flex-col items-center">
                <div className=' w-[100%] bg-neutral-200 p-5 md:p-12 rounded-xl'>
                <div className="heading text-center pb-12 text-2xl md:text-4xl">Send Anonymous Messages</div>
                <div className='md:w-[70%]text-xl flex flex-col md:flex-row md:items-center' >
                    <div className='md:w-[10vw] ' >Enter unique link</div>
                    <input data-theme="cupcake" type='text'
                        className='border-b-2 md:m-5 ml-1 mt-2 px-2 bg-neutral-200 border-black'
                        onChange={(e) => {
                            e.preventDefault()
                            setUrl(e.target.value)
                        }}
                        value={url} />
                </div>
                <div className='md:w-[70%]text-xl mt-5 flex flex-col md:flex-row md:items-center'>
                    <div className='md:w-[10vw] ' >Enter your message</div>
                    <input data-theme="cupcake" type="text"
                        className='border-b-2 md:m-5 ml-1 mt-2 px-2 bg-neutral-200 border-black'
                        onChange={(e) => {
                            e.preventDefault()
                            setMessage(e.target.value)
                        }}
                        value={message}
                        minLength={5}
                    />
                </div>
                <div className='my-10 send-bottom flex justify-center' >
                    <div className=''>
                    <button disabled={loading} onClick={handleSendMessage} className='px-10 py-3 bg-black text-white rounded-2xl ' >{loading ? 'sending ...':'send Message'}</button>
                    </div>
                    {/* <div className='w-[50%]'>
                    <button className='px-10 py-3 bg-black text-white rounded-2xl ' onClick={handleSuggestMessages} >suggest Messages</button>
                    </div> */}
                </div>
                </div>
            </div>
        </>
    )
}

export default Page