"use client"

import { Skeleton } from "@/components/ui/skeleton";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
export default function Loading() {
  const pathname = usePathname();

  return (

    <section>
      <h1 className="head-text mb-10">Search Page</h1>
      {/* {Serach bar} */}

      <div className="mt-14 flex flex-col gap-9">
        <div className="user-card">
          <div className="user-card_avatar">
            <Skeleton className="h-10 w-10 rounded-full" />

            <div className="flex flex-col gap-2 text-ellipsis">
              <Skeleton className="text-base-semibold text-light-1 w-20 h-5"></Skeleton>
              <Skeleton className="text-small-medium text-gray-1 w-10 h-3"></Skeleton>
            </div>
          </div>

          <Skeleton className="h-[30px] min-w-[74px] w-[74px] rounded-lg">

          </Skeleton>
        </div>
        <div className="user-card">
          <div className="user-card_avatar">
            <Skeleton className="h-10 w-10 rounded-full" />

            <div className="flex flex-col gap-2 text-ellipsis">
              <Skeleton className="text-base-semibold text-light-1 w-20 h-5"></Skeleton>
              <Skeleton className="text-small-medium text-gray-1 w-10 h-3"></Skeleton>
            </div>
          </div>

          <Skeleton className="h-[30px] min-w-[74px] w-[74px] rounded-lg">

          </Skeleton>
        </div>
        <div className="user-card">
          <div className="user-card_avatar">
            <Skeleton className="h-10 w-10 rounded-full" />

            <div className="flex flex-col gap-2 text-ellipsis">
              <Skeleton className="text-base-semibold text-light-1 w-20 h-5"></Skeleton>
              <Skeleton className="text-small-medium text-gray-1 w-10 h-3"></Skeleton>
            </div>
          </div>

          <Skeleton className="h-[30px] min-w-[74px] w-[74px] rounded-lg">

          </Skeleton>
        </div>
      </div>
    </section>
  )

}