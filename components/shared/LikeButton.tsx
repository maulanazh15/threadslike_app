"use client";
import { userDislikesThread, userLikesThread } from "@/lib/actions/user.action";
import Image from "next/image";
import { revalidatePath } from "next/cache"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react";

export default function LikeButton({ userId, like, stateLike, threadId }: { stateLike: boolean; userId: string; like: number; threadId: string }) {
    const pathname = usePathname()

    const [likes, setLikes] = useState(like);
    const [clicked, setClicked] = useState(stateLike);

    useEffect(() => {
        setLikes(like);
        setClicked(stateLike);
    }, [like, stateLike]);

    const handleLikeClick = async () => {
        if (!clicked) {
            await userLikesThread({ userId, threadId, path: pathname });
            setLikes(likes + 1);
            setClicked(true);
        } else {
            await userDislikesThread({ userId, threadId, path: pathname });
            setLikes(likes - 1);
            setClicked(false);
        }
    };

    const heartImageSrc = clicked ? "/assets/heart-filled.svg" : "/assets/heart-gray.svg";

    return (
        <div className={`flex flex-row items-center gap-1 transition-opacity ${clicked ? "opacity-100 duration-300 ease-in-out" : "opacity-50"}`}>
            <Image src={heartImageSrc} alt="heart" width={24} height={24} className="cursor-pointer object-contain" onClick={handleLikeClick} />
            <p className='text-subtle-medium text-gray-1'>{likes}</p>
        </div>
    );
}
