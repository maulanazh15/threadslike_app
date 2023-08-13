import ThreadCard from "@/components/cards/ThreadCard";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchThreads } from "@/lib/actions/thread.action";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  
  const result = await fetchThreads(1, 30);
  const user = await currentUser()


  return (
    <div>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">


        {result.threads.length === 0 ?
          (
            <p className="no-result">No threads found</p>
          ) : (
            <>
              {result.threads.map((thread) => (
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
              ))}
              
            </>
          )
        }
      </section>
    </div>
  )
}