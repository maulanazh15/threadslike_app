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
import { ThreadValidation } from "@/lib/validations/thread"
import { createThread } from "@/lib/actions/thread.action"
import { getRandomValues } from "crypto"

interface Props {
    user: {
        id: string,
        objectid: string,
        username: string,
        name: string,
        bio: string,
        image: string
    }
    btnTitle: string
}




export default function PostThread({ userId } : { userId: string}) {
    const router = useRouter()
    const pathname = usePathname()
    
    const form = useForm({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            thread: '',
            accountId: userId
        }
    })

    async function onSubmit(values: z.infer<typeof ThreadValidation>) {
        await createThread({ 
            text: values.thread,
            author: userId,
            communityId: null,
            path: pathname,

        })
        router.refresh()
        router.push("/")
    }

    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} 
        className="mt-10 flex flex-col justify-start gap-10">
            <FormField
                control={form.control}
                name="thread"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-3 w-full">
                        <FormLabel className="text-base-semibold text-light-2">
                            Content
                        </FormLabel>
                        <FormControl >
                            <Textarea  
                            rows={10}
                            className="account-form_input no-focus"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit" className="bg-primary-500">Post Thread</Button>
        </form>
    </Form>
    )
}