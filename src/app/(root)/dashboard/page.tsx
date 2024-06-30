'use client'

import Card from '@/components/card'
import axios from 'axios';
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { ApiResponse } from '@/types/apiResponse';
import toast from 'react-hot-toast';

interface Message {
  content: string;
  createdAt: string;
}

function Page() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState<true | false>(false)
  const [acceptingMessages, setAcceptingMessages] = useState<true | false>(false)

  const { data: session } = useSession()
  const uniqueUrl = `https://mystrymessage.vercel.app/${session?.user.username}`

  async function getMessages(){
    const res = await axios.get('/api/get-messages')
    if(res.data.success){
      setMessages(res.data.messages)
    }
  }

  function copyToClipboard() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(uniqueUrl).then(() => {
        toast.success('copied to clipboard')
        console.log('Text copied to clipboard', uniqueUrl);
      }).catch(err => {
        toast.error('Failed to copy text')
        console.error('Failed to copy text: ', err);
      });
    }
  }

  async function handleAcceptingMessage(msg: boolean | undefined) {
    const res = await axios.post('/api/accept-messages', { acceptMessages: msg })
    if (res) {
      console.log(res.data.message)
    }
  }

  function handleIsAccepting(e:any) {
    getMessages()
    setAcceptingMessages(!acceptingMessages)
    handleAcceptingMessage(acceptingMessages)
  }

  async function getAcceptingMessage() {
    const res = await axios.get('/api/accept-messages')
    if (res.data.success) {
      console.log(res.data.isAcceptingMessages)
      setAcceptingMessages(res.data.isAcceptingMessages)
    }
  }

  useEffect(() => {
    getMessages()
    getAcceptingMessage()
  }, [])

  function handleRefresh(){
    getMessages()
  }

  return (
    <>
      <div className="dashboard w-[100vw] h-[90vh] flex px-12 flex-col justify-around items-center">
        <div className="dashoboard-top w-full">
          <div className='text-5xl'>User dashboard</div>
          <div className='text-2xl'>Copy your unique link</div>
          <div className='flex justify-between items-center  border-black border-2 p-2 bg-slate-300 w-[90%]'>
            <div className='link' >{uniqueUrl}</div>
            <button onClick={copyToClipboard} className='copy-btn '>copy</button>
          </div>
          <div className="accept flex">
            <input className="accept-switch" onClick={(e)=>handleIsAccepting(e)} checked={acceptingMessages} type="checkbox" role="switch" />
            <label className="" htmlFor="accept-switch">accepting message : {acceptingMessages ? 'on' : 'off'}</label>
          </div>
          <button onClick={()=>handleRefresh()} >refresh</button>
        </div>
        <div className="dashoboard-bottom flex flex-row flex-wrap justify-start">
          {messages.length > 0
            &&
            messages.map((msg, index) => (
              <Card key={index} message={msg} />
            )
            )
          }
        </div>
      </div>
    </>
  )
}

export default Page