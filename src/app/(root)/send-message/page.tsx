'use client'

import { ApiResponse } from '@/types/apiResponse'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

function Page() {
    const [message, setMessage] = useState<string>('')
    const [url, setUrl] = useState<string>('')

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
            const segments = url.split('/')
            const username = segments[segments.length - 1]
            console.log(username)
            const res = await axios.post<ApiResponse>('/api/send-message', { username: username, content: message })
            if (res.data.success) {
                toast.success('message sent successfully', {
                    duration: 3000
                })
            }
        } else if (!isValidURL(url)) {
            toast.error('please enter a valid url', {
                duration: 3000
            })
        }else{
            toast.error('message should be of at least 5 characters', {
                duration: 3000
            })
        }
    }

    return (
        <>
            <div className="send">
                <div className="heading">send anonymous mesages</div>
                <div>
                    enter url
                    <input type='text'
                        className='border-2'
                        onChange={(e) => {
                            e.preventDefault()
                            setUrl(e.target.value)
                        }}
                        value={url} />
                </div>
                <div>
                    <div>enter message</div>
                    <input type="text"
                        className='border-2'
                        onChange={(e) => {
                            e.preventDefault()
                            setMessage(e.target.value)
                        }}
                        value={message}
                        minLength={5}
                    />
                </div>
                <button onClick={handleSendMessage} className='px-10 py-3 bg-black text-white rounded-2xl ' >send Message</button>
                <div className="suggest">
                    <button onClick={handleSuggestMessages} >suggest</button>
                </div>
            </div>
        </>
    )
}

export default Page