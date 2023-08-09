"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";
import { Document } from "mongoose";

interface Params {
    userId: string,
    username: string,
    bio: string,
    name: string,
    image: string,
    path: string
}

export async function updateUser({
    userId,
    username,
    bio,
    name,
    image,
    path
}: Params): Promise<void> {
    connectToDB();
    try {
        await User.findOneAndUpdate({ id: userId },
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true,
            },
            { upsert: true }
        );

        if (path === '/profile/edit') {
            revalidatePath(path)
        }
    } catch (error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`);

    }

}
export async function login(email: string, password: string) {
    try {
        connectToDB(); // Connect to the database

        const bcrypt = require('bcrypt')
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return { success: false, message: "Invalid email" };
        }

        // Compare hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return { success: false, message: "Invalid password" };
        }

        // Login successful
        return { success: true, id: user.id };

    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "An error occurred" };
    }
}

export async function createUser({
    email,
    username,
    name,
    password,
    
} : {
    email: string,
    name: string,
    username: string,
    password: string,
}) {
    try {
        connectToDB(); // Connect to the database
        const bcrypt = require('bcrypt')

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

        // Create a new user instance with hashed password
        const newUser = new User({
            id: crypto.randomUUID(),
            email,
            username,
            name,
            password: hashedPassword,
        });

        // Save the user to the database
        await newUser.save();


    } catch (error) {
        console.error("Error creating user:", error);
    }

}

export async function fetchUser(userId: string) {
    try {
        connectToDB()

        return await User
        .findOne({id: userId})
        // .populate({
        //     path: 'communities',
        //     model: Community
        // })
    } catch (error: any) {
        throw new Error("Failed to fetch user: " + error.message);
        
    }
}

export async function fetchUserThreads(userId: string) {
    try {
        connectToDB()

        // TODO: Populate community
        const threads = await User.findOne({id: userId})
        .populate({
            path: 'threads',
            model: Thread,
            options: { sort: { createdAt: -1} },
            populate: {
                path: 'children',
                model: Thread,
                populate: {
                    path:'author',
                    model: User,
                    select:'name image id'
                }
            }
        })

        return threads
    } catch (error: any) {
        throw new Error(error.message);
               
    }
}

export async function fetchUsers({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = 'desc'
}: {
    userId: string,
    searchString?: string,
    pageNumber?: number,
    pageSize?: number,
    sortBy?: SortOrder
}) {
    try {
        connectToDB()

        const skipAmount = (pageNumber-1) * pageSize;

        const regex = new RegExp(searchString, "i")

        const query: FilterQuery<typeof User> = {
            id: { $ne: userId }
        }

        if(searchString.trim() !== '') {
            query.$or = [
                {username: {$regex: regex}},
                {name: {$regex: regex}}
            ]
        }

        const sortOptions = { createdAt: sortBy }

        const usersQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize)

        const totalUserCount = await User.countDocuments(query)

        const users = await usersQuery.exec()

        const isNext = totalUserCount > skipAmount + users.length

        return {users, isNext}
    } catch (error: any) {
        throw new Error(error.message);
        
    }
}

export async function getActivity(userId: string) {
    try {
        connectToDB()
        
        // find all threads created by the user
        const userThreads = await Thread.find({
            author: userId
        })

        // Collet all the child thread ids (replies) from 'children'

        const childThreadIds = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.children)
        }, [])

        const replies = await Thread.find({
            _id: { $in: childThreadIds},
            author: { $ne: userId}
        })
        .populate({
            path: 'author',
            model:User,
            select: 'name image _id'
        })

        return replies

    } catch (error: any) {
        throw new Error(error.message);
        
    }
}