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
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginValidation, UserValidation } from '@/lib/validations/user'
import * as z from "zod"
import Image from "next/image"
import { login, updateUser } from "@/lib/actions/user.action"
import { useRouter } from "next/navigation"



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

export default function LoginForm({ user, btnTitle }: Props) {

    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(LoginValidation),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    async function onSubmit(values: z.infer<typeof LoginValidation>) {
        

        // TODO: Update user profile
        const { id } = await login(values.email, values.password)

        router.push('/onboarding/' + id)

        
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col justify-start gap-10">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-3 w-full">
                            <FormLabel className="text-base-semibold text-light-2">
                                Email
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    className="account-form_input no-focus"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-3 w-full">
                            <FormLabel className="text-base-semibold text-light-2">
                                Password
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    className="account-form_input no-focus"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="bg-primary-500">Submit</Button>
            </form>
        </Form>
    )
}