import React, { useState, useEffect} from 'react';
import styled from "styled-components"
import PopupModal from "./PopUpModal"
import MemberList from './MemberList';
import Message from '@/components/Message';
import bcrypt from 'bcryptjs';
import { Container, SideBar,ChatPanel, TextBox, BodyContainer, ChannelInfo, Row, Messages, Pass, ModalContainer, Button3, ModalContainer2, CloseButton} from '@/styles/chat.module';

function Chat(props)
// props: { createDm: (arg0: string) => void; changeChatPassword: (arg0: string) => void; users: any[]; addMember: (arg0: string) => void; currentUser: { blockedUsers: any; adminUsers: any; username: any; }; blockedUsers: { [x: string]: string | string[]; }; yourId: string | number; blockUser: (arg0: any) => void; unblockUser: (arg0: any) => void; admins: { [x: string]: string | any[]; }; currentChat: { chatName: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | null | undefined; }; userChannels: { [x: string]: any[]; }; addAdmin: (arg0: any) => void; removeAdmin: (arg0: any) => void; bannedmembers: { [x: string]: string | any[]; }; mutedMembers: { [x: string]: string | any[]; }; owner: { [x: string]: any; }; removeMember: (arg0: string) => void; banMember: (arg0: any) => void; muteMember: (arg0: any) => void; createNewChannel: (arg0: { chatName: string; accessType: string; password: string | null; }) => void; toggleChat: (arg0: { chatName: any; isChannel: boolean; receiverId: string; }) => void; accessType: string; messages: any[]; passwordError: any; sendMessage: () => void; userchans: any[]; members: any[]; allUsers: any[]; removeChatPassword: (arg0: any) => void; removeChannel: (arg0: any) => void; message: string | number | readonly string[] | undefined; handleMessageChange: React.ChangeEventHandler<HTMLTextAreaElement> | undefined; }) 
{
  const [showModal, setShowModal] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [usersToAdd, setUsersToAdd] = useState('');
  const [chatName, setChatName] = useState("");
  const [chatMembers, setChatMembers] = useState([]);
  const [requirePassword, setRequirePassword] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
    
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showAddUserPopup, setShowAddUserPopup] = useState(false);
  const [showAddAdminPopup, setShowAddAdminPopup] = useState(false);
  const [password, setPassword] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [member, setMember] = useState('');
  const [admin, setAdmin] = useState('');


  const [Dm, setDm] = useState('');

  const [showDmPopup, setDmPopup] = useState(false);


 

  const openDmModal = () => {
    setDmPopup(true);
  };

  const closeDmModal = () => {
    setDmPopup(false);
    setDm('');
  };
  
  const createDm = () => {
  props.createDm(Dm);

    // do something with the new user
    closeDmModal();
  };


  function handleDmChange(event: { target: { value: React.SetStateAction<string>; }; }) {
    setDm(event.target.value);
  }

  function handlePasswordChange(event: { target: { value: React.SetStateAction<string>; }; }) {
    setPassword(event.target.value);
  }

  function handleMemberAdding(event: { target: { value: React.SetStateAction<string>; }; }) {
    setMember(event.target.value);
  }
  
  const changePassword = () => {
    props.changeChatPassword(password);
{/* <CustomPopup message="This is a custom popup message!"></CustomPopup> */}

    closePasswordModal();
  };
  const openPasswordModal = () => {
    setShowPasswordPopup(true);
  };

  const closePasswordModal = () => {
    setShowPasswordPopup(false);
    setPassword('');
  };

  const openAddUserModal = () => {
    setShowAddUserPopup(true);
  };

  const closeAddUserModal = () => {
    setShowAddUserPopup(false);
    // setPassword('');
  };

  const addUser = () => {
    if (props.users.some((user: { username: string; }) => user.username === member) && !filteredMembersUsernames.includes(member)) {
      props.addMember(member);
    }
  
    // Perform any additional actions with the new user
    closeAddUserModal();
  };
  
  const [blockedUsers, setBlockedUsers] = useState(props.currentUser?.blockedUsers || []);

  const isUserBlocked = (username : string) => {

    if (props.blockedUsers && props.blockedUsers[props.yourId]) {
      return props.blockedUsers[props.yourId].includes(username);
     }
    return blockedUsers.some((user: string) => user === username);
  };
  const blockUser2 = (username: any) => {
    props.blockUser(username);
  };

  const unblockUser2 = (username: any) => {
    props.unblockUser(username);
  };

  const [adminUsers, setAdminUsers] = useState(props.currentUser?.adminUsers || []);

 
  const isMemberAdmin = (username: string) => {
    return props.admins[props.currentChat.chatName].includes(username);
    };
  
  const isMember = (channelName: string) => {
    const channels = props.userChannels[props.yourId];
    const channel = channels?.find((channel: { name: string; }) => channel.name === channelName);
    console.log("<<=<<<<<<<<<<<<<channel", channel)
    const isMember = channel?.members?.some((member: { username: any; }) => member.username === props.yourId);
    console.log("<<=<<<<<<<<<<<<<ismember", isMember, props.yourId)
    
    return isMember || false;
  };

  const addAdmin2 = (username: any) => {
    const updatedAdminUsers = [...adminUsers, username];
    setAdminUsers(updatedAdminUsers);
    props.addAdmin(username);
  };

  const removeAdmin2 = (username: any) => {
    const updatedAdminUsers = adminUsers.filter((admin: any) => admin !== username);
    setAdminUsers(updatedAdminUsers);
    props.removeAdmin(username);
  };

  const isUserAdmin = (channelName : string) => {
     if (props.admins && props.admins[channelName]) {
      return props.admins[channelName].includes(props.yourId);
     }
    
  
  };
  const isAdmin = isUserAdmin(props.currentChat.chatName);

  const isUserBanned= (channelName : string) => {
    if (props.bannedmembers && props.bannedmembers[channelName]) {
      return props.bannedmembers[channelName].includes(props.yourId);
     }
  };
  const isBanned= isUserBanned(props.currentChat.chatName);


  const isUsermuted= (channelName : string) => {
    if (props.mutedMembers && props.mutedMembers[channelName]) {
      return props.mutedMembers[channelName].includes(props.yourId);
     }

  };
  const ismuted= isUsermuted(props.currentChat.chatName);

  const isUserOwner = (channelName: string): boolean => {
    console.log("?????CHAT PROPS OWNER", channelName, "is", props.owner[channelName])
    return (props.owner[channelName] == props.yourId)
  };
  
  const isOwner = isUserOwner(props.currentChat.chatName);
  
  const [AdmintoRemove, setAdmintoRemove] = useState('');
  const [showRemoveAdminPopup, setShowRemoveAdminPopup] = useState(false);

  const openRemoveAdminModal = () => {
    setShowRemoveAdminPopup(true);
  };

  const closeRemoveAdminModal = () => {
    setShowRemoveAdminPopup(false);
    // setPassword('');
  };


  function handleAdminRemoveing(event: { target: { value: React.SetStateAction<string>; }; }) {
    setAdmintoRemove(event.target.value);
  }

  const [MemberToRemove, setMemberToRemove] = useState('');
  const [showRemoveMemberPopup, setShowRemoveMemberPopup] = useState(false);

  const openRemoveMemberModal = () => {
    setShowRemoveMemberPopup(true);
  };

  const closeRemoveMemberModal = () => {
    setShowRemoveMemberPopup(false);
  };

  const removeMember = () => {
  props.removeMember(MemberToRemove);

    // do something with the new user
    closeRemoveMemberModal();
  };

  function handleMemberRemoveing(event: { target: { value: React.SetStateAction<string>; }; }) {
    setMemberToRemove(event.target.value);
  }

    const handleChatNameChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setChatName(event.target.value);
      };
  const handleChatMembersChange = (event: { target: { value: { split: (arg0: string) => React.SetStateAction<never[]>; }; }; }) => {
    setChatMembers(event.target.value.split(","));
  };

  const openChatMembersModal = () => {
    // TODO: Add code to open the chat members modal container
  };
  

