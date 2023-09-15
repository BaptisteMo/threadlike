"use server"

import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import { skip } from "node:test";
import { StringifyOptions } from "querystring";
import { twJoin } from "tailwind-merge";

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
    const postsQuery = Thread.find({ parentId : {$in: [null, undefined]}})
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

export async function fetchThreadById(id:string) {
    connectToDB();

    try{

        //TODO Populate community later
        const thread = await Thread.findById(id)
            .populate({
                path:'author',
                model : User,
                select : "_id id name image"
            })
            .populate({
                path : 'children',
                populate : [{
                    path: 'author',
                    model : User,
                    select : "_id id name parentId image"
                    },
                    {
                        path : 'children',
                        model : Thread,
                        populate: {
                            path:'author',
                            model : User,
                            select : "_id id name parentId image"
                        }

                    }
            ]
            }).exec();

            return thread;
    }catch (error : any){
        throw new Error (`Erreur lors de la récupération du Thread : ${error.message}`)
    }
}

export async function addCommentToThread(
    threadId:string,
    commentText : string,
    userId : string,
    path : string,
    
    ) {

        connectToDB();

        try{
            // Retrouver le thread d'origine avec un son ID
            const originalThread = await Thread.findById(threadId);
            if(!originalThread){
                throw new Error('Thread non trouvé')
            }
            // Créer un nouveau thread avec un text à l'intérieur
            const commentThread = new Thread({
                text : commentText,
                author : userId, // author et parentId sont les props récupérer de la page.tsx
                parentId : threadId,
            })
            // On sauvegarde le nouveau thread 
            const savedCommentThread = await commentThread.save();
            // On update le thread parent
            originalThread.children.push(savedCommentThread._id);
            //On sauvegarde le push
            await originalThread.save();
            //On revalide le path
            revalidatePath(path);

        }catch(error : any){
            throw new Error (`Error d'ajout du commentaire au thread : ${error.message}`)
        }
    
}