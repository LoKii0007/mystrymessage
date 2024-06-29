import mongoose from "mongoose";

const mongo_url = process.env.MONGO_URL || 'mongoDb.example.com'

type ConnectionObject = {
    isConnected? : number
}

const connection : ConnectionObject= {}

//void matalab doesnt care ki kis tarah/type ka adtaa aa rha hai
export default async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log('already connected to database')
        return
    }
    try {
        const db = await mongoose.connect(mongo_url , {})
        connection.isConnected= db.connections[0].readyState
        console.log('connected to monogoDB successfully')
        // console.log('db :', db)
    } catch (error) {
        console.log("database connevtion failed ",error)
        process.exit(1)
    }
}