"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import { UserValidation } from "../validations/user";
import Thread from "../models/thread.model";

interface Params {
    userId : string,
    username : string,
    name : string,
    bio : string,
    image : string,
    path : string,
}

export async function updateUser({

        userId,
        username,
        name,
        bio,
        image,
        path,
    }: Params) : Promise <void>{
    
        
    try{
        connectToDB();

        await User.findOneAndUpdate(
            
            {id: userId },
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded : true, 
            },
            {
                upsert : true, // mélange de update et insert : il va update si l'ID est reconnue et insérer de nouvelles colonnes
            }
            
        );

        if(path === '/profile/edit') {
            revalidatePath(path);
    }

  } catch (error: any){
    throw new Error (`Echec d'update ou de création du profil: ${error.message}`);
  } 
}

export async function fetchUser(userId : string){

        try{
            connectToDB();

            return await User.findOne({id: userId})
            //  .populate({
            //     path:'communities',
            //    model = Community
            // })
        } catch(error : any){
            throw new Error (`Erreur pour récupérer les infos user : ${error.message} `)
        }

}


export async function fetchUserPosts(userId : string){

    try {
        connectToDB();
        // On doit retrouver les posts créée par l'utilisateur auquel on consulte le profil avec userId
        const threads = await User.findOne({id : userId}).populate({
            path: 'threads',
            model : Thread, 
            populate:{
                path: 'children',
                model:  Thread, 
                populate: {
                    path: 'author',
                    model : User, 
                    select : 'name image id'
                },
            },
        })
        return threads;
    } catch(error: any){
            throw new Error (`Erreur pour récupérer les posts : ${error.message} `)    
        }


}
