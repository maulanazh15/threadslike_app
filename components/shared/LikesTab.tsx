import { fetchUserThreads, getLikedThreads } from "@/lib/actions/user.action"
import { redirect } from "next/navigation"
import ThreadCard from "../cards/ThreadCard"
import { fetchCommunityThreads } from "@/lib/actions/community.action"

interface Props {
    currentUserId: string,
    accountId: string,
    accountType: string
}


export default async function LikesTab({
    currentUserId,
    accountId,
    accountType }: Props) {
    
    let result: any

    result = await getLikedThreads(currentUserId)

    if (!result) redirect('/')
    return (
        <section className="mt-9 flex flex-col gap-10">
            {
                result.likedThreads.map((thread: any) => (
                    <ThreadCard
                        key={thread._id}
                        id={JSON.parse(JSON.stringify(thread._id))}
                        currentUserId={currentUserId}
                        content={thread.text}
                        parentId={thread.parentId}
                        author={
                            accountType === 'User' ?
                            {name: result.name, image: result.image, id: result.id} :
                            {name: thread.author.name, image:thread.author.image, id: thread.author.id}
                        } // todo 
                        community={
                            accountType === "Community" ?
                            { name: result.name, id: result.id, image: result.image} : thread.community
                        } // todo
                        createdAt={thread.createdAt}
                        comments={thread.children}
                    />
                ))
            }
        </section>
    )
}