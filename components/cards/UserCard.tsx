"use client"

import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

interface Props {
    id: string,
    name: string,
    username: string,
    imgUrl: string,
    personType: string
}

export default function UserCard({
    id, name, username, imgUrl, personType
}: Props) {

    const router = useRouter()

    return (
        <article className="user-card">
            <div className="user-card_avatar">
                <Avatar>
                    <AvatarImage src={imgUrl} />
                    <AvatarFallback>{
                        name.split(" ").map(word => word[0])
                    }</AvatarFallback>
                </Avatar>

                <div className="flex-1 text-ellipsis">
                    <h4 className="text-base-semibold text-light-1">{name}</h4>
                    <p className="text-small-medium text-gray-1">@{username}</p>
                </div>
            </div>

            <Button className="user-card_btn" onClick={() => {
                if (personType === "User") {
                    router.push('/profile/' + id)
                }
                else {
                    router.push('/communities/' + id)
                }
            }}>
                View
            </Button>

        </article>
    )
} 