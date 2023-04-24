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
  
 
  function createNewChannel(data: any) {
    const datachan = {
      creator: AuthService.getId(),
      roomName: data.chatName,
      password: data.password,
    };
    socketRef?.current?.emit("create chan", datachan);
  
    setRooms((prevRooms) => {
      if (!prevRooms.includes(data.chatName)) {
        return [...prevRooms, data.chatName];
      }
      return prevRooms;
    });
    setMessages((prevMessages) => ({
      ...prevMessages,
      [data.chatName]: [],
    }));
  }
  
  function removeChannel(channelName: string) {
    socketRef?.current?.emit("remove chan", currentChat.chatName, channelName);
  
    setRooms((prevRooms) => {
      return prevRooms.filter((room) => room !== channelName);
    });
    setMessages((prevMessages) => {
      const newMessages = { ...prevMessages };
      delete newMessages[channelName];
      return newMessages;
    });
  }


  function inviteMember()
  {
    const payload = {
      AdminId: AuthService.getId(), //check si tout le monde peut inviter non admin y compris
      username : username,
      chatName : currentChat.chatName
    };
    socketRef?.current?.emit("invite to chan", payload); //member invited a envoyer a la database pour modif
    setInvitedMembers((prevRooms) => {
      if (!prevInvitedMembers.includes(username)) {
        return [...prevInvitedMembers, username];
      }
      return prevInvitedMembers;
    });

  }
  

  function removeMember(username : string)
  {
    const payload = {
      AdminId: AuthService.getId(),
      username : username,
      chatName : currentChat.chatName
    };
    socketRef?.current?.emit("remove from chan", payload);  //member to remove a envoyer a la database pour modif
    setMembers((prevUsers) => {
      return prevUsers.filter((user) => user !== username);
    });

    setInvitedMembers((prevInvitedUsers) => {
      return prevInvitedUsers.filter((user) => user !== username);
    });

    //set admins?? remove member as admin
  }


//PAS OBLIGATOIRE
  // function changeChanName(newChatName: string)
  // {
  //   const payload = {
  //     AdminId: AuthService.getId(),
  //     old : currentChat.chatName,
  //     new : newChatName,
  //   };
  //   socketRef?.current?.emit("change chatName", payload);  //member to remove a envoyer a la database pour modif
  // }

  function changeChatPassword(newpass: string)
  {
    const payload = {
      userId: AuthService.getId(),
      channelName: currentChat.chatName,
      newPassword : newpass,
    };
    socketRef?.current?.emit("change password", payload);  //member to remove a envoyer a la database pour modif
  }


  function AddMemberAsAdmin(userNameToAddasAdmin: string)
  {
    const payload = {
      AdminId: AuthService.getId(),
      userNameToAdd : userNameToAddasAdmin,
    };
    socketRef?.current?.emit("add to Admins list", payload);  //member to remove a envoyer a la database pour modif
  }

  function RemoveMemberFromAdmins(userNameToRemoveasAdmin: string)
  {
    const payload = {
      AdminId: AuthService.getId(),
      userNameToRemove : userNameToRemoveasAdmin,
    };
    socketRef?.current?.emit("remove from Admins list", payload);  //member to remove a envoyer a la database pour modif
  }



function joinRoom(room: string) { //Fonction est appelee cote database que si bon mot de passe ou bien si a ete invite ou bien si est deja un membre
    const newConnectedRooms = immer(connectedRooms, (draft) => {
      draft.push(room);
    });
    socketRef.current.emit("join room", room, (messages: any) =>
      roomJoinCallback(messages, room)
    ); //send to database all the rooms he is in ?? 
    setConnectedRooms(newConnectedRooms);

    setMembers((prevMembers) => {
      if (!prevMembers.includes(username)) {
        return [...prevMembers, username];
      }
      return prevMembers;
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
    // socketRef.current.emit("join room", "general", (messages: any) =>
    //   roomJoinCallback(messages, "general")
    // );

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
    
    //   socketRef.current.emit("join room", "general", (messages: any) =>
    //   roomJoinCallback(messages, "general")
    // );

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
          // return newMessages;
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
        changeChatPassword={changeChatPassword}
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
