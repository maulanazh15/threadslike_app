import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
    if (!params.id) return null;

    const user = await currentUser()

    if (!user) return null

    const userInfo = await fetchUser(user.id);

    if (!userInfo?.onboarded) redirect('/onboarding')

    const thread = await fetchThreadById(params.id)

    return (
        <section className="relative">
            <div>
                <ThreadCard
                    key={thread._id}
                    id={JSON.parse(JSON.stringify(thread._id))}
                    currentUserId={user?.id || ""}
                    content={thread.text}
                    parentId={thread.parentId}
                    author={thread.author}
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                    likes={thread.likes}
                />
            </div>

            <div className="mt-7">
                <Comment
                    threadId={thread.id}
                    currentUserImg={userInfo.image}
                    currentUserId={JSON.parse(JSON.stringify(userInfo._id))}
                    fallbackname={userInfo.name}

                />
            </div>

            <div className="mt-10">
                {
                    thread.children.map((childitem: any) => (
                        <ThreadCard
                            key={childitem._id}
                            id={JSON.parse(JSON.stringify(childitem._id))}
                            currentUserId={user?.id || ""}
                            content={childitem.text}
                            parentId={childitem.parentId}
                            author={childitem.author}
                            community={childitem.community}
                            createdAt={childitem.createdAt}
                            comments={childitem.children}
                            likes={childitem.likes}
                            isComment
                        />
                    ))
                }
            </div>

        </section>
    )
}