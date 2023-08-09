"use client"
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
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from "next/image"
import { ChangeEvent, useState } from "react"
import { Textarea } from "../ui/textarea"
import { updateUser } from "@/lib/actions/user.action"
import { usePathname, useRouter } from "next/navigation"
import { CommentValidation, ThreadValidation } from "@/lib/validations/thread"
import { addCommentToThread, createThread } from "@/lib/actions/thread.action"
import { getRandomValues } from "crypto"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

interface Props {
    threadId: string,
    currentUserImg: string,
    currentUserId: string,
    fallbackname: string
}



export default function Comment({ threadId, currentUserImg, currentUserId, fallbackname }: Props) {
    const router = useRouter()
    const pathname = usePathname()

    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread: '',

        }
    })

    async function onSubmit(values: z.infer<typeof CommentValidation>) {
        await addCommentToThread(threadId, values.thread, JSON.parse(currentUserId), pathname)

        form.reset()
        // router.push("/")
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                className="comment-form">
                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-3 w-full">
                            <FormLabel>
                                {/* <Image
                                    src={currentUserImg}
                                    alt='current_user'
                                    width={24}
                                    height={24}
                                    className='rounded-full object-cover'
                                /> */}
                                <Avatar>
                                    <AvatarImage src={currentUserImg}/>
                                    <AvatarFallback>{
                                        fallbackname.split(" ").map(word => word[0])
                                    }</AvatarFallback>
                                </Avatar>
                            </FormLabel>
                            <FormControl className="border-none bg-transparent">
                                <Input
                                    type="text"
                                    placeholder="Comment..."
                                    className="no-focus text-light-1 outline-none"
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="comment-form_btn">Reply</Button>
            </form>
        </Form>
    )
}