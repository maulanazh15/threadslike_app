import UserCard from "@/components/cards/UserCard";
import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchUser, fetchUsers, getActivity } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs"
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation"


export default async function Page() {
    const user = await currentUser()

    if (!user) return null

    const userInfo = await fetchUser(user.id);


    if (!userInfo?.onboarded) redirect('/onboarding')

    // getActivity 

    const activity = await getActivity(userInfo._id)


    return (
        <section>
            <h1 className="head-text mb-10">Activity Page</h1>

            <section className="mt-10 flex flex-col gap-5">
                {
                    activity.length > 0 ? (
                        <>
                            {
                                activity.map((activity) => (
                                    <Link key={activity._id} href={'/thread/' + activity.parentId}>
                                        <article className="activity-card">
                                            <Avatar className="w-[30px] h-[30px]">
                                                <AvatarImage src={activity.author.image} />
                                                <AvatarFallback>{
                                                    activity.author.name.split(" ").map((word: string) => word[0])
                                                }</AvatarFallback>
                                            </Avatar>
                                            <p className="!text-small-regular text-light-1">
                                                <span className="mr-1 text-primary-500">{activity.author.name}</span>{' replied to your thread'}
                                            </p>
                                        </article>
                                    </Link>
                                ))
                            }
                        </>
                    ) : (
                        <p className="!text-base-regular text-light-3">No activity yet</p>
                    )
                }
            </section>
        </section>
    )

}