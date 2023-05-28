import { useEffect, useState, useRef, SetStateAction, ChangeEvent } from "react";
import Chat from "../components/Chat";
import io, { Socket } from "socket.io-client";
import immer from "immer";
import AuthService from "../services/authentication-service";
import userService from '@/services/user-service';
import { useRouter } from "next/router";
import authenticationService from "../services/authentication-service";

function Messenger2() {



  const [userdata, setUserData] = useState({ username: "", id: "" });
  const router = useRouter();

  const fetchProfile = async () => {
    const result = await userService.profile();
    setUserData({ ...result });
  };

  useEffect(() => {
    if (!authenticationService.getToken()) {
      router.push('/login');
    } else {
      fetchProfile();
    }
  }, [router]);

console.log(userdata)
  
  const [connected, setConnected] = useState(false);
  const [channels, setChannels] = useState({});
  const [inviteReceived, setInviteReceived] = useState(false);
  const [inviteReceivedMap, setInviteReceivedMap] = useState<{ [key: string]: any }>({});

  const [passwordError , setPasswordError] = useState(true);
  const [currentChat, setCurrentChat] = useState({
    isChannel: true,
    chatName: "",
    receiverId: "",
  });
  const [connectedRooms, setConnectedRooms] = useState(["public"]);
  const [invitedMembers, setinvitedMembers] = useState([]);
 const [userChannels, setUserChannels] = useState<{ [key: string]: any }>({});
  const [admins, setAdmins] = useState<{ [key: string]: any }>({});
  const [owner, setOwner] =  useState<{ [key: string]: any }>({});
  const [bannedmembers, setBannedmembers] = useState<{ [key: string]: any }>({});
  const [allUsers, setAllUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    blockedUsers: null, // Replace with the appropriate initial value
    adminUsers: null, // Replace with the appropriate initial value
    username: "", // Replace with the appropriate initial value
  });
  //const [currentUser, setCurrentUser] = useState();
  const socketRef = useRef<Socket | null>(null);

  const [newMember, setNewMember] = useState("");
  const [rooms, setRooms] = useState<string[]>([]);
  const [userchans, setUserChans] = useState([])

  function handleMessageChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setMessage(e.target.value);
  }

  const [messages, setMessages] = useState<{ [key: string]: any }>({});
  const [accessType, setAccessType] = useState<{ [key: string]: any }>({});

  const [members, setMembers] = useState<{ [key: string]: any }>({});
  const [mutedMembers, setmutedMembers] = useState<{ [key: string]: any }>({});
  const [blockedUsers, setBlockedUsers] = useState<{ [key: string]: any }>({});

  function createNewChannel(data: any) {
    const datachan = {
      creator: userdata.id,
      roomName: data.chatName,
      accessType: data.accessType,
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
    socketRef?.current?.emit("join server", {id: userdata.id, name: userdata.username});
  }

  function createDm(username2: string) {
    const datachan = {
      username1: userdata.username,
      username2: username2,
    };
    if (datachan.username1 === datachan.username2)
      return;
    socketRef?.current?.emit("create DM", datachan);
    socketRef?.current?.emit("join server", {id: userdata.id, name: userdata.username});
  }

  function inviteToPlay(sender :string, otherUser: string)
  // function inviteToPlay(dataa: any)
  {
    // const {sender, otherUser} = dataa;
    const data = {
      sender: sender,
      receiver: otherUser,
      chatName: currentChat.chatName,
    }

    const payload = {
      content: `You just received an invitation to play pong from ${otherUser}. Do you accept?`,
      to: currentChat.isChannel ? currentChat.chatName : currentChat.receiverId,
      sender: "System",
      senderid: userdata.id,
      chatName: currentChat.chatName,
      isChannel: currentChat.isChannel,
    };
    socketRef?.current?.emit("send message", payload);
    socketRef?.current?.emit("sendInvitation", data);
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
      chatName : "",
    }));

    socketRef?.current?.emit("join server", {id: userdata.id, name: userdata.username});
  }


  function removeChatPassword(channelName: string)
  {
    const payload = {
      userId: userdata.id,
      channelName: currentChat.chatName,
    };
    socketRef?.current?.emit("remove password", payload);  //member to remove a envoyer a la database pour modif
    socketRef?.current?.emit("join server", {id: userdata.id, name: userdata.username});

  }


  function changeChatPassword(newpass: string)
  {
    const payload = {
      userId: userdata.id,
      channelName: currentChat.chatName,
      newPassword : newpass,
    };
    socketRef?.current?.emit("change password", payload);  //member to remove a envoyer a la database pour modif
    socketRef?.current?.emit("join server", {id: userdata.id, name: userdata.username});

  }

  function addMember(username: string)
  {
    const payload = {
      channelName: currentChat.chatName,
      AdminId: userdata.id,
      username : username,
    };
    socketRef?.current?.emit("add member", payload);  //member to remove a envoyer a la database pour modif
    const updatedMembers = [...members[currentChat.chatName], username];
    setMembers((prevMembers) => ({
      ...prevMembers,
      [currentChat.chatName]: updatedMembers,
    }));
    setNewMember("");
    socketRef?.current?.emit("join server", {id: userdata.id, name: userdata.username});

  }

  function addAdmin(userNameToAddasAdmin: string)
  {
    const payload = {
      channelName: currentChat.chatName,
      AdminId: userdata.id,
      username : userNameToAddasAdmin,
    };
    const updatedadmins = [...admins[currentChat.chatName], userNameToAddasAdmin];
    setAdmins((prevadmins) => ({
      ...prevadmins,
      [currentChat.chatName]: updatedadmins,
    }));

    socketRef?.current?.emit("add admin", payload);  //member to remove a envoyer a la database pour modif
    socketRef?.current?.emit("join server", {id: userdata.id, name: userdata.username});

  }

  function removeAdmin(userNameToRemoveasAdmin: string)
  {
    const payload = {
      channelName: currentChat.chatName,
      AdminId: userdata.id,
      username : userNameToRemoveasAdmin,
    };
    const updatedadmins = admins[currentChat.chatName]?.filter(
      (admin: string) => admin !== userNameToRemoveasAdmin
    );
    setAdmins((prevadmins) => ({
      ...prevadmins,
      [currentChat.chatName]: updatedadmins,
    }));

    socketRef?.current?.emit("remove admin", payload);  //member to remove a envoyer a la database pour modif
    socketRef?.current?.emit("join server", {id: userdata.id, name: userdata.username});

  }


  function removeMember(userNameToRemoveasMember: string)
  {
    const payload = {
      channelName: currentChat.chatName,
      AdminId: userdata.id,
      username : userNameToRemoveasMember,
    };

    const updatedMembers = members[currentChat.chatName]?.filter(
      (member: string) => member !== userNameToRemoveasMember
    );
    setMembers((prevMembers) => ({
      ...prevMembers,
      [currentChat.chatName]: updatedMembers,
    }));
    socketRef?.current?.emit("remove member", payload);  //member to remove a envoyer a la database pour modif
    socketRef?.current?.emit("join server", {id: userdata.id, name: userdata.username});
    if (userdata.username === userNameToRemoveasMember)
    {
      setCurrentChat((prevState) => ({
        ...prevState,
        chatName : "",
      }));
    }


  }

  function banMember(userNameToRemoveasMember: string)
  {
    const payload = {
      channelName: currentChat.chatName,
      AdminId: userdata.id,
      username : userNameToRemoveasMember,
    };
    const updatedBannedMembers = [...bannedmembers[currentChat.chatName], userNameToRemoveasMember];
    setBannedmembers((prevbannedmembers) => ({
      ...prevbannedmembers,
      [currentChat.chatName]: updatedBannedMembers,
    }));
    socketRef?.current?.emit("ban member", payload);  //member to remove a envoyer a la database pour modif
    socketRef?.current?.emit("join server", {id: userdata.id, name: userdata.username});

  }
  

  function muteMember(userToMute: string)
  {
    const payload = {
      channelName: currentChat.chatName,
      AdminId: userdata.id,
      username : userToMute,
    };
  
    socketRef?.current?.emit("mute member", payload);  //member to remove a envoyer a la database pour modif
    socketRef?.current?.emit("join server", {id: userdata.id, name: userdata.username});

  }


  function blockUser(usertoBlock: string)
  {
    const userdataname  = userdata.username;

    const payload = {
      UserWhoCantAnymore: userdata.id,
      usernameToBlock : usertoBlock,
    };
    setBlockedUsers((prevBlockedUsers) => ({
      ...prevBlockedUsers,
      [userdataname]: usertoBlock,
    }));
    
    socketRef?.current?.emit("block user", payload);  //member to remove a envoyer a la database pour modif
    socketRef?.current?.emit("join server", {id: userdata.id, name: userdata.username});


  }


  
  function unblockUser(usertoUnblock: string)
  {
    const userdataname  = userdata.username;
    const payload = {
      UserWhoCantAnymore: userdata.id,
      usernameToBlock : usertoUnblock,
    };
    const updatedBlockedUsers = [userdataname]?.filter(
      (blockeduser) => blockeduser !== usertoUnblock);
    setBlockedUsers((prevBlockedUsers) => ({
      ...prevBlockedUsers,
      [userdataname]: updatedBlockedUsers,
    }));

    socketRef?.current?.emit("unblock user", payload);  //member to remove a envoyer a la database pour modif
    socketRef?.current?.emit("join server", {id: userdata.id, name: userdata.username});

  }
  
