import dotenv from "dotenv"
import connectDB from './db/index.js'
import app from "./app.js"
const port=3000;


dotenv.config({
    path: './.env'
})


 connectDB()
.then(()=>{
    app.listen(port,()=>{
        console.log(` server is running on the port ${port}`);
    })
})
.catch((err)=>{
    console.log("mongo db connecttion failed ",err)
})

app.listen(process.env.PORT,()=>{
    console.log(`app is Listining to the por number ${port}`)
})

