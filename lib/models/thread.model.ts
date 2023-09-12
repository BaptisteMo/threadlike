import mongoose from "mongoose";
import { strictObject } from "zod";

//Ça sert à définir les pré-requis pour pouvoir envoyer les données au serveur mongodb

const threadSchema = new mongoose.Schema({
    text: {type: String, required : true},
    author: {
        type : mongoose.Schema.Types.ObjectId,
        ref:'User',
        required : true,     
    },
    community: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Community'
    },
    createAt: {
        type : Date,
        default : Date.now
    }, 
    parentId : {
        type : String,
    }, 
    children : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Thread'
        }
    ]
});

const Thread = mongoose.models.Thread || mongoose.model ('Thread', threadSchema); // On l'écrit comme ça car la première fois 'mongoose.models.User n'existe pas donc il va le créer en se basant sur 'User Schema' mais à chaque fois qu'on l'appelle par la suite il saura quel User update dans la bdd

export default Thread;