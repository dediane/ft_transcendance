// import styles from '@/styles/Messenger.module.css'
// import Conversations from '@/components/Conversation';
// import Message from '@/components/Message';
// import styles from '../styles/Messenger.module.css';


import {useEffect, useState, useRef, SetStateAction} from "react"
import Form from "../components/UsernameForm"
import Chat from "../components/Chat"
import io from "socket.io-client"

import immer from "immer"
            

// const socket = io("http://localhost:8000")


// const users: any[] = [];

// const messages = {
//   general: [],
//   random: [],
//   jokes: [],
//   javascript: [],
// };

// socket.on('connection', socket => {
//   //grace a socket.on, genere un nouveau socket qui represente une personne

//   socket.on("join server", (username) => {
//     const user = {
//       username,
//       id: socket.id,
//     };
//     users.push(user);
//     socket.emit('new user', users);
//   });
//   // });

//   socket.on('join room', (roomName, cb) => {
//     socket.join(roomName);
//     cb(messages[roomName]);
//   });

//   socket.on("send message", ({ content, to, sender, chatName, isChannel }) => {
//     if (isChannel) {
//       const payload = {
//         content,
//         chatName,
//         sender,
//       };
//       socket.to(to).emit("new message", payload);
//     } else {
//       const payload = {
//         content,
//         chatName: sender,
//         sender,
//       };
//       socket.to(to).emit("new message", payload);
//     }
//     if (messages[chatName]) {
//       messages[chatName].push({
//         sender,
//         content,
//       });
//     }
//   });
// //  socket.on("disconnect", () => {
// //     users = users.filter(u => u.id !== socket.id);
// //     socket.emit("new user", users);
// //     });
// });


const initialMessagesState = {
    general : [],
    random : [],
    jokes: [],
    javascript: []
}

function Messenger2() {
    const [username, setUsername] = useState("")
    const [connected, setConnected] = useState(false);
    const [currentChat, setCurrentChat] = useState({isChannel: true, chatName: "general", receiverId: ""});
    const [connectedRooms, setConnectedRooms] = useState(["general"]);
    const [allUsers, setAllUsers] = useState([]);
    const [messages, setMessages] = useState(initialMessagesState);
    const [message, setMessage] = useState("");
    const socketRef = useRef();

    function handleMessageChange(e)
    {
        setMessage(e.target.value);
    }

    useEffect(() => {
        setMessage("");
    }, [messages]);

    function sendMessage(){
        const payload = {
            content: message,
            to: currentChat.isChannel? currentChat.chatName : currentChat.receiverId,
            sender: username,
            chatName: currentChat.chatName,
            isChannel: currentChat.isChannel
        };
        socketRef.current.emit("send message", payload);
        const newMessages = immer(messages, draft => {
            draft[currentChat.chatName].push({
                sender: username,
                content: message
            });
        });
        setMessages(newMessages);
    }

    function roomJoinCallback(incomingMessages: any, room: string) {
        const newMessages = immer(messages, draft => {
            draft[room] = incomingMessages;
        });
        setMessages(newMessages);
    }
    
    function joinRoom(room: string){
        const newConnectedRooms = immer(connectedRooms, draft => {
            draft.push(room);
        });
        socketRef.current.emit("join room", room, (messages) => roomJoinCallback(messages, room));
        setConnectedRooms(newConnectedRooms);
    }

    function toggleChat(currentChat: SetStateAction<{ isChannel: boolean; chatName: string; receiverId: string }>){
        if(!messages[currentChat.chatName])
        {
            const newMessages = immer(messages, draft => {
                draft[currentChat.chatName] = [];
            });
            setMessages(newMessages);
        }
        setCurrentChat(currentChat);
    }

    function handleChange(e){
        setUsername(e.target.value);
    };

    function connect() {
        setConnected(true);
        socketRef.current = io.connect("http://localhost:8000");
        if (!socketRef.current) return;
        // socketRef.current.on("connection", (socketRef) => {
          socketRef.current.emit("join server", username);
          socketRef.current.emit("join room", "general", (messages) =>
            roomJoinCallback(messages, "general")
          );
          socketRef.current.on("new user", (allUsers) => {
            setAllUsers(allUsers);
          });
          socketRef.current.on("new message", ({ content, sender, chatName }) => {
            setMessages((messages) => {
              const newMessages = immer(messages, (draft) => {
                if (draft[chatName]) {
                  draft[chatName].push({ content, sender });
                } else {
                  draft[chatName] = [{ content, sender }];
                }
              });
              return newMessages;
            });
          });
        // });
      }
      
        
    
    let body;
    if (connected)
    {
        body = (
            <Chat
            message={message}
            handleMessageChange={handleMessageChange}
            sendMessage={sendMessage}
            yourId={socketRef.current? socketRef.current.id : ""}
            allUsers={allUsers}
            joinRoom={joinRoom}
            // connection={connect}
            connectedRooms={connectedRooms}
            currentChat={currentChat}
            toggleChat={toggleChat}
            messages={messages[currentChat.chatName]}
            />
        );
    }
    else
    {
        body = (
            <Form username={username} onChange={handleChange} connect={connect} />
        );
    }
    return(<div className="App">{body}</div>);
}

export default Messenger2;
