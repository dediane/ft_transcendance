import { useEffect, useState, useRef, SetStateAction } from "react";
import Chat from "../components/Chat";
import io from "socket.io-client";
import immer from "immer";
import AuthService from "../services/authentication-service";
import Auth from "./auth";
import axios from 'axios';


function Messenger2() {
  const [connected, setConnected] = useState(false);
  const [passwordError , setPasswordError] = useState(true);
  const [currentChat, setCurrentChat] = useState({
    isChannel: true,
    chatName: "",
    receiverId: "",
    // members: [],
    // admins: [],
  });
  const [connectedRooms, setConnectedRooms] = useState(["public"]);

  const [invitedMembers, setinvitedMembers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [owner, setOwner] = useState([]);
  const [bannedmembers, setBannedmembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  // const [accessType, setAccessType] = useState("");
  const socketRef = useRef();
  const [newMember, setNewMember] = useState("");
  const [rooms, setRooms] = useState<string[]>([]);
  const [userchans, setUserChans] = useState([])

  function handleMessageChange(e) {
    setMessage(e.target.value);
  }

  const [messages, setMessages] = useState({});
  const [accessType, setAccessType] = useState({});
  // const [accessType, setAccessType] = useState({});

  // useEffect(() => {
  //   console.log("||||||||PRaccessType", accessType["PROTECTED"]);
  // }, [accessType]);
  const [members, setMembers] = useState([]);
  const [mutedMembers, setmutedMembers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);

  function createNewChannel(data: any) {
    const datachan = {
      creator: AuthService.getId(),
      roomName: data.chatName,
      accessType: data.accessType,
      password: data.password,
    };
    console.log("TESESTTTTT CREATE CHAN ", data.chatName,  data.accessType,  data.password)
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

  function createDm(username2: string) {
    const datachan = {
      username1: AuthService.getUsername(),
      username2: username2,
    };
    console.log(`Messenger2: creating DM with ${username2} and {${datachan.username2}}`)
    socketRef?.current?.emit("create DM", datachan);
  
    // setRooms((prevRooms) => {
    //   if (!prevRooms.includes(data.chatName)) {
    //     return [...prevRooms, data.chatName];
    //   }
    //   return prevRooms;
    // });
    // setMessages((prevMessages) => ({
    //   ...prevMessages,
    //   [data.chatName]: [],
    // }));

  
    
  }
  
  function removeChannel(channelName: string) {
   
    socketRef?.current?.emit("remove chan", currentChat.chatName);
  
    setRooms((prevRooms) => {
      return prevRooms.filter((room) => room !== channelName);
    });
    setMessages((prevMessages) => {
      const newMessages = { ...prevMessages };
      delete newMessages[channelName];
      return newMessages;
    });
    setCurrentChat((prevState) => ({
      ...prevState,
      chatName: userchans[0].name,
    }));
   
  }


  function removeChatPassword(channelName: string)
  {
    const payload = {
      userId: AuthService.getId(),
      channelName: currentChat.chatName,
    };
    socketRef?.current?.emit("remove password", payload);  //member to remove a envoyer a la database pour modif
  }


  function changeChatPassword(newpass: string)
  {
    const payload = {
      userId: AuthService.getId(),
      channelName: currentChat.chatName,
      newPassword : newpass,
    };
    socketRef?.current?.emit("change password", payload);  //member to remove a envoyer a la database pour modif
  }


  function checkChatPassword(userinput: string)
  {
    const payload = {
      userId: AuthService.getId(),
      channelName: currentChat.chatName,
      userInput : userinput,
    };
    socketRef?.current?.emit("check password", payload);  //member to remove a envoyer a la database pour modif
  }



  function addMember(username: string)
  {
    const payload = {
      channelName: currentChat.chatName,
      AdminId: AuthService.getId(),
      username : username,
    };
    socketRef?.current?.emit("add member", payload);  //member to remove a envoyer a la database pour modif
    
    //check avant que le user existe vraiment 
    const updatedMembers = [...members[currentChat.chatName], username];
    console.log("updatedMEMBERS???", updatedMembers)
    setMembers((prevMembers) => ({
      ...prevMembers,
      [currentChat.chatName]: updatedMembers,
    }));
    setNewMember("");
  }

  function addAdmin(userNameToAddasAdmin: string)
  {
    const payload = {
      channelName: currentChat.chatName,
      AdminId: AuthService.getId(),
      username : userNameToAddasAdmin,
    };
    const updatedadmins = [...admins[currentChat.chatName], userNameToAddasAdmin];
    console.log("updatedadmins???", updatedadmins)
    setAdmins((prevadmins) => ({
      ...prevadmins,
      [currentChat.chatName]: updatedadmins,
    }));

    socketRef?.current?.emit("add admin", payload);  //member to remove a envoyer a la database pour modif
  }

  function removeAdmin(userNameToRemoveasAdmin: string)
  {
    const payload = {
      channelName: currentChat.chatName,
      AdminId: AuthService.getId(),
      username : userNameToRemoveasAdmin,
    };
    const updatedadmins = admins[currentChat.chatName]?.filter(
      (admin) => admin !== userNameToRemoveasAdmin
    );
    setAdmins((prevadmins) => ({
      ...prevadmins,
      [currentChat.chatName]: updatedadmins,
    }));

    socketRef?.current?.emit("remove admin", payload);  //member to remove a envoyer a la database pour modif
  }


  function removeMember(userNameToRemoveasMember: string)
  {
    console.log("to remove in messenger2", userNameToRemoveasMember)
    console.log("currentchatName", currentChat.chatName)
    const payload = {
      channelName: currentChat.chatName,
      AdminId: AuthService.getId(),
      username : userNameToRemoveasMember,
    };
    const updatedMembers = members[currentChat.chatName]?.filter(
      (member) => member !== userNameToRemoveasMember
    );
    setMembers((prevMembers) => ({
      ...prevMembers,
      [currentChat.chatName]: updatedMembers,
    }));
    socketRef?.current?.emit("remove member", payload);  //member to remove a envoyer a la database pour modif
  }

  function banMember(userNameToRemoveasMember: string)
  {
    console.log("to remove in messenger2", userNameToRemoveasMember)
    console.log("currentchatName", currentChat.chatName)
    const payload = {
      channelName: currentChat.chatName,
      AdminId: AuthService.getId(),
      username : userNameToRemoveasMember,
    };
    const updatedBannedMembers = [...bannedmembers[currentChat.chatName], userNameToRemoveasMember];
    console.log("Bannedmembers???", updatedBannedMembers)
    setBannedmembers((prevbannedmembers) => ({
      ...prevbannedmembers,
      [currentChat.chatName]: updatedBannedMembers,
    }));

    const updatedMembers = members[currentChat.chatName].filter(
      (member) => member !== userNameToRemoveasMember
    );
    setMembers((prevMembers) => ({
      ...prevMembers,
      [currentChat.chatName]: updatedMembers,
    }));
    socketRef?.current?.emit("ban member", payload);  //member to remove a envoyer a la database pour modif
  }
  

  function muteMember(userToMute: string)
  {
    console.log("to mute in messenger2", userToMute)
    console.log("currentchatName", currentChat.chatName)
    const payload = {
      channelName: currentChat.chatName,
      AdminId: AuthService.getId(),
      username : userToMute,
    };
  
    socketRef?.current?.emit("mute member", payload);  //member to remove a envoyer a la database pour modif
  }


  function blockUser(usertoBlock: string)
  {
    console.log("user to block ::: ", usertoBlock)
    const userdataname  = AuthService.getUsername();

    const payload = {
      UserWhoCantAnymore: AuthService.getId(),
      usernameToBlock : usertoBlock,
    };
    setBlockedUsers((prevBlockedUsers) => ({
      ...prevBlockedUsers,
      [userdataname]: usertoBlock,
    }));
    
    socketRef?.current?.emit("block user", payload);  //member to remove a envoyer a la database pour modif
  }


  
  function unblockUser(usertoUnblock: string)
  {
    console.log("user to unblock ::: ", usertoUnblock)
    const userdataname  = AuthService.getUsername();
    const payload = {
      UserWhoCantAnymore: AuthService.getId(),
      usernameToBlock : usertoUnblock,
    };
    const updatedBlockedUsers = [userdataname]?.filter(
      (blockeduser) => blockeduser !== usertoUnblock);
    setBlockedUsers((prevBlockedUsers) => ({
      ...prevBlockedUsers,
      [userdataname]: updatedBlockedUsers,
    }));

  
    socketRef?.current?.emit("unblock user", payload);  //member to remove a envoyer a la database pour modif
  }
  
function joinRoom(room: string) { //Fonction est appelee cote database que si bon mot de passe ou bien si a ete invite ou bien si est deja un membre
  // console.log(userpasstry, "boolean value", userpass)
  // checkChatPassword(userpasstry);
  // if (userpass == true)
  // {

  
  const newConnectedRooms = immer(connectedRooms, (draft) => {
      draft.push(room);
    });
    socketRef.current.emit("join room", room, (messages: any) =>
      roomJoinCallback(messages, room)
    ); //send to database all the rooms he is in ?? 
    setConnectedRooms(newConnectedRooms);
    const username = AuthService.getUsername();

  // }

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
      setMessage("")
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
    //send toggle chat
  }

  // useEffect(() => {
  //   const initialRooms = ["general", "random", "jokes", "javascript"];
  //   initialRooms.forEach((room) => createNewChannel(room));
    // }, []);
  useEffect(() => {
    
    // const initialRooms = ["general", "random", "jokes", "javascript"];
    // initialRooms.forEach((room) => createNewChannel(room));

    // socketRef.current = io("http://localhost:8000");

    const token =  AuthService.getToken();

    if (!token) {
      // Redirect to the login page
      window.location.href = "/login";
    }


    const userdata = {
      id: AuthService.getId(),
      name: AuthService.getUsername(),
    };
    // socketRef?.current?.emit("all users", userdata);


 socketRef.current  = io("http://localhost:8000", {
  query: { token },
});
    socketRef.current.on("connect", () => {
      console.log("connected to server");
      setConnected(true);
    });
    socketRef.current.on("all user's chans", (channels) => {
      console.log("!!!!all user's chans messenger2!!channels is populated???", channels);
      setUserChans(channels);
    });

    socketRef.current.emit("join server", userdata);
    socketRef.current.emit("all users", userdata);

    socketRef.current.on("is userinput correct", (isUserInputCorrectPass: boolean) => {
      console.log("is user input correct?? setting passerror");
      setPasswordError(!isUserInputCorrectPass);
      // throw Error (isUserInputCorrectPass)

    });
    

    socketRef.current.on("member adding", ({memberadded, username}) => {
      console.log("is user input correct?? setting passerror", memberadded, username);
    //   if (memberadded)
    //   {
    //      const updatedMembers = [...members[currentChat.chatName], username];
    // console.log("updatedMEMBERS???", updatedMembers)
    // setMembers((prevMembers) => ({
    //   ...prevMembers,
    //   [currentChat.chatName]: updatedMembers,
    // }));
    // setNewMember("");
    //   }
      // setPasswordError(!isUserInputCorrectPass);
      // throw Error (isUserInputCorrectPass)

    });
  
    socketRef.current.on("connected users", (users: SetStateAction<never[]>) => {
      console.log("all users", users);
      setAllUsers(users);
    });

    socketRef.current.on("all users", ({ currentuser, allusers }) => {
      console.log("---------ALL USERS SOCKET ON----", currentuser.username);
           setCurrentUser(currentuser);
           setUsers(allusers);

          //  console.log(currentuser.username); // Print the username of the current user
  
          //  allusers.forEach(user => {
          //    console.log(user.username); // Print the username of each user in the allusers array
          //  });
       });

    socketRef.current.on("all chans", (chans: SetStateAction<never[]>) => {
      console.log("all chans", chans);
      setRooms(chans);
  //       setCurrentChat((prevState) => ({
  //   ...prevState,
  //   chatName: chans[0] || "",
  // }));
    

    // socketRef.current.on("join room", ({ room, messages }) => {
    //   setMessages((prevMessages) => ({
    //     ...prevMessages,
    //     [room]: messages,
    //   }));
    // });
    socketRef.current.on("join room", ({ room, accessType, messages, members, admins, bannedmembers, mutedMembers, owner, blockedUsers }) => {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [room]: messages,
      }));
console.log(room, "MEMBERS IN MESSENGER2", members)
      setMembers((prevMembers) => ({
        ...prevMembers,
        [room]: members,
      }));

      setAdmins((prevAdmins) => ({
        ...prevAdmins,
        [room]: admins,
      }));
      setBannedmembers((prevbannedmembers) => ({
        ...prevbannedmembers,
        [room]: bannedmembers,
      }));


      setmutedMembers((prevmutedMembers) => ({
        ...prevmutedMembers,
        [room]: mutedMembers,
      }));

      console.log("JOIN ROOM OWNER", owner);
      setOwner((prevOwner) => ({
        ...prevOwner,
        [room]: owner,
      }));

      setBlockedUsers((prevBlockedUsers) => ({
        ...prevBlockedUsers,
        [userdata.name]: blockedUsers,
      }));



console.log("||||||||accessType", accessType)

      // const setAccessType = (roomName, accessType) => {
      //   setAccessType((prevAccessType) => ({
      //     ...prevAccessType,
      //     [room]: accessType,
      //   }));

        setAccessType((prevAccessType) => ({
          ...prevAccessType,
          [room]: accessType,
        }));
// console.log("||||||||2accessType", accessType["PROTECTED"])

      // };
      // setAccessType(accessType);
      // setMembers((prevMembers) => ({
      //   ...prevMembers,
      //   [room]: members,
      // }));


      // const updatedChat = { ...currentChat, members: [...currentChat.members, ...members] };
      // setCurrentChat(updatedChat);

      
        // setMembers(members);
        // setAdmins(admins);

        // Get the current state
        // const chatState = { ...currentChat };

        // Add new member(s) to the members array
        // chatState.members = [...chatState.members, members];
        // chatState.admins = [...chatState.admins, admins];

        // if(!chatState.admins) {
        //   chatState.admins = []
        // }
        // chatState.admins.push(admin)

        // if(!chatState.members) {
        //   chatState.members = []
        // }
        // chatState.members.push(member)
        // Update the state
        // setCurrentChat(chatState);

    });
    
    });
    

    socketRef?.current.on("new chan", (channelName :string) => {
      console.log("received new chan", channelName);
      // setRooms((prevRooms) => [...prevRooms, channelName]);
      setMessages((prevMessages) => ({
        ...prevMessages,
        [channelName]: [],
      }));
      window.location.href = "/Messenger2";
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
        // userpass={userpass}
        passwordError={passwordError}
        handleMessageChange={handleMessageChange}
        sendMessage={sendMessage}
        changeChatPassword={changeChatPassword}
        removeChatPassword={removeChatPassword}
        checkChatPassword={checkChatPassword}
        // yourId={socketRef.current ? socketRef.current.id : ""}
        yourId={socketRef.current ? AuthService.getUsername() : ""}
        allUsers={allUsers}
        bannedmembers={bannedmembers}
        blockedUsers={blockedUsers}
        currentUser={currentUser}
        users={users}
        userchans={userchans}
        owner={owner}

        addMember={addMember}
        addAdmin={addAdmin}
        removeAdmin={removeAdmin}
        removeMember={removeMember}
        banMember={banMember}
        muteMember={muteMember}
        blockUser={blockUser}
        unblockUser={unblockUser}
        joinRoom={joinRoom}
        rooms={rooms}
        createDm={createDm}
        createNewChannel={createNewChannel}
        removeChannel={removeChannel}
        connectedRooms={connectedRooms}
        currentChat={currentChat}
        toggleChat={toggleChat}
        messages={messages[currentChat.chatName]}
        accessType={accessType[currentChat.chatName]}
        members={members[currentChat.chatName]}
        mutedMembers={mutedMembers[currentChat.chatName]}

        // accessType={accessType}
        
        admins={admins}
        


      />
    );
  }

    return(<div className="App">{body}</div>);
}

export default Messenger2;

