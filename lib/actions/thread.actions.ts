"use server"

import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import { skip } from "node:test";

interface Params {

    text : string, 
    author : string, 
    communityId : string | null,
    path : string,
}


export async function createThread({ text, author, communityId, path }: Params){

 try{
    connectToDB();
    const createdThread = await Thread.create(
      {  text,
        author,
        community: null,
    });

// Update user model
        await User.findByIdAndUpdate(author, {
            $push : { threads : createdThread._id }
        })
        revalidatePath(path);
    
 }catch (error : any){
    throw new Error (`Errore creating thread : ${error.message}`)
 }
}


export async function fetchPosts(pageNumber= 1, pageSize : 20) {
    connectToDB();
    // On calcul le nombre de poste à passer pour passer à la page suivante

    const skipAmount = (pageNumber - 1) * pageSize

    // Récupérer uniquement les threads de top level, pas les commentaires
    const postsQuery = Thread.find({ parenId : {$in: [null, undefined]}})
        .sort({ createdAt : 'desc'})
        .skip (skipAmount)
        .limit (pageSize)
        .populate({path:'author', model: User})
        .populate ({ 
            path: 'children',
            populate: {
                path: 'author',
                model : User,
                select: "_id name parentId image", 
            }
    })
    const totalPostsCount = await Thread.countDocuments({ parenId : {$in: [null, undefined] } });

    const posts = await postsQuery.exec();
    const isNext = totalPostsCount > skipAmount + posts.length;

    return {
        posts,
        isNext
    }
}