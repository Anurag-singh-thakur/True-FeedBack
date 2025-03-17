import mongoose from "mongoose";


type ConnectionObject = {
    isConnected ?:number
}

const connection : ConnectionObject = {};

async function dbConnect (): Promise<void> {
    if(connection.isConnected){
        console.log("DataBase already connected");
        return;
    }
    try{

       const db = await mongoose.connect(process.env.MONGO_URI || '' );


      connection.isConnected =  db.connections[0].readyState
       console.log("Database connected" , db);


    }catch(err){

        console.log("Error in connecting to database", err);
        process.exit(1);

    }
}

export default dbConnect;