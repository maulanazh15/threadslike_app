"use client"

import { useState, useEffect } from "react";
import LikeLoading from "../loading/LikeLoading";
import { checkUserLikeThread, userLikesThread, userDislikesThread } from "@/lib/actions/user.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export default function LikeButton({ userId, threadId, like, stateLike }: { noSsr?: boolean, stateLike: boolean; userId: string; like: number; threadId: string }) {
    const pathname = usePathname();
    const router = useRouter()

    const [loading, setLoading] = useState(false);
    const [likes, setLikes] = useState(like);
    const [clicked, setClicked] = useState(stateLike);

    const fetchData = async () => {
        try {
            setLoading(true)
            const { likes, stateLike } = await checkUserLikeThread({ userId, threadId });
            setLikes(likes);
            setClicked(stateLike);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false); // Set loading to false when fetching is done
        }
    };

    useEffect(() => {
        fetchData();
    }, [pathname]); // Empty dependency array means this effect runs only once after component mount

    const handleLikeClick = async () => {
        const updatedLikes = clicked ? likes - 1 : likes + 1;

        setLikes(updatedLikes);
        setClicked(!clicked);

        if (!clicked) {
            await userLikesThread({ userId, threadId, path: pathname });
        } else {
            await userDislikesThread({ userId, threadId, path: pathname });
        }
    };

    const heartImageSrc = clicked ? "/assets/heart-filled.svg" : "/assets/heart-gray.svg";

    return (
        <div className={`flex flex-row items-center gap-1 transition-opacity ${clicked ? "opacity-100 duration-300 ease-in-out" : "opacity-50"}`}>
            {loading ? (
                <LikeLoading />
            ) : (
                <>
                    <Image src={heartImageSrc} alt="heart" width={24} height={24} className="cursor-pointer object-contain" onClick={handleLikeClick} />
                    <p className='text-subtle-medium text-gray-1'>{likes}</p>
                </>
            )}
        </div>
    );
}
