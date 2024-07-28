'use client'

import { ApiResponse } from '@/types/apiResponse'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useToast } from '@/components/ui/use-toast'
import '@/app/css/common.css'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react'

function Page() {
    const [message, setMessage] = useState<string>('')
    const [url, setUrl] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const { toast: shadToast } = useToast()


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
        if (isValidURL(url) && message.length > 4) {
            setLoading(true)
            const segments = url.split('/')
            const username = segments[segments.length - 1]
            console.log(username)
            const res = await axios.post<ApiResponse>('/api/send-message', { username: username, content: message })
            if (res.data.success) {
                setLoading(false)
                shadToast({
                    title: 'message sent successfully',
                });
                setUrl('')
                setMessage('')

            }
            else if (!res.data.isAcceptingMessages) {
                setLoading(false)
                shadToast({
                    title: res.data.message,
                    // description: "The URL has been copied successfully!",
                });
            }
        } else if (!isValidURL(url)) {
            toast.error('please enter a valid url', {
                duration: 1000
            })
        } else {
            toast.error('message should be of at least 5 characters', {
                duration: 1000
            })
        }
    }

    const formSchema = z.object({
        url: z.string().url({ message: "enter valid url" }),
        message: z.string().min(5, {
            message: "message must be at least 5 characters.",
        }),

    })
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            url: '',
            message: ''
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log(data)
        setLoading(true)
        const segments = data.url.split('/')
        const username = segments[segments.length - 1]
        console.log(username)
        try {
            const res = await axios.post<ApiResponse>('/api/send-message', { username: username, content: data.message })
            if (res.data.success) {
                shadToast({
                    title: 'Sucess',
                    description: 'message sent successfully'
                });
            }
        } catch (error) {
            console.log(error)
            shadToast({
                title: 'Error',
                description: ' some error occured'
            });
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div data-theme="cupcake" className="send w-full p-7 md:p-12 h-[90vh] flex flex-col items-center">
                <div className=' w-[100%] bg-neutral-200 p-5 md:p-12 rounded-xl'>
                    <div className="heading text-center pb-12 text-2xl md:text-4xl">Send Anonymous Messages</div>
                    {/* <div className='md:w-[70%]text-xl flex flex-col md:flex-row md:items-center' >
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
                            <button disabled={loading} onClick={handleSendMessage} className='px-10 py-3 bg-black text-white rounded-2xl ' >{loading ? 'sending ...' : 'send Message'}</button>
                        </div>
                    </div> */}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Enter Unique Url</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Enter message</FormLabel>
                                        <FormControl>
                                            <Input className='' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button disabled={loading} type="submit">{loading ? 'sending...' : 'send Message'}</Button>
                        </form>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default Page