function joinRoom(room: string) { 
  const newConnectedRooms = immer(connectedRooms, (draft) => {
      draft.push(room);
    });
    socketRef?.current?.emit("join room", room, (messages: any) =>
      roomJoinCallback(messages, room)
    ); 
    setConnectedRooms(newConnectedRooms);
    const username = userdata.username;
  }

  function sendMessage() {
    const payload = {
      content: message,
      to: currentChat.isChannel ? currentChat.chatName : currentChat.receiverId,
      sender: userdata.username,
      senderid: userdata.id,
      chatName: currentChat.chatName,
      isChannel: currentChat.isChannel,
    };
    socketRef?.current?.emit("send message", payload);
    if (currentChat && currentChat.chatName) {
      const newMessages = immer(messages, (draft) => {
        draft[currentChat.chatName].push({
          sender: userdata.username,
          content: message,
        });
      });
      setMessages(newMessages);
      setMessage("")
    }}
    

  function roomJoinCallback(incomingMessages: any, room: string) {
    const newMessages = immer(messages, (draft) => {
      if (!draft[currentChat.chatName]) {
        draft[currentChat.chatName] = [];
      }
        draft[room] = incomingMessages;

      draft[currentChat.chatName].push({
        sender: userdata.username,
        content: message,
      });
    });
    
    setMessages(newMessages);
  }

  // interface ChatProps {
  //   // Define the props here, including the joinRoom prop
  //   message: string;
  //   passwordError: boolean;
  //   handleMessageChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  //   sendMessage: () => void;
  //   changeChatPassword: (newpass: string) => void;
  //   // ...other props...
  //   joinRoom: (room: string) => void; // Define the joinRoom prop here
  // }


  function toggleChat(currentChat: any){
    
    if (!messages[currentChat.chatName]) {
      const newMessages = immer(messages, (draft) => {
        draft[currentChat.chatName] = [];
      });
      setMessages(newMessages);
    }
    setCurrentChat(currentChat);
  }


  useEffect(() => {
    if (userdata !== null) {
    const token =  AuthService.getToken();

    if (!token) {
      window.location.href = "/login";
    }


    // const userdata = {
    //   id: userdata.id,
    //   name: userdata.username,
    // };
    // if (userdata.username == "")
    // {
    //   window.location.href = "/login";
    // }

 socketRef.current  = io("http://localhost:8000", {
  reconnection: true, 
  query: { token },
});
    socketRef?.current?.on("connect", () => {
      setConnected(true);
    socketRef?.current?.emit("join server", {id: userdata.id, name: userdata.username});

    });

    socketRef?.current?.on("disconnect", () => {
      setConnected(false);
    });

    socketRef?.current?.on("all user's chans", (channels: SetStateAction<never[]>) => {
      setUserChans(channels);
    });

    socketRef?.current?.emit("join server", userdata);
    socketRef?.current?.emit("all users", userdata);

    socketRef?.current?.on("is userinput correct", (isUserInputCorrectPass: boolean) => {
      setPasswordError(!isUserInputCorrectPass);
    });

    socketRef?.current?.on("member adding", (data : any) => {
      const { memberadded, username } = data;
    });
  
    socketRef?.current?.on("connected users", (users: any) => {
      setAllUsers(users);
    });

    socketRef?.current?.on("all users", (data : any) => {
      const { currentuser, allusers } = data;
          setCurrentUser(currentuser);
          setUsers(allusers);
    });
  

    socketRef?.current?.on("all chans", (chans: any) => {
      setRooms(chans);
    socketRef?.current?.on('receiveInvitation', (data: any) => {
      const { sender, receiver, chatName } = data;
      const username = sender.username;
      setInviteReceivedMap((prevMap) => ({
        ...prevMap,
        [chatName]: true,
      }));

    });
      

    socketRef?.current?.on("join room", (data : any) => {
      const { room , accessType, messages, members, admins, bannedmembers, mutedMembers, owner, blockedUsers, channels } = data;
     setMessages((prevMessages) => ({
        ...prevMessages,
        [room]: messages,
      }));
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
      setOwner((prevOwner) => ({
        ...prevOwner,
        [room]: owner,
      }));

      setBlockedUsers((prevBlockedUsers) => ({
        ...prevBlockedUsers,
        [userdata.username]: blockedUsers,
      }));
      setUserChannels((prevChannels) => ({
        ...prevChannels,
        [userdata.username]: channels,
      }));
        setAccessType((prevAccessType) => ({
          ...prevAccessType,
          [room]: accessType,
        }));
    });
    });
    

    socketRef?.current?.on("new chan", (channelName :string) => {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [channelName]: [],
      }));
    socketRef?.current?.emit("join server", {id: userdata.id, name: userdata.username});

    });
    
    socketRef?.current?.on("new message", (data : any) => {
      const { content, sender, chatName } = data;
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
    socketRef?.current?.disconnect();
    };
  }
  }, [userdata]);

  let body;
  if (connected) {
    console.log("connected", userdata.username)
    body = (
      <Chat
        message={message}
        passwordError={passwordError}
        handleMessageChange={handleMessageChange}
        sendMessage={sendMessage}
        changeChatPassword={changeChatPassword}
        removeChatPassword={removeChatPassword}
        yourId={socketRef.current ? userdata.username : ""}
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
        inviteToPlay={inviteToPlay}
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
        userChannels={userChannels}
        admins={admins}
        inviteReceived={inviteReceived}
        inviteReceivedMap={inviteReceivedMap}
        setInviteReceivedMap={setInviteReceivedMap}

      />
    );
  }

    return(<div className="App">{body}</div>);
}

export default Messenger2;