const [showPopup, setShowPopup] = useState(false);

const kickMember  = (member: any) => {
  props.removeMember(member);

    closeRemoveMemberModal();
  };

const banMember = (member: any) => {
  console.log(`Banning ${member}`);

  props.banMember(member);

  closeRemoveMemberModal();
};

const muteMember = (member: any) => {
  console.log(`Muting ${member}`);
  props.muteMember(member);

  closeRemoveMemberModal();
};


const handleRoomCreation = () => {
  const newRoom = {
    chatName: chatName,
    accessType: accessType,
    password: requirePassword ? password : null
  };
  props.createNewChannel(newRoom);
  };

function handlePasswordToggle(event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) {
  setRequirePassword(event.target.checked);
}

    function openModal() {
        setShowModal(true);
      }
      
      function closeModal() {
        setShowModal(false);
      }
      
      function openModal2() {
        setShowModal2(true);
      }
      
      function closeModal2() {
        setShowModal2(false);
      }


    function renderRooms(room: { accessType: string; name: boolean | React.Key | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | null | undefined; }){
      if (room.accessType == 'private')
        return;
        console.log("ACCESSTYPE", room.accessType)
      console.log("IN ROOM", room)
      const currentChat = {
          chatName: room.name,
          isChannel: true,
          receiverId: "",
      };
      return (
    <Row
    style={{ fontWeight: 500, fontSize: '0.875rem' }}
    onClick={() => props.toggleChat(currentChat)}
    key={room.name}
    active={props.currentChat.chatName === room.name}
    >
    {room.name}
    </Row>

      )
  }


  function renderPrivate(room: { accessType: string; members: any[]; dm: any; name: React.Key | null | undefined; }){
    if (room.accessType == 'private' && !(room.members.find((member: { username: any; }) => member.username === props.yourId)))
      return;
    console.log("IN ROOM", room)

    if (room.accessType != 'private')
      return;
    if (room.dm)
      return;
    const currentChat = {
        chatName: room.name,
        isChannel: true,
        receiverId: "",
    };

    let othername = "";
    if (room.dm) {
      const otherMember = room.members.find((member: { username: any; }) => member.username !== props.yourId);
      othername = otherMember.username;
    }
    else
      othername = room.name
    return (
  <Row
  style={{ fontWeight: 500, fontSize: '0.875rem' }}
  onClick={() => props.toggleChat(currentChat)}
  key={room.name}
  active={props.currentChat.chatName === room.name}
  >
  {
    othername
  }
  </Row>
    )
}

