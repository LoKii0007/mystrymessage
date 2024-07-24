'use client'

import Card from '@/components/card'
import axios from 'axios';
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { ApiResponse } from '@/types/apiResponse';
import toast from 'react-hot-toast';
import '@/app/css/common.css'
import { useRouter } from 'next/navigation';

interface Message {
  content: string;
  createdAt: string;
  _id : string
}

function Page() {
  const [messages, setMessages] = useState<Message[]>([])
  const router = useRouter()
  const [loading, setLoading] = useState<true | false>(false)
  const [acceptingMessages, setAcceptingMessages] = useState<true | false>()

  const { data: session } = useSession()
  const uniqueUrl = `https://mystrymessage.vercel.app/${session?.user.username}`

  async function getMessages(){
    const res = await axios.get('/api/get-messages')
    if(res.data.success){
      setMessages(res.data.messages)
      console.log(res.data)
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
    setLoading(true)
    const res = await axios.post('/api/accept-messages', { acceptMessages: msg })
    if (res) {
      console.log(res.data)
      setLoading(false)
      if(res.data.success) setAcceptingMessages(res.data.isAcceptingMessages)
    }
  }

  async function getAcceptingMessage() {
    const res = await axios.get('/api/accept-messages')
    if (res.data.success) {
      console.log(res.data.isAcceptingMessages)
      setAcceptingMessages(res.data.isAcceptingMessages)
    }
  }

  async function handleDelete(messageId: string){
    // setMessages(messages.filter(msg => msg._id !== messageId))
    const res = await axios.delete(`/api/delete-message/${messageId}`)
    console.log(res)
    if (res.data.success) {
      setMessages(messages.filter(msg => msg._id !== messageId));
      toast.success('Message deleted successfully');
    } else {
      toast.error('Failed to delete message');
    }
  }

  useEffect(() => {
    getMessages()
    getAcceptingMessage()
  }, [])

  useEffect(()=>{
   console.log(acceptingMessages)
  }, [acceptingMessages])

  function handleRefresh(){
    getMessages()
  }

  return (
    <div data-theme="cupcake" className='main w-[100vw] flex justify-center '>
      <div className="dashboard  w-[70vw] h-[90vh] flex flex-col justify-start items-start">
        <div className="dashoboard-top w-full my-5">
          {/* <div className='text-5xl mb-4'>User dashboard</div> */}
          <div data-theme="cupcake" className='text-2xl my-4'>Copy your unique link</div>
          <div data-theme="cupcake" className='flex justify-between items-center pl-2 rounded-md bg-neutral-200 w-[100%]'>
            <div className='link' >{uniqueUrl}</div>
            <button onClick={copyToClipboard} className='copy-btn rounded-md'>copy</button>
          </div>
          <div className="accept flex my-4 w-[100%] justify-between items-center">
            <div className="accept-left">
            <input type="checkbox" className="toggle" disabled={loading} onClick={()=>handleAcceptingMessage(!acceptingMessages)} checked={acceptingMessages} />
            {/* <input className="accept-switch" onClick={(e)=>handleIsAccepting(e)} checked={acceptingMessages} type="checkbox" role="switch" /> */}
            <label className="px-3" htmlFor="accept-switch">Accepting messages : {acceptingMessages ? 'on' : 'off'}</label>
            </div>
            <button onClick={()=>router.push('/send-message')} className="send-btn px-10 py-3 bg-black text-white rounded-2xl ">Send message</button>
            <div className="accept-right">
            <button onClick={()=>handleRefresh()} className=' rounded-md copy-btn'>Refresh</button>
            </div>
          </div>
        </div>
        <div className="dashbord-body w-full">
          <div className="heading text-2xl font-medium flex">
            <div className='mr-5' >Messages</div>
            </div>
        <div className="dashoboard-bottom w-full flex flex-row flex-wrap justify-between">
          {messages.length > 0
            ?
            messages.map((msg, index) => (
              <Card key={index} message={msg} onDelete={()=>handleDelete(msg._id)} />
            )
            )
            :
            <div className='text-center w-full p-12' >you dont have any messages yet </div>
          }
        </div>
        </div>
      </div>
    </div>
  )
}

export default Page