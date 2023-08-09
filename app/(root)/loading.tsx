"use client"

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    

    return (
    <div>
      <h1 className="head-text text-left">Loading...</h1>

      <section className="mt-9 flex flex-col gap-10">
        <Skeleton className="w-[100px] h-[20px] rounded-full" />
        <Skeleton className="w-[100px] h-[20px] rounded-full" />

      </section>
    </div>
    )
}