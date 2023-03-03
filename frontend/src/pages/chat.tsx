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
  



  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const chatRooms = [    { id: 1, name: "Room 1" },    { id: 2, name: "Room 2" },    { id: 3, name: "Room 3" },  ];

  const users = [    { id: 1, name: "User 1" },    { id: 2, name: "User 2" },    { id: 3, name: "User 3" },  ];

  return (
    <div className="h-screen flex">
      <div className="w-1/4 bg-gray-200 p-4">
        <h2 className="font-bold text-xl mb-4">Chat Rooms</h2>
        <ul className="mb-8">
          {chatRooms.map((room) => (
            <li
              key={room.id}
              className={`${
                selectedRoom === room.id ? 'text-blue-500' : ''
              } cursor-pointer`}
              onClick={() => setSelectedRoom(room.id)}
            >
              {room.name}
            </li>
          ))}
        </ul>
        <h2 className="font-bold text-xl mb-4">Users</h2>
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              className={`${
                selectedUser === user.id ? 'text-blue-500' : ''
              } cursor-pointer`}
              onClick={() => setSelectedUser(user.id)}
            >
              {user.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-grow bg-white overflow-hidden flex flex-col">
        <div className="flex-grow overflow-y-scroll">
          <Messages messages={messages} />
        </div>
        <div className="mt-auto">
          <MessageInput send={send} />
        </div>
      </div>
    </div>
  );
}


export default Chat;