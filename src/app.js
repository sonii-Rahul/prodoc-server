import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session"
import path from "path";
import { fileURLToPath } from "url";

//resolving dir name 

const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)
console.log(__dirname);

const app = express();

app.use(cors({
    origin: 'https://prodoc.onrender.com/',
    credentials: true
}));
app.use(express.json({
    limit: "100kb",
    extended: true
}
));
 app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));
app.use(express.static("public"));
app.use(cookieParser());

app.use(session({
    secret:process.env.secret,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure:true,
        maxAge: 1000 * 60 * 60 * 24 ,
        sameSite: 'lax',
    }
}))


// routes

import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users", userRouter);
export default app;

//exporting app

//use the cliend app
app.use(express.static(path.join(__dirname,'/client/dist')))

//render client 

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'/client/dist/index.html'))
})
