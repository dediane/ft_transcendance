import { useEffect, useState, useRef } from "react";
import Chat from "../components/Chat";
import io from "socket.io-client";
import immer from "immer";
import AuthService from "../services/authentication-service";
import Auth from "./auth";

function Messenger2() {
  const [connected, setConnected] = useState(false);
  const [currentChat, setCurrentChat] = useState({
    isChannel: true,
    chatName: "general",
    receiverId: "",
  });
  const [connectedRooms, setConnectedRooms] = useState(["general"]);
  const [allUsers, setAllUsers] = useState([]);
  const [message, setMessage] = useState("");
  const socketRef = useRef();

  function handleMessageChange(e) {
    setMessage(e.target.value);
  }

  const [messages, setMessages] = useState({});

  const [rooms, setRooms] = useState<string[]>([]);

  useEffect(() => {
    const initialRooms = ["general", "random", "jokes", "javascript"];
    initialRooms.forEach((room) => createNewChannel(room));
  }, []);

 

  function createNewChannel(channelName: string) {
    if (channelName.trim() === "") { // check if channelName is empty
      return;
    }
  
    const datachan = {
      creator : AuthService.getId(),
      roomName : channelName,
    }
    socketRef?.current?.emit("create chan", datachan);
  
    setRooms((prevRooms) => {
      if (!prevRooms.includes(channelName)) {
        return [...prevRooms, channelName];
      }
      return prevRooms;
    });
    setMessages((prevMessages) => ({
      ...prevMessages,
      [channelName]: [],
    }));
  }
  
  

  function sendMessage() {
    const payload = {
      content: message,
      to: currentChat.isChannel ? currentChat.chatName : currentChat.receiverId,
      sender: AuthService.getUsername(),
      senderid: AuthService.getId(),
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
    socketRef.current.emit("join room", room, (messages: any) =>
      roomJoinCallback(messages, room)
    );
    setConnectedRooms(newConnectedRooms);
  }

  function toggleChat(currentChat) {
    if (!messages[currentChat.chatName]) {
      const newMessages = immer(messages, (draft) => {
        draft[currentChat.chatName] = [];
      });
      setMessages(newMessages);
    }
    setCurrentChat(currentChat);
  }

  useEffect(() => {
    const userdata = {
      id: AuthService.getId(),
      name: AuthService.getUsername(),
    };

    socketRef.current = io("http://localhost:8000");

    socketRef.current.on("connect", () => {
      console.log("connected to server");
      setConnected(true);
    });

    socketRef.current.emit("join server", userdata);
    socketRef.current.emit("join room", "general", (messages: any) =>
      roomJoinCallback(messages, "general")
    );

    socketRef.current.on("connected users", (users) => {
      console.log("all users", users);
      setAllUsers(users);
    });
   

    socketRef.current.on("new chan", (users) => {
      if (roomName) {
        console.log("new chan created", users);
        createNewChannel(roomName);
      }
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




// useEffect(() => {
//   createNewChannel("javascript");
//   createNewChannel("TEST");
// }, []);


  let body;
  if (connected) {
    
    body = (
      <Chat
        message={message}
        handleMessageChange={handleMessageChange}
        sendMessage={sendMessage}
        // yourId={socketRef.current ? socketRef.current.id : ""}
        yourId={socketRef.current ? AuthService.getUsername() : ""}
        allUsers={allUsers}
        joinRoom={joinRoom}
        createNewChannel={createNewChannel}
        connectedRooms={connectedRooms}
        rooms={rooms}
        currentChat={currentChat}
        toggleChat={toggleChat}
        messages={messages[currentChat.chatName]}
      />
    );
  }

    return(<div className="App">{body}</div>);
}

export default Messenger2;
