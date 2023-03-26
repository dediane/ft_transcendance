import { useEffect, useState, useRef, SetStateAction } from "react";
import Chat from "../components/Chat";
import io from "socket.io-client";
import immer from "immer";
import AuthService from "../services/authentication-service"
//backend/src/auth/auth.service
const initialMessagesState = {
  general: [],
  random: [],
  jokes: [],
  javascript: [],
};

function Messenger2() {
//   const [AuthService.getUsername(), setAuthService.getUsername()] = useState("");
  const [connected, setConnected] = useState(false);
  const [currentChat, setCurrentChat] = useState({
    isChannel: true,
    chatName: "general",
    receiverId: "",
  });
  const [connectedRooms, setConnectedRooms] = useState(["general"]);
  const [allUsers, setAllUsers] = useState([]);
  const [messages, setMessages] = useState(initialMessagesState);
  const [message, setMessage] = useState("");
  const socketRef = useRef();

  function handleMessageChange(e) {
    setMessage(e.target.value);
  }

//   useEffect(() => {
//     setMessage("");
//   }, [messages]);

  function sendMessage() {
    const payload = {
      content: message,
      to: currentChat.isChannel ? currentChat.chatName : currentChat.receiverId,
      sender: AuthService.getUsername(),
      chatName: currentChat.chatName,
      isChannel: currentChat.isChannel,
    };
    socketRef.current.emit("send message", payload);
    const newMessages = immer(messages, (draft) => {
      draft[currentChat.chatName].push({
        sender: AuthService.getUsername(),
        content: message,
      });
    });
    setMessages(newMessages);
  }

  

  function roomJoinCallback(incomingMessages: any, room: string) {
    console.log("incoming::::", incomingMessages);
    const newMessages = immer(messages, (draft) => {
      draft[room] = incomingMessages;
    });
    setMessages(newMessages);
  }

  function joinRoom(room: string) {
    const newConnectedRooms = immer(connectedRooms, (draft) => {
      draft.push(room);
    });
    socketRef.current.emit(
      "join room",
      room,
      (messages: any) => roomJoinCallback(messages, room)
    );
    setConnectedRooms(newConnectedRooms);
  }

  function toggleChat(currentChat: SetStateAction<{ isChannel: boolean; chatName: string; receiverId: string; }>) {
    if (!messages[currentChat.chatName]) {
      const newMessages = immer(messages, (draft) => {
        draft[currentChat.chatName] = [];
      });
      setMessages(newMessages);
    }
    setCurrentChat(currentChat);
  }



  useEffect(() => {
    socketRef.current = io("http://localhost:8000");
    //ocketRef.current = io.connect("http://localhost:8000");
    socketRef.current.on("connect", () => {
      console.log("connected to server");
      setConnected(true);
    });

        // socketRef.current.on("connection", (socketRef) => {
    socketRef.current.emit("join server", AuthService.getUsername());
    socketRef.current.emit("join room", "general", (messages: any) =>
        roomJoinCallback(messages, "general")
    );
       
    socketRef.current.on("new user", (users) => {
      console.log("all users", users);
      setAllUsers(users);
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



    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  
  let body;
  if (connected) {
    body = (
      <Chat
        message={message}
        handleMessageChange={handleMessageChange}
        sendMessage={sendMessage}
        yourId={socketRef.current ? socketRef.current.id : ""}
        allUsers={allUsers}
        joinRoom={joinRoom}
        connectedRooms={connectedRooms}
        currentChat={currentChat}
        toggleChat={toggleChat}
        messages={messages[currentChat.chatName]}
      />
    );
  }

    return(<div className="App">{body}</div>);
}

export default Messenger2;
