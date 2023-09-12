import mongoose from "mongoose";
import { strictObject } from "zod";

//Ça sert à définir les pré-requis pour pouvoir envoyer les données au serveur mongodb

const userSchema = new mongoose.Schema({

    id : {
        type : String,
        required : true
    },
    
    username : {
        type : String,
        required : true,
        unique : true,
    },
    name : {
        type : String,
        required : true
    },
    image : String, 
    bio : String, 
    threads : [     // c'est pour définir qu'un "user" peut posséder plusieurs références de threads : relation one to many
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Thread'
        }
    ],

    onboarded : {
        type : Boolean,
        default : false

    },

    communities : [     // c'est pour définir qu'un "user" peut appartenir à plusieurs communautés références de threads : relation one to many
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Thread'
        }
    ],


});

const User = mongoose.models.User || mongoose.model ('User', userSchema); // On l'écrit comme ça car la première fois 'mongoose.models.User n'existe pas donc il va le créer en se basant sur 'User Schema' mais à chaque fois qu'on l'appelle par la suite il saura quel User update dans la bdd

export default User;