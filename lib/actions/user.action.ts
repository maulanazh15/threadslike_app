"use server";

import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";

import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";

import { connectToDB } from "../mongoose";

export async function fetchUser(userId: string) {
    try {
        connectToDB();

        return await User.findOne({ id: userId }).populate({
            path: "communities",
            model: Community,
        });
    } catch (error: any) {
        throw new Error(`Failed to fetch user: ${error.message}`);
    }
}

interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
}

export async function updateUser({
    userId,
    bio,
    name,
    path,
    username,
    image,
}: Params): Promise<void> {
    try {
        connectToDB();

        await User.findOneAndUpdate(
            { id: userId },
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true,
            },
            { upsert: true }
        );

        if (path === "/profile/edit") {
            revalidatePath(path);
        }
    } catch (error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`);
    }
}

export async function fetchUserThreads(userId: string) {
    try {
        connectToDB();

        // Find all threads authored by the user with the given userId
        const threads = await User.findOne({ id: userId }).populate({
            path: "threads",
            model: Thread,
            populate: [
                {
                    path: "community",
                    model: Community,
                    select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
                },
                {
                    path: "children",
                    model: Thread,
                    populate: {
                        path: "author",
                        model: User,
                        select: "name image id", // Select the "name" and "_id" fields from the "User" model
                    },
                },
            ],
        });
        return threads;
    } catch (error) {
        console.error("Error fetching user threads:", error);
        throw error;
    }
}

// Almost similar to Thead (search + pagination) and Community (search + pagination)
export async function fetchUsers({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc",
}: {
    userId: string;
    searchString?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: SortOrder;
}) {
    try {
        connectToDB();

        // Calculate the number of users to skip based on the page number and page size.
        const skipAmount = (pageNumber - 1) * pageSize;

        // Create a case-insensitive regular expression for the provided search string.
        const regex = new RegExp(searchString, "i");

        // Create an initial query object to filter users.
        const query: FilterQuery<typeof User> = {
            id: { $ne: userId }, // Exclude the current user from the results.
        };

        // If the search string is not empty, add the $or operator to match either username or name fields.
        if (searchString.trim() !== "") {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } },
            ];
        }

        // Define the sort options for the fetched users based on createdAt field and provided sort order.
        const sortOptions = { createdAt: sortBy };

        const usersQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);

        // Count the total number of users that match the search criteria (without pagination).
        const totalUsersCount = await User.countDocuments(query);

        const users = await usersQuery.exec();

        // Check if there are more users beyond the current page.
        const isNext = totalUsersCount > skipAmount + users.length;

        return { users, isNext };
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}

export async function getActivity(userId: string) {
    try {
        connectToDB();

        // Find all threads created by the user
        const userThreads = await Thread.find({ author: userId });

        // Collect all the child thread ids (replies) from the 'children' field of each user thread
        const childThreadIds = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.children);
        }, []);

        // Find and return the child threads (replies) excluding the ones created by the same user
        const replies = await Thread.find({
            _id: { $in: childThreadIds },
            author: { $ne: userId }  // Exclude threads authored by the same user
        }).populate({
            path: "author",
            model: User,
            select: "name image _id",
        });

        return replies;
    } catch (error) {
        console.error("Error fetching replies: ", error);
        throw error;
    }
}
export async function getRepliesThreads(userId: string) {
    try {
        connectToDB();

        // Find all threads created by the user
        const replies = await Thread.find({ 
            author: userId,
            children: { $exists: true, $not: { $size: 0 } }, 
         }).populate([
            {
                path: "community",
                model: Community,
                select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
            },
            {
                path: "children",
                model: Thread,
                populate: {
                    path: "author",
                    model: User,
                    select: "name image id", // Select the "name" and "_id" fields from the "User" model
                },
            },
            {
                path: "author",
                model: User,
                select: 'name image id'
            }
        ]).sort({createdAt: 'desc'});

        // Collect all the child thread ids (replies) from the 'children' field of each user thread
        
        // Find and return the child threads (replies) excluding the ones created by the same user

        return replies;
    } catch (error) {
        console.error("Error fetching replies: ", error);
        throw error;
    }
}
export async function getLikedThreads(userId: string) {
    try {
        connectToDB()
        const likedThreads = await User.findOne({ id: userId }).populate({
            path: "likedThreads",
            model: Thread,
            populate: [
                {
                    path: "community",
                    model: Community,
                    select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
                },
                {
                    path: "children",
                    model: Thread,
                    populate: {
                        path: "author",
                        model: User,
                        select: "name image id", // Select the "name" and "_id" fields from the "User" model
                    },
                },
                {
                    path: "author",
                    model: User,
                    select: 'name image id'
                }
            ],
        }).sort({createdAt: 'desc'});
        // console.log(likedThreads)
        return likedThreads
    } catch (error: any) {
        throw new Error(error.message);

    }

}


export async function userLikesThread({ userId, threadId, path }: { userId: string, threadId: string, path: string }) {
    try {
        connectToDB()

        await User.findOneAndUpdate({
            id: userId
        }, { $push: { likedThreads: threadId } })
        const userid = await User.findOne({ id: userId }).select('_id')
        // console.log(userid._id)
        await Thread.findOneAndUpdate({ _id: threadId }, { $push: { likedByUsers: userid._id } })
        const like = await getThreadLikes(threadId)
        await Thread.findByIdAndUpdate(threadId, { likes: like })

        revalidatePath(path)
    } catch (error: any) {
        throw new Error(error.message);

    }
}

export async function userDislikesThread({ userId, threadId, path }: { userId: string, threadId: string, path: string }) {
    try {
        connectToDB();

        // Remove the threadId from the likedThreads array for the user
        await User.findOneAndUpdate(
            { id: userId },
            { $pull: { likedThreads: threadId } }
        );

        const userid = await User.findOne({ id: userId }).select('_id')
        await Thread.findOneAndUpdate(
            { _id: threadId },
            { $pull: { likedByUsers: userid._id } }
        );
        const like = await getThreadLikes(threadId)

        // Decrement the likes count for the thread
        await Thread.findByIdAndUpdate(threadId, { likes: like });

        revalidatePath(path)

    } catch (error: any) {
        throw new Error(error.message);
    }
}

export async function getThreadLikes(threadId: string) {
    try {
        connectToDB();

        const thread = await Thread.findById(threadId).select('likedByUsers');
        if (!thread) {
            return 0; // Thread not found
        }

        const likeCount = thread.likedByUsers.length;
        //   console.log(likeCount)
        return likeCount;
    } catch (error: any) {
        throw new Error(error.message);
    }
}
export async function getThreadLikesFast(threadId: string) {
    try {
        connectToDB();

        const { likes } = await Thread.findById(threadId).select('likes');

        return likes
    } catch (error: any) {
        throw new Error(error.message);
    }
}
export async function checkUserLikeThread({ userId, threadId }: { userId: string, threadId: string }) {
    try {
        const { likes } = await Thread.findById(threadId).select('likes')
        const stateLike = false
        const user = await User.findOne({ id: userId, likedThreads: threadId }).populate({
            path: "likedThreads",
            model: Thread,
            match: { _id: threadId },
            select: 'likes'
        });
        // console.log(user)
        if (user) {
            const stateLike = true
            const likes = user.likedThreads[0].likes

            return { stateLike, likes }
        }
        // console.log(!!user)
        return { stateLike, likes } // Returns true if user exists (liked the thread), false otherwise
    } catch (error: any) {
        throw new Error(error.message);
    }
}