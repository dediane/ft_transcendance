// import styles from '@/styles/Messenger.module.css'
import Conversations from '@/components/Conversation';
import Message from '@/components/Message';
import styles from '../styles/Messenger.module.css';


import {useEffect, useState} from "react"
import io, {Socket} from "socket.io-client"
import MessageInput from "@/components/MessageInput"
import Messages from "@/components/Messages"


function Messenger() {
  const socket = io("http://localhost:8000")
  if (!socket)
    return;
  const [messages, setMessages] = useState<string[]>([])
  const send = (value: string) => {
        socket.emit("message", value)
    // socket.broadcast.to(roomId).emit('user-connected', userId);
  }
    const messageListener = (message: string) => {
    setMessages([...messages, message])
  }
    useEffect(() => {
    socket.on("message", messageListener)
    return () => socket.off("message", messageListener)
  }, [messageListener])

  // useEffect(() => {
  //   socket.on("connect", ...)
  //   return () => socket.off("message", messageListener)
  // }, [messageListener])
  // socket.on("connect", () => {
  //   console.log("[Chat] Client connected");

  //   socket.emit("updateChatUser", {
  //     id: user.id,
  //     username: user.username,
  //   });})
  return (

    <div className={styles.messenger}>
      <div className={styles.chatMenu}>
        <div className={styles.chatMenuWrapper}>
            <input placeholder="Search for friends" className={styles.chatMenuInput}/>
            <Conversations/>
            <Conversations/>
            <Conversations/>
            <Conversations/>
            {/* { <button>Add friends Button</button> }{styles.addFriends} */}
            
        </div>
      </div>
      <div className={styles.chatBox}>
        <div className={styles.chatBoxWrapper}>
          <div className={styles.chatBoxTop}>
          
              <Message isMyMessage={true} />
              <Message isMyMessage={false} />
              <Message isMyMessage={true} />
              <Message isMyMessage={true} />
              <Message isMyMessage={false} />
                <Messages messages={messages} />
          </div>
        <div className={styles.chatBoxBottom}></div>
        <div className={styles.message}>
                </div>
                <MessageInput send={send} />
        </div>
    </div>
      
          
      </div>
  );
}

export default Messenger;
