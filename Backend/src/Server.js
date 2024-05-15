import dotenv from "dotenv";
import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import dbconnect from "./db/connection.db.js";

const app = express();
app.use(express.json({limit: "20kb"}));
app.use(express.urlencoded({extended: true, limit: "20kb"}));
app.use(express.static("public"));
app.use(cookieParser());

dotenv.config();

app.use(cors({
    origin : process.env.CORS,
}));

// route import

import { router } from "./routes/user.routes.js";

app.use("/api/users", router)


dbconnect().then(() =>{
    const port = process.env.PORT || 8000
    app.listen(port, () =>{
        console.log("Database connected susseccfully");
    })
}).catch((error) =>{
    console.log(`ERROR : DB connection failed...` , error);
})
