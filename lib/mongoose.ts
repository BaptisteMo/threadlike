import mongoose from 'mongoose'

let isConnected = false; // Variable pour checker si mongoose est connectée

export const connectToDB = async () => {

    mongoose.set('strictQuery', true)

    if(!process.env.MONGODB_URL) return console.log('MONGODB_URL Not found');
    if (isConnected) return console.log ('Déjà connecté à Mongo DB')

    try{
        await mongoose.connect(process.env.MONGODB_URL)
    } catch (error){
        console.log(error)
    }   
}