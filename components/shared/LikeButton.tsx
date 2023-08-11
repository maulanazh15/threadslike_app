"use client";
import { checkUserLikeThread, getThreadLikes, userDislikesThread, userLikesThread } from "@/lib/actions/user.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react";
import LikeLoading from "../loading/LikeLoading";


export default function LikeButton({ userId, threadId }: { stateLike?: boolean; userId: string; like?: number; threadId: string }) {
    const pathname = usePathname()
    const router = useRouter()
    async function getLikesAndStateLikes() {
        const like = await getThreadLikes(threadId)
        const stateLike = await checkUserLikeThread({ userId, threadId })
        return { like, stateLike }
    }

    const [loading, setLoading] = useState(true);
    const [likes, setLikes] = useState(0);
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const { like, stateLike } = await getLikesAndStateLikes();
                setLikes(like);
                setClicked(stateLike);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false); // Set loading to false when fetching is done
            }
        }

        fetchData();
    }, []); // Empty dependency array means this effect runs only once after component mount


    const handleLikeClick = async () => {
        if (!clicked) {
            setLikes(likes + 1);
            setClicked(true);
            await userLikesThread({ userId, threadId, path: pathname });
        } else {
            setLikes(likes - 1);
            setClicked(false);
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
