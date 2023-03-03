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
  // const [messages, setMessages] = useState([]);

  // function send(message) {
  //   setMessages([...messages, message]);
  // }

  const chatRooms = [    { id: 1, name: "Room 1" },    { id: 2, name: "Room 2" },    { id: 3, name: "Room 3" },  ];

  const users = [    { id: 1, name: "User 1" },    { id: 2, name: "User 2" },    { id: 3, name: "User 3" },  ];

  // return (
  //   <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
  //     <div className="flex-1 flex flex-col justify-center items-center md:items-start py-8">
  //       <h1 className="text-3xl font-bold text-gray-800 mb-8">Group Chat</h1>
  //       <div className="bg-white rounded-lg shadow-md w-full md:w-96 h-96 flex flex-col overflow-y-scroll">
  //         <Messages messages={messages} />
  //       </div>
  //       {/* <div className="mt-4"> */}
  //       <div className="bg-white rounded-lg shadow-md w-full mt-4 flex flex-col overflow-y-scroll">

  //         <MessageInput send={send} />
  //       </div>
  //     </div>
  //   </div>
  // );

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







// //TBC
// import {useEffect, useState} from "react"
// import io, {Socket} from "socket.io-client"
// import MessageInput from "@/components/MessageInput"
// import Messages from "@/components/Messages"

// interface User {
//   id: string
//   name: string
// }

// interface Message {
//   id: string
//   sender: User
//   recipient: User
//   content: string
// }

// const Chat = () => {
//   const [socket, setSocket] = useState<Socket>()
//   const [messages, setMessages] = useState<Message[]>([])
//   const [users, setUsers] = useState<User[]>([])
//   const [selectedUser, setSelectedUser] = useState<User>()

//   const send = (value: string) => {
//     if (!selectedUser) return
//     socket?.emit("private-message", {
//       recipient: selectedUser.id,
//       content: value
//     })
//     setMessages([...messages, {
//       id: Date.now().toString(),
//       sender: { id: socket?.id || '', name: 'Me' },
//       recipient: selectedUser,
//       content: value
//     }])
//   }

//   useEffect(() => {
//     const newSocket = io("http://localhost:8001")
//     setSocket(newSocket)

//     // // to extract the sender ID from the message and display the sender's name along with the message:
//     // const messageListener = (message: { text: string, from: string, to?: string }) => {
//     //   const sender = users[message.from]
//     //   const text = message.to ? `[Private message from ${sender.name}]: ${message.text}` : `[${sender.name}]: ${message.text}`
//     //   setMessages([...messages, text])
//     // }
        
//     newSocket.on("connect", () => {
//       console.log(`Connected to server with ID ${newSocket.id}`)
//     })

//     newSocket.on("users", (users: User[]) => {
//       setUsers(users)
//     })

//     newSocket.on("private-message", (message: Message) => {
//       setMessages([...messages, message])
//     })

//     return () => {
//       newSocket.disconnect()
//     }
//   }, [])


//   return (
//     <div className="flex h-screen">
//       <div className="bg-gray-200 w-1/4 p-4">
//         <h2 className="font-bold text-xl mb-4">Users</h2>
//         <ul>
//           {users.map((user) => (
//             <li
//               key={user.id}
//               className={`${
//                 selectedUser === user ? "text-blue-500" : ""
//               } cursor-pointer`}
//               onClick={() => setSelectedUser(user)}
//             >
//               {user.name}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="w-3/4 p-4 flex flex-col">
//         <div className="flex-grow overflow-y-scroll">
//           {selectedUser ? (
//             <>
//               <h2 className="font-bold text-xl mb-4">
//                 Chatting with {selectedUser.name}
//               </h2>
//               <div className="flex flex-col space-y-4">
//                 {messages
//                   .filter((message) => message.sender === selectedUser || message.recipient === selectedUser)
//                   .map((message) => (
//                     <div
//                       key={message.id}
//                       className={`${
//                         message.sender === selectedUser ? "text-right" : "text-left"
//                       }`}
//                     >
//                       <span className="font-bold">{message.sender.name}: </span>
//                       <span>{message.content}</span>
//                     </div>
//                   ))}
//               </div>
//             </>
//           ) : (
//             <h2 className="font-bold text-xl mb-4">Select a user to start chatting</h2>
//           )}
//         </div>
//         <div className="flex-shrink-0">
//           <MessageInput send={send} />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Chat