function renderDMS(room: { accessType: string; dm: boolean; name: string; members: any[]; }){
  console.log("IN ROOM", room)

  if (room.accessType != 'private')
    return;
  if (room.dm != true)
    return; 

  const currentChat = {
      chatName: room.name,
      isChannel: true,
      receiverId: "",
  };

  let othername = "";
  if (room.dm) {
    console.log("???!!!OTHERMEMBER", room)
    const otherMember = room.members.find((member: { username: any; }) => member.username !== props.yourId);
    othername = otherMember.username;
  }
  else
    othername = room.name
  return (
<Row
style={{ fontWeight: 500, fontSize: '0.875rem' }}
onClick={() => props.toggleChat(currentChat)}
key={room.name}
active={props.currentChat.chatName === room.name}
>
{
  othername
}
</Row>
  )
}

const handleJoinChannel = () => {
  const channels = props.userChannels[props.yourId];
  const channel = channels?.find(channel => channel.name === props.currentChat.chatName);

  bcrypt.compare(userPassword, channel.password)
    .then(isMatch => {
      if (isMatch) {
        const isMember = channel?.members?.some(member => member.username === props.yourId);
        if (!isMember) {
          props.addMember(props.yourId);
        }
      } else {
        // Passwords don't match
    <span style={{color: 'red'}}>Try again.</span>

        console.log('Incorrect password');
      }
    })
    .catch(error => {
      // Handle error
      console.log('Error comparing passwords', error);
    });
};
    
    function renderUser(user: { username: boolean | React.Key | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | null | undefined; }){
      console.log("render user");
console.log("ACCESSTYPE????", props.accessType)
      
      if (user.username === props.yourId){
          return (
            <div style={{ fontWeight: 500, fontSize: '0.875rem' }} key={user.username}>
            You: {user.username}
        </div>
        
          );
      }
      const currentChat = {
          chatName : user.username,
          isChannel: false,
          receiverId: user.username,
      };
      return(
          // <div onClick={() => {
          //     props.toggleChat(currentChat);
          // }} key={user.username}>
            <div>
              {user.username}
          </div>
      )
  }

  const userStyle = {
    fontweight: "500",
    fontsize: " 0.875rem",
  };

  function renderMessages(message: { sender: any; content: any; }, index: React.Key | null | undefined) {
      return (
        <Message
          key={index}
          me={props.yourId}
          sender={message.sender}
          content={message.content}
        />
      );
    }
    
    let body;
