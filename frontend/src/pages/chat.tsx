import {useEffect, useState} from "react"
import io, {Socket} from "socket.io-client"
import MessageInput from "@/components/MessageInput"
import Messages from "@/components/Messages"
function Chat(){
  const [socket, setSocket] = useState<Socket>()
  const [messages, setMessages] = useState<string[]>([])
  
  const send = (value: string) => {
    socket?.emit("message", value)
  }
  useEffect(() => {
    const newSocket = io("http://localhost:8001")
    setSocket(newSocket)
  }, [setSocket])
  const messageListener = (message: string) => {
    setMessages([...messages, message])
  }
  useEffect(() =>{
    socket?.on("message", messageListener)
    return () => socket?.off("message", messageListener)
  }, [messageListener])
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <div className="flex-1 flex flex-col justify-center items-center md:items-start py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Group Chat</h1>
        <div className="bg-white rounded-lg shadow-md w-full md:w-96 h-96 flex flex-col overflow-y-scroll">
          <Messages messages={messages} />
        </div>
        {/* <div className="mt-4"> */}
        <div className="bg-white rounded-lg shadow-md w-full mt-4 flex flex-col overflow-y-scroll">

          <MessageInput send={send} />
        </div>
      </div>
    </div>
  );
  }


export default Chat;