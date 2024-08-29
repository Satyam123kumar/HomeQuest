import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext.jsx";
import apiRequest from "../../lib/apiRequest.js";
import {format} from "timeago.js";
import { SocketContext } from "../../context/SocketContext.jsx";
import { useNotificationStore } from "../../lib/notificationStore.js";


function Chat({ chats }) {
  const [chat, setChat] = useState(null);
  // console.log(chats);
  const {currentUser} = useContext(AuthContext);

  const {socket} = useContext(SocketContext);

  const messageEndRef = useRef();
  const decrease = useNotificationStore(state=>state.decrease);

  useEffect(()=>{
    messageEndRef.current?.scrollIntoView({behavior: "smooth"})
  }, [chat])

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest('/chat/'+id);
      //means that chat is unseen
      if (!res.data.seenBy.includes(currentUser.id)){
        decrease();
      }
      setChat({...res.data, receiver})
    } catch (err) {
        console.log("err in Chat.jsx file", err)
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const text = formData.get("text");

    if (!text) return;
    try {
        const res = await apiRequest.post("/message/"+chat.id, {text})
        setChat(prev=>({...prev, messages:[...prev.messages, res.data]}))
        e.target.reset();

        socket.emit("sendMessage", {
          receiverId: chat.receiver.id,
          data: res.data,
        })
    } catch (err) {
        console.log("err in chat handlesubmit", err);
    }
  }

  useEffect(()=>{

    const read = async () => {
      try {
        await apiRequest.put("/chat/read/" + chat.id);
      } catch (err) {
        console.log(err);
      }
    };

    if (chat && socket){
      socket.on("getMessage", (data)=>{
        if (chat.id === data.chatId){
          setChat((prev)=>({...prev, messages:[...prev.messages, data]}));
          //if we receive the messages we wnat to read it, otherwise it will be yellow
          read();
        }
      })
    }

    //this is clean up function used to prevent the re-rendering the messages
    return () => {
      socket.off("getMessage");
    };
  },[socket, chat])

  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {
          chats?.map((c) => (
            <div className="message" key={c.id}
              style={{
                backgroundColor: c.seenBy.includes(currentUser.id) || chat?.id === c.id ? "white" : "#fecd514e"
              }}
              onClick={()=>handleOpenChat(c.id, c.receiver)}
            >
              <img
                src={c.receiver.avatar || "/noAvatar.jpg"}
                alt=""
              />
              <span>{c.receiver.username}</span>
              <p>{c.lastMessage}</p>
            </div>
          ))
        }
        </div>

      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img
                src={chat.receiver.avatar || "noAvatar.jpg"}
                alt=""
              />
              {chat.receiver.username}
            </div>
            <span className="close" onClick={() => setChat(null)}>X</span>
          </div>
          <div className="center">
            {chat.messages.map((message)=> (
              <div className="chatMessage"
              style={{
                alignSelf: message.userId === currentUser.id ? "flex-end" : "flex-start",
                textAlign: message.userId === currentUser.id ? "right" : "left"
              }}
               key={message.id}>
              <p>{message.text}</p>
              <span>{format(message.createdAt)}</span>
            </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>
          <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text"></textarea>
            <button>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
