import mongoose  from "mongoose";

const dbconnect = async () =>{
    try{
        const connectionInstance = await mongoose.connect(process.env.DBURL || "mongodb://127.0.0.1:27017/gogreen");
        console.log("DATABASE CONNECT " + connectionInstance);
    }catch{
        console.error("ERROR : Database connection failed");
        process.exit(1);
    }
}

export default dbconnect;