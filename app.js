import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from './routes/user.route.js';
import postRoute from './routes/post.route.js';
import chatRoute from './routes/chat.route.js';
import messageRoute from './routes/message.route.js';
import path from "path";
import { fileURLToPath } from 'url';
import {Server} from "socket.io"

const app = express();

app.use(cors({origin: process.env.CLIENT_URL, credentials: true}))
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/test", testRoute);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);

//cors connection

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 
app.use(express.static(path.join(__dirname, "/client/dist")))
app.get("*", function(req, res){
    res.sendFile(path.join(__dirname, "/client/dist/index.html"))
})


app.listen(8800, ()=>{
    console.log("Server started!")
});

const io = new Server({
    cors: {
        origin:"https://homequest-ucjd.onrender.com",
    }
});


let onlineUser = [];

const addUser = (userId, socketId) =>{
    const userExists = onlineUser.find(user=> user.userId === userId);

    if (!userExists){
        onlineUser.push({userId, socketId});
    }
}

const removeUser = (socketId) => {
    onlineUser = onlineUser.filter(user=>user.socketId !== socketId)
}

//for private messages

const getUser = (userId) =>{
    return onlineUser.find((user)=> user.userId === userId);
}

io.on("connection", (socket)=>{
    // console.log(socket.id);
    //get the userid from the client and save it inside online user
    socket.on("newUser", (userId)=>{
        addUser(userId, socket.id)
        console.log(onlineUser)
    })
    
    socket.on("sendMessage", ({receiverId, data}) => {
        // console.log(receiverId);
        const receiver = getUser(receiverId)
        io.to(receiver.socketId).emit("getMessage", data);
    })
    socket.on("disconnect", ()=>{
        removeUser(socket.id)
    })
})

io.listen("8800")
