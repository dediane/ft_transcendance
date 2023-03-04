// import styles from '@/styles/Messenger.module.css'
import Conversations from '@/components/Conversation';
import Message from '@/components/Message';
import styles from '../styles/Messenger.module.css';


import {useEffect, useState} from "react"
import io, {Socket} from "socket.io-client"
import MessageInput from "@/components/MessageInput"
import Messages from "@/components/Messages"

const socket = io("http://localhost:8000")

  
function Messenger() {
  const [messages, setMessages] = useState<string[]>([])
  const send = (value: string) => {
    socket?.emit("message", value)
  }
    const messageListener = (message: string) => {
    setMessages([...messages, message])
  }
    useEffect(() => {
    socket?.on("message", messageListener)
    return () => socket?.off("message", messageListener)
  }, [messageListener])
  return (
    <div className={styles.messenger}>
      <div className={styles.chatMenu}>
        <div className={styles.chatMenuWrapper}>
            <input placeholder="Search for friends" className={styles.chatMenuInput}/>
            <Conversations/>
            <Conversations/>
            <Conversations/>
            <Conversations/>
        </div>
      </div>
      <div className={styles.chatBox}>
        <div className={styles.chatBoxWrapper}>
          <div className={styles.chatBoxTop}>
          
            <div className={styles.message}>
              <Message isMyMessage={true} />
            </div>
            <div className={styles.message}>
              <Message isMyMessage={false} />
            </div>
            <div className={styles.message}>
              <Message isMyMessage={true} />
            </div>
            <div className={styles.message}>
              <Message isMyMessage={true} />
            </div>
            <div className={styles.message}>
              <Message isMyMessage={false} />
            </div>
          </div>
          <div className={styles.chatBoxBottom}></div>

                <Messages messages={messages} />
                <MessageInput send={send} />
        </div>
      
          
      </div>
    </div>
  );
}

export default Messenger;
