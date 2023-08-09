"use server"

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
}


export async function createThread({
    text,
    author,
    communityId,
    path
}: Params) {

    try {
        connectToDB()

        const createdThread = await Thread.create(
            {
                text,
                author,
                community: null
            }
        )

        // Update user Model
        await User.findByIdAndUpdate(author, {
            $push: { threads: createdThread._id }
        })

        revalidatePath(path);

    } catch (error: any) {
        throw new Error("Error: " + error.message);

    }


}

// export async function fetchThreads(pageNumber = 1, pagesize = 20) {
//     connectToDB();

//     const skipAmount = (pageNumber - 1) * pagesize;

//     // Fetch the thread that have no parents
//     const threadsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
//         .sort({ createdAt: 'desc' })
//         .skip(skipAmount)
//         .limit(pagesize)
//         .populate({ path: 'author', model: User });

//     const totalThreadsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } });

//     let threads = await threadsQuery.exec();

//     // Sorting children of each thread by createdAt
//     threads = threads.map(thread => {
//         if (thread.children && thread.children.length > 0) {
//             thread.children = thread.children.sort((a, b) => a.createdAt - b.createdAt);
//         }
//         return thread;
//     });

//     const isNext = totalThreadsCount > skipAmount + threads.length;

//     return { threads, isNext };
// }

export async function fetchThreads(pageNumber = 1, pagesize = 20) {
    connectToDB();


    // Calulate the number of threads to skip
    const skipAmount = (pageNumber - 1) * pagesize

    // Fetch the thread that have no parents

    const threadsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
        .sort({ createdAt: 'desc' })
        .skip(skipAmount)
        .limit(pagesize)
        .populate({ path: 'author', model: User })
        .populate({
            path: 'children',
            populate: {
                path: 'author',
                model: User,
                select: "_id name parentId image"
            }
        })

    const totalThreadsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } })

    const threads = await threadsQuery.exec()

    const isNext = totalThreadsCount > skipAmount + threads.length

    return { threads, isNext }
}

export async function fetchThreadById(id: string) {
    connectToDB()

    try {

        const thread = await Thread.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: '_id id name image'
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: "_id id name parentId image"
                    },
                    {
                        path: 'children',
                        model: Thread,
                        populate: {
                            path: 'author',
                            model: User,
                            select: "_id id name parentId image"
                        }
                    }
                ]
            }).exec()

            return thread;

    } catch (error: any) {
        throw new Error(error.message);

    }

}

export async function addCommentToThread(
    threadId:string,
    commentText: string,
    userId: string,
    path: string
){
    try {
        const originalThread = await Thread.findById(threadId)

        if(!originalThread) {
            throw new Error("Thread not found");
            
        }

        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId
        })

        // Save the new Thread
        const savedCommentThread = await commentThread.save()

        // Update the original thread to include the new comment
        originalThread.children.push(savedCommentThread._id)

        // Save the original thread
        await originalThread.save()

        revalidatePath(path)

    } catch (error: any) {
        throw new Error(error.message);
        
    }
}