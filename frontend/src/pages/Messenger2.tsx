import { useEffect, useState, useRef, SetStateAction } from "react";
import Chat from "../components/Chat";
import io from "socket.io-client";
import immer from "immer";
import AuthService from "../services/authentication-service";
import Auth from "./auth";
import axios from 'axios';

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

  const [rooms, setRooms] = useState<string[]>([]);


  function handleMessageChange(e) {
    setMessage(e.target.value);
  }

  const [messages, setMessages] = useState({});




  // useEffect(() => {
  //   const fetchChannels = async () => {
  //     try {
  //   const response = await this.channelService.findAll();

  //       const response = await axios.get('https://localhost:8000/channels');
  //       console.log(response.data);
  //       const channelNames = response.data.map(channel => channel.name);
  //       const allRooms = [...rooms, ...channelNames];
  //       setRooms(allRooms);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  
  //   fetchChannels();
  // }, []);
  
  
  // useEffect(() => {
  //   const fetchChannels = async () => {
  //     try {
  //       const response = await axios.get('https://localhost:8000/channel');
  //       console.log(response.data);
  //       setRooms(response.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  
  //   fetchChannels();
  // }, []);
  
 

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
  
  function removeChannel(channelName: string) {
    socketRef?.current?.emit("remove chan", channelName);
  
    setRooms((prevRooms) => {
      return prevRooms.filter((room) => room !== channelName);
    });
    setMessages((prevMessages) => {
      const newMessages = { ...prevMessages };
      delete newMessages[channelName];
      return newMessages;
    });
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
    if (currentChat && currentChat.chatName) {
      const newMessages = immer(messages, (draft) => {
        draft[currentChat.chatName].push({
          sender: AuthService.getUsername(),
          content: message,
        });
      });
      setMessages(newMessages);
    }}
    

  function roomJoinCallback(incomingMessages: any, room: string) {
    console.log("incoming::::", incomingMessages);
    const newMessages = immer(messages, (draft) => {
      if (!draft[currentChat.chatName]) {
        draft[currentChat.chatName] = [];
      }
        draft[room] = incomingMessages;

      draft[currentChat.chatName].push({
        sender: AuthService.getUsername(),
        content: message,
      });
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

  // useEffect(() => {
  //   const initialRooms = ["general", "random", "jokes", "javascript"];
  //   initialRooms.forEach((room) => createNewChannel(room));
  // }, []);
  useEffect(() => {
    // const initialRooms = ["general", "random", "jokes", "javascript"];
    // initialRooms.forEach((room) => createNewChannel(room));

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

    // socket.emit('join room', roomName, (messages) => {
    //   roomJoinCallback(messages, roomName);
    // });
  
    socketRef.current.on("connected users", (users: SetStateAction<never[]>) => {
      console.log("all users", users);
      setAllUsers(users);
    });

    socketRef.current.on("all chans", (chans: SetStateAction<never[]>) => {
      console.log("all chans", chans);
      setRooms(chans);
    
      socketRef.current.emit("join room", "general", (messages: any) =>
      roomJoinCallback(messages, "general")
    );

    socketRef.current.on("join room", ({ room, messages }) => {
      console.log("received join room event for room", room, messages);
      setMessages((prevMessages) => ({
        ...prevMessages,
        [room]: messages,
      }));
    });
    

    // socketRef.current.emit("join room", (messages: { channel: string; }) => {
    //   roomJoinCallback(messages,  messages.channel);

    //   console.log("received join room event", messages);
      
    //   setMessages((prevMessages) => ({
    //     ...prevMessages,
    //     [messages.channel]: messages.content,
    //   }));
    // });

    //   const initialMessages: { [key: string]: any[] } = {};
    //   chans.forEach((channelName: string) => {
    //     initialMessages[channelName] = [];
    //   });
    //   setMessages(initialMessages);
    });
    

  

    // socketRef.current.on("new chan", (users) => {
    //     console.log("new chan created", users);
    //     // createNewChannel(roomName);
  
    // });
    

    socketRef.current.on("new chan", (channelName) => {
      console.log("received new chan", channelName);
      setRooms((prevRooms) => [...prevRooms, channelName]);
      setMessages((prevMessages) => ({
        ...prevMessages,
        [channelName]: [],
      }));
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
        // yourId={socketRef.current ? socketRef.current.id : ""}
        yourId={socketRef.current ? AuthService.getUsername() : ""}
        allUsers={allUsers}
        joinRoom={joinRoom}
        rooms={rooms}
        createNewChannel={createNewChannel}
        removeChannel={removeChannel}
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