// import { useState, useEffect, useRef } from "react";
// import io from "socket.io-client";

// const ENDPOINT = "http://localhost:8001";

// function ChatRoom() {
//   const [socket, setSocket] = useState(null);
//   const [username, setUsername] = useState("");
//   const [chatRooms, setChatRooms] = useState([]);
//   const [selectedRoom, setSelectedRoom] = useState("");
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [messageInput, setMessageInput] = useState("");

//   const messageBox = useRef(null);

//   const connectToChat = (username) => {
//     const newSocket = io(ENDPOINT, { query: { username } });
//     setSocket(newSocket);
//   };

//   const joinRoom = (roomId) => {
//     socket.emit("join-room", roomId);
//     setSelectedRoom(roomId);
//   };

//   const sendMessage = () => {
//     if (messageInput) {
//       socket.emit("private-message", {
//         content: messageInput,
//         to: selectedUser,
//       });
//       setMessages([
//         ...messages,
//         { sender: username, content: messageInput, to: selectedUser },
//       ]);
//       setMessageInput("");
//     }
//   };

//   useEffect(() => {
//     const username = prompt("Enter your username:");
//     setUsername(username);
//     connectToChat(username);
//   }, []);

//   useEffect(() => {
//     socket &&
//       socket.on("room-list", (roomList) => {
//         setChatRooms(roomList);
//         setSelectedRoom(roomList[0]?.id);
//       });
//   }, [socket]);

//   useEffect(() => {
//     socket &&
//       socket.on("user-list", (userList) => {
//         setUsers(userList);
//         setSelectedUser(userList[0]?.id);
//       });
//   }, [socket]);

//   useEffect(() => {
//     socket &&
//       socket.on("private-message", (message) => {
//         setMessages([...messages, message]);
//       });
//   }, [socket, messages]);

//   useEffect(() => {
//     messageBox.current.scrollTo(0, messageBox.current.scrollHeight);
//   }, [messages]);

//   return (
//     <div className="h-screen w-screen flex flex-col">
//       <div className="h-1/6 bg-gray-200 p-4 flex items-center">
//         <h2 className="font-bold text-xl">Chat Rooms</h2>
//         {chatRooms.map((room) => (
//           <div key={room.id} className="ml-4">
//             <button
//               className={`${
//                 selectedRoom === room.id
//                   ? "text-blue-500 underline"
//                   : "text-gray-700"
//               }`}
//               onClick={() => joinRoom(room.id)}
//             >
//               {room.name}
//             </button>
//           </div>
//         ))}
//       </div>
//       <div className="h-4/6 bg-white p-4 flex flex-col">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="font-bold text-xl">
//             {selectedUser
//               ? `Chat with ${selectedUser}`
//               : "Select a user to start chatting"}
//           </h2>
//           {selectedUser && (
//             <button
//               className="bg-blue-500 text-white px-4 py-2 rounded"
//               onClick={sendMessage}
//             >
//               Send
//             </button>
//           )}
//         </div>
//         <div className="h-full flex flex-col overflow-y-scroll" ref={messageBox}> 
//         {messages.map((message, i) => (
//             <div
//             key={i}
//             className={`flex ${message.sender === socketId ? "justify-end" : "justify-start"} items-center`}
//             >
//            <div
//              className={`p-2 rounded-lg ${
//                message.sender === socketId
//                ? "bg-blue-200 text-right"
//                : "bg-gray-200 text-left"
//               }`}
//               >
//              <p className="text-sm">{message.content}</p>
//              <p className="text-xs text-gray-600">
//                {message.sender === socketId ? "You" : message.sender}
//              </p>
//            </div>
//          </div>
        
//            ))};