if (!isMember(props.currentChat.chatName))
{
  if (props.currentChat.chatName != "")
  {
    body = (
      <Button3 onClick={() => props.addMember(props.yourId)}>Join {props.currentChat.chatName}</Button3>
      )
  }
 


}
else if (isBanned) {
  body = (
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, fontSize: '14px' }}>
  <span style={{ marginRight: '10px' }}>Can't access this channel, you were BANNED</span>
</div>

  )

} 
else {
  body = (
    
    <Messages>
      {props.messages?.map(renderMessages)}
    </Messages>
  );
}

        if (props.accessType === 'protected' && !isMember(props.currentChat.chatName)) {
  body = (
    <>
         <Pass>
          
      <input type="password" placeholder="Enter password" onChange={(e) => setUserPassword(e.target.value)} />
      <Button3 onClick={handleJoinChannel}>Join {props.currentChat.chatName}</Button3>
    </Pass> 
    </>
  );


  if (!props.passwordError)
  {
    // props.addMember(props.yourId);

    body = (
      <Messages>
          {props.messages?.map(renderMessages)}
      </Messages>
  )
  }
}
    
    function handleKeyPress(e: { key: string; preventDefault: () => void; }){
        if(e.key === "Enter"){
          e.preventDefault(); 
            props.sendMessage();
        }
        
    }
    const [accessType, setAccessType] = useState('public');
    const handleAccessTypeChange = (e: { target: { value: any; }; }) => {
      const selectedAccessType = e.target.value;
      setAccessType(selectedAccessType);
  
      // Set requirePassword to true if the selected access type is 'protected'
      setRequirePassword(selectedAccessType === 'protected');
    };
  
    const [membersexceptselfandowner, setmembersexceptselfandowner ] = useState();


    const memberList = (chatName : string) => {


    }
 
    const isDMchan = (chatName: string) => {
      if (props.userchans)
      {
        const channel = props.userchans.find((chan: { name: string; }) => chan.name === chatName);
    
        console.log("CHAN POPULATED", channel);
    
        if (channel) {
            return channel.dm;
        }
    }
  }
  const isDM = isDMchan(props.currentChat.chatName);


  const FilteredAdmins = (chatName: string) => {
    console.log("USERCHAN POPULATED FOR ADMIN", props.userchans, "FOR", chatName);
  
    if (props.userchans) {
      const channel = props.userchans.find((chan: { name: string; }) => chan.name === chatName);
  
      console.log("CHAN POPULATED FOR ADMIN", channel);
  
      if (channel) {
        const channelAdmins = channel.admins;
        console.log("Channel admins:", channelAdmins);
  
        // Filter channel members based on conditions
        const filteredAdmins = channelAdmins.filter(
          (member: { username: any; }) => member.username !== channel.owner.username && member.username !== props.yourId
        );
        console.log("FILTERED ADMINS:", filteredAdmins);
  
        return filteredAdmins;
      }
    }
    return null; // Or handle the case when no channel or members are found
  };
  const filteredAdmins = FilteredAdmins(props.currentChat.chatName);



    const UserList = (chatName: string) => {
      console.log("USERLIST POPULATED", props.userchans, "FOR", chatName);
    
      if (props.userchans) {
        const channel = props.userchans.find((chan: { name: string; }) => chan.name === chatName);
    
        console.log("CHAN POPULATED", channel);
    
        if (channel) {
          // const channelMembers = channel.members;
          console.log(".......?????PROPS MEMBERS????", props.members)
          const channelMembers = props?.members;
          console.log("Channel Members:", channelMembers);
          const filteredMembers = channelMembers.filter(
            (member: any) => member !== channel.owner?.username && member !== props.yourId
          );
          console.log("FILTERED MEMBERS:", filteredMembers);
    
          return filteredMembers;
        }
      }
    
      return null; // Or handle the case when no channel or members are found
    };
    
      const filteredMembersUsernames = UserList(props.currentChat.chatName);

    const UserListPublic = (chatName: string) => {
      console.log("USERLIST POPULATED", props.userchans, "FOR", chatName);
    
      if (props.userchans) {
        const channel = props.userchans.find((chan: { name: string; }) => chan.name === chatName);
    
        console.log("CHAN POPULATED", channel);
    
        if (channel) {
          const channelusers = props?.users;
          console.log("Channel users:::::", channelusers);
          const filteredusers = channelusers.filter(
            (user: { username: any; }) => user.username !== channel.owner?.username && user.username !== props.yourId
          );
          console.log("FILTERED users:::::", filteredusers);
    
          return filteredusers;
        }
      }
    
      return null; // Or handle the case when no channel or users are found
    };
    
    const filteredUsers = UserListPublic(props.currentChat.chatName);
    const filteredUsersUsernames = filteredUsers?.map((user: { username: any; }) => user.username);
    
  function seeProfile(username: string): void {
    console.log("SEE PROFILE of", username, "if you want to find the User you need to put this.userservice.findonebyname")
  }

  function playPong(): void {

    let otherUser;
    if (props.members[0] === props.yourId)
      otherUser = props.members[1];
    else
      otherUser = props.members[0];
    props.inviteToPlay(props.yourId, otherUser)
  
    console.log("PLAY PONNNNG with 2 usernames. User to find with userservice.findonebyname()", props.members[0], props.members[1])
  }


  function acceptInvite(): void {

    console.log("<3 JUST CLICKED ON ACCEPT INVITE. BOTH USERS ARE THEREFORE IN THE ROOM. <3")
    console.log("if you want to find their username:", props.members[0], props.members[1])
    // props.inviteReceived = false; // trouver le moyen de reset à false
  }

    return (
      
        <Container>

            <SideBar>
            {!showModal && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
  <div>
    <Button3 onClick={openDmModal}>Add DM</Button3>
    <PopupModal
      isOpen={showDmPopup}
      onRequestClose={closeDmModal}
      onSave={createDm}
      onCancel={closeDmModal}
      value={Dm}
      onChange={handleDmChange}
      placeholder="Enter the username of the person you want to DM"
      modalId="DM-user-modal"
      buttonText="Save"
    />
  </div>
  <div style={{ marginLeft: '16px' }}>
    <Button3 onClick={openModal}>Add Room</Button3>
  </div>
</div>
    )}
                {showModal && (
                  
                  <ModalContainer>
        <div style={{ display: 'flex', alignItems: 'center',  justifyContent: 'right'}}>

                      <button onClick={() => closeModal()}>X</button>
                      </div>
                      <form onSubmit={handleRoomCreation}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
  <label htmlFor="chatNameInput" style={{ marginRight: '10px', fontWeight: 500, fontSize: '0.875rem' }}>Chat Name:</label>
  <input
    id="chatNameInput"
    type="text"
    value={chatName}
    onChange={handleChatNameChange}
    placeholder="Enter chat name here"
    required
    style={{ marginLeft: 'auto', fontWeight: 500, fontSize: '0.875rem'  }}
  />
</div>

  <div>
  <div style={{ display: 'flex', alignItems: 'center' }}>
  <label htmlFor="accessTypeSelect" style={{ marginRight: '10px', fontWeight: 500, fontSize: '0.875rem' }}>Type of chan:</label>
  <span style={{ fontWeight: 500, fontSize: '0.875rem', marginLeft: 'auto' }}>
    <select id="accessTypeSelect" value={accessType} onChange={handleAccessTypeChange}>
      <option value="public">Public</option>
      <option value="protected">Protected</option>
      <option value="private">Private</option>
    </select>
  </span>
</div>


  </div>
      {requirePassword && (
        <><label htmlFor="passwordInput">Password:</label><input
                    id="passwordInput"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter password here"
                    style={{
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      width: '100%',
                      marginTop: '8px',
                    }}
                    required /></>
      )}
        <div style={{ display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>

      <Button3 type="submit">Create Group</Button3>
      </div>
    </form>
                   

</ModalContainer>
                )}
                <h3 style={{ fontWeight: 500, fontSize: 'medium', color: '#8d2bd2' }}>Channels</h3>

                {props.userChannels[props.yourId]?.map(renderRooms)}
                <h3 style={{ fontWeight: 500, fontSize: 'medium', color: '#8d2bd2' }}>Private chans</h3>
                {props.userChannels[props.yourId]?.map(renderPrivate)}
                <h3 style={{ fontWeight: 500, fontSize: 'medium', color: '#8d2bd2' }}>My Dms</h3>
                {props.userChannels[props.yourId]?.map(renderDMS)}

        <h3 style={{ fontWeight: 500, fontSize: 'medium', color: '#8d2bd2' }}>All connected Users</h3>
        <span style={{ fontWeight: 500, fontSize: '0.875rem', marginRight: 'auto' }}>

        {props.allUsers?.map(renderUser)}
        </span>
        <div>

        <div>
        <h3 style={{ fontWeight: 500, fontSize: 'medium', color: '#8d2bd2' }}>All Users</h3>
<ul>
  {props.users?.map((user: { username: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | null | undefined; }, i: React.Key | null | undefined) => (
    user.username !== props.currentUser.username && (
      <li key={i}>
        <div style={{ display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>
          <span style={{ fontWeight: 500, fontSize: '0.875rem', marginRight: 'auto' }}>
            {user.username}
          </span>
            <>
              {isUserBlocked(user.username) ? (
                <Button3 onClick={() => unblockUser2(user.username)}>
                  Unblock
                </Button3>
              ) : (
                <Button3 onClick={() => blockUser2(user.username)}>
                  Block
                </Button3>
              )}
               <Button3 onClick={() => seeProfile(user.username)}>
                    Profile
                  </Button3>
            </>
        </div>
      </li>
    )
  ))}
</ul>


    </div>
        </div>

     </SideBar>

     <ChatPanel>
        {((!isDM) && (!isBanned) &&  isMember(props.currentChat.chatName)  && props.currentChat.chatName &&
        <ChannelInfo>
            {(!isDM && props.userchans[0] ) && (
              <button onClick={openModal2} style={{ lineHeight: '0.5' }}>
      <span style={{ margin: '0', padding: '0', letterSpacing: '-0.2em' }}>___</span>
      <br/>
      <span style={{ margin: '0', padding: '0', letterSpacing: '-0.2em' }}>___</span>
      <br/>
      <span style={{ margin: '0', padding: '0', letterSpacing: '-0.2em' }}>___</span>
    </button>
)}
   
</ChannelInfo>
)}

{(isDM &&
  <ChannelInfo>


      <div style={{ marginLeft: 'auto' }}>
        {props.inviteReceived ? (
          <Button3 onClick={acceptInvite}>Accept Pong Invite</Button3>
        ) : (
          <Button3 onClick={playPong}>Play pong</Button3>
        )}
      </div>
  </ChannelInfo>
)}
{showModal2 && (
  <ModalContainer2>
    <CloseButton onClick={closeModal2}>X</CloseButton>
    
    <div>
    {isAdmin &&
      <MemberList isAdmin={isAdmin} accessType={props.accessType} members={filteredMembersUsernames} kickFunction={kickMember} banFunction={banMember} muteFunction={muteMember} />
    }
</div>
    <div>
      {isOwner && (props.accessType === 'protected') && (
<div style={{ display: 'flex', alignItems: 'center' , justifyContent: 'center'}}>
  <Button3 onClick={() => {
    props.removeChatPassword(props.currentChat.chatName);
  }}>
    Make chan public
  </Button3>
  </div>
)}
      {/* et que le user est un owner ou un admin */}

      {isOwner && (props.accessType === 'protected') && (
      <div style={{ display: 'flex', alignItems: 'center' , justifyContent: 'center'}}>
      <Button3 onClick={openPasswordModal}>Change chat password</Button3>
      </div>
      )}
      {/* et que le user est un owner ou un admin */}
      {isOwner && props.accessType === 'public' && (
    <div style={{ display: 'flex', alignItems: 'center' , justifyContent: 'center'}}>
  <Button3 onClick={openPasswordModal}>Make channel password-protected</Button3>
  </div>
)}
       <PopupModal
        isOpen={showPasswordPopup}
        onRequestClose={closePasswordModal}
        onSave={changePassword}
        onCancel={closePasswordModal}
        value={password}
        onChange={handlePasswordChange}
        placeholder="Enter new password here"
        modalId="change-password-modal"
        buttonText="Save"
      />
    {isOwner && (props.accessType === 'private') && (
            <div style={{ display: 'flex', alignItems: 'center' , justifyContent: 'center'}}>
  <Button3 onClick={openAddUserModal}>Add user</Button3>
  </div>
    )}
      <PopupModal
        isOpen={showAddUserPopup}
        onRequestClose={closeAddUserModal}
        onSave={addUser}
        onCancel={closeAddUserModal}
        value={member}
        onChange={handleMemberAdding}
        placeholder="Enter username here"
        modalId="add-user-modal"
        buttonText="Add User"
      />
       {isOwner && 
      //  (props.accessType !== 'public') && 
       (
      <div>
<h3 style={{ fontWeight: 500, fontSize: 'medium', color: '#8d2bd2' }}>All Members except owner and yourself</h3>

  <ul>
  {filteredMembersUsernames?.map((user: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | null | undefined, i: React.Key | null | undefined) => (
user!== props.currentUser.username && (
<li key={i}>
  <label>
    <div style={{ display: 'flex', alignItems: 'center' }}>
    <span style={{ fontWeight: 500, fontSize: '0.875rem', marginRight: 'auto' }}>
            {user}
          </span>
    {isMemberAdmin(user) ? (
      <Button3 onClick={() => removeAdmin2(user)}>
        Remove Admin
      </Button3>
    ) : (
      <Button3 onClick={() => addAdmin2(user)}>Add Admin</Button3>
    )}
    </div>
  </label>
    </li>
  )
))}
      </ul>
    </div>)}
    </div>
{isOwner &&
  <div style={{ display: 'flex', alignItems: 'center' , justifyContent: 'center'}}>
  <Button3 onClick={() => {
    props.removeChannel(props.currentChat.chatName);
    closeModal2();
  }}>
    Delete Chan
  </Button3>
  </div>
}
{/* {props.accessType === 'private' && */}
<div style={{ display: 'flex', alignItems: 'center' , justifyContent: 'center'}}>
<Button3 onClick={() => {
      props.removeMember(props.yourId);
    closeModal2();

    }}>	
      Leave Chan
    </Button3>	
    </div>
{/* } */}
  </ModalContainer2>
)}
        <BodyContainer className={showModal2 ? "show-modal" : ""}>

{body}

        </BodyContainer>
        {/* {isMember(props.currentChat.chatName) && (!isBanned) && (!(props.accessType == "protected" && (props.passwordError))) &&(props.currentChat.chatName) &&  */}
        {isMember(props.currentChat.chatName) && (!isBanned) && props.currentChat.chatName &&
        <TextBox
         className={showModal2 ? "show-modal" : ""}
            value={props.message}
            onChange={props.handleMessageChange}
            onKeyPress={handleKeyPress}
            placeholder="enter message here"
        />
      }

     </ChatPanel>
     </Container>
            )
}

  export default Chat;
