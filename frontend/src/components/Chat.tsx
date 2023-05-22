import React, { useState, useEffect} from 'react';
import styled from "styled-components"
import PopupModal from "./PopUpModal"
import MemberList from './MemberList';
import Message from '@/components/Message';

const Container = styled.div`
    height: 100vh;
    width: 100%;
    display: flex;
`;

const SideBar = styled.div`
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
    height: 100%;
    width: 25%;
    overflow-y: scroll;
    
`;

const ChatPanel = styled.div`
    height: 100;
    width: 85%;
    display: flex;
    flex-direction: column;
`;


const TextBox = styled.textarea`

    width: 100%;
    height: 15%;
    overflow: scroll;
    
    &.show-modal {
      width: 73%;
      margin-right: 27%;
      height: 30%;
    }

`;

const BodyContainer = styled.div`
    width: 100%;
    height: 75%;
    overflow-y: scroll;
    display: flex;
    flex-direction: column-reverse;
    
    &.show-modal {
      width: 75%;
    }
   
`;

const ChannelInfo = styled.div`
    height: 10%;
    width: 100%;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
    align-items: center;
    display: flex;
    justify-content: space-between;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  background-color: ${(props) => (props.active ? 'rgb(199, 143, 204)' : 'initial')};
  &:hover {
    background-color: rgb(199, 143, 204);
  }
`;

const Messages = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const Pass = styled.div`
  display: flex;
  position: fixed;
  top: 50%;
  left: 60%;
  transform: translate(-50%, -50%);
  flex-direction: column;
  align-items: flex-start;
`;


const ModalContainer = styled.div`
  height: 100%;
  border-right: 1px solid black;
  overflow-y: scroll;
`;

const Button3 = styled.button`
  display:flex;
	border-radius: 0.7rem;
	background-image: linear-gradient(to right, #ff4b96, #ff83a8);
	padding-left: 0.5rem;
	padding-right: 0.5rem;
	padding-top: 0.5rem;
	padding-bottom: 0.5rem;
	font-size: 0.875rem;
	font-weight: 500;
	color: #fff;
`

const ModalContainer2 = styled.div`
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  height: 100%;
  width: 21%;
  background-color: white;
  position: absolute;
  right: 0;
  z-index: 1;
  padding: 20px;
  overflow-y: scroll;

`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 20px;
`;



function Chat(props) {
  // const [rooms, setRooms] = React.useState(props.rooms);
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


  function handleDmChange(event) {
    setDm(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleMemberAdding(event) {
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
    if (props.users.some(user => user.username === member) && !filteredMembersUsernames.includes(member)) {
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
    return blockedUsers.some((user) => user === username);
  };
  const blockUser2 = (username) => {
    props.blockUser(username);
  };

  const unblockUser2 = (username) => {
    props.unblockUser(username);
  };

  const [adminUsers, setAdminUsers] = useState(props.currentUser?.adminUsers || []);

 
  const isMemberAdmin = (username: string) => {
    return props.admins[props.currentChat.chatName].includes(username);
    };
  
  const isMember = (channelName: string) => {
    const channels = props.userChannels[props.yourId];
    const channel = channels?.find(channel => channel.name === channelName);
    console.log("<<=<<<<<<<<<<<<<channel", channel)
    const isMember = channel?.members?.some(member => member.username === props.yourId);
    console.log("<<=<<<<<<<<<<<<<ismember", isMember, props.yourId)
    
    return isMember || false;
  };
  

  // const isMember = (channelName: string) => {
  //   const channels = props.userChannels[props.yourId];
  //   const channel = channels?.find(channel => channel.name ===)
  // }

  // const isMember = () => {
  //   const channelName = props.currentChat.chatName;
  //   const userChannels = props.userChannels[props.yourId];
  
  //   if (!userChannels) {
  //     return false; // or handle the error as per your requirement
  //   }
  
  //   const channel = userChannels.find(channel => channel.channelName === channelName);
  
  //   if (!channel) {
  //     return false; // or handle the error as per your requirement
  //   }
  
  //   const isMember = channel.members.some(member => member.username === props.yourId);
  
  //   return isMember;
  // };
  

  const addAdmin2 = (username) => {
    const updatedAdminUsers = [...adminUsers, username];
    setAdminUsers(updatedAdminUsers);
    props.addAdmin(username);
  };

  const removeAdmin2 = (username) => {
    const updatedAdminUsers = adminUsers.filter((admin) => admin !== username);
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


  function handleAdminRemoveing(event) {
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

  function handleMemberRemoveing(event) {
    setMemberToRemove(event.target.value);
  }

    const handleChatNameChange = (event) => {
        setChatName(event.target.value);
      };
  const handleChatMembersChange = (event) => {
    setChatMembers(event.target.value.split(","));
  };

  const openChatMembersModal = () => {
    // TODO: Add code to open the chat members modal container
  };
  

const [showPopup, setShowPopup] = useState(false);

const kickMember  = (member) => {
  props.removeMember(member);

    closeRemoveMemberModal();
  };

const banMember = (member) => {
  console.log(`Banning ${member}`);

  props.banMember(member);

  closeRemoveMemberModal();
};

const muteMember = (member) => {
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

function handlePasswordToggle(event) {
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


    // function renderRooms(room){
    //     const currentChat = {
    //         chatName: room,
    //         isChannel: true,
    //         receiverId: "",
    //     };
    //     return (
    //   <Row
    //   style={{ fontWeight: 500, fontSize: '0.875rem' }}
    //   onClick={() => props.toggleChat(currentChat)}
    //   key={room}
    //   active={props.currentChat.chatName === room}
    //   >
    //   {room}
    //   </Row>

    //     )
    // }



    function renderRooms(room){
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


  function renderPrivate(room){
    if (room.accessType == 'private' && !(room.members.find(member => member.username === props.yourId)))
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
      const otherMember = room.members.find(member => member.username !== props.yourId);
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

function renderDMS(room){
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
    const otherMember = room.members.find(member => member.username !== props.yourId);
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
  // Check password
  const channels = props.userChannels[props.yourId];
  const channel = channels?.find(channel => channel.name === props.currentChat.chatName);
  if (channel.password === userPassword)
  {
    const isMember = channel?.members?.some(member => member.username === props.yourId);
    // if (!isMember(channel.name))
    if (!isMember)
      props.addMember(props.yourId);
  }
  else
  {
    <span style={{color: 'red'}}>Try again.</span>
  }
};
    
    function renderUser(user){
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

  function renderMessages(message, index) {
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
{/* <Button3 onClick={() => props.checkChatPassword(userPassword)}>Join {props.currentChat.chatName}</Button3>
       {!props.passwordError && !isMember(props.currentChat.chatName) &&
        props.addMember(props.yourId)
      } */}
      {/* {props.passwordError  && <span style={{color: 'red'}}>Try again.</span>} */}
     
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
    
    function handleKeyPress(e){
        if(e.key === "Enter"){
          e.preventDefault(); 
            props.sendMessage();
        }
        
    }
    const [accessType, setAccessType] = useState('public');
    const handleAccessTypeChange = (e) => {
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
        const channel = props.userchans.find((chan) => chan.name === chatName);
    
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
      const channel = props.userchans.find((chan) => chan.name === chatName);
  
      console.log("CHAN POPULATED FOR ADMIN", channel);
  
      if (channel) {
        const channelAdmins = channel.admins;
        console.log("Channel admins:", channelAdmins);
  
        // Filter channel members based on conditions
        const filteredAdmins = channelAdmins.filter(
          (member) => member.username !== channel.owner.username && member.username !== props.yourId
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
        const channel = props.userchans.find((chan) => chan.name === chatName);
    
        console.log("CHAN POPULATED", channel);
    
        if (channel) {
          // const channelMembers = channel.members;
          console.log(".......?????PROPS MEMBERS????", props.members)
          const channelMembers = props?.members;
          console.log("Channel Members:", channelMembers);
          const filteredMembers = channelMembers.filter(
            (member) => member !== channel.owner?.username && member !== props.yourId
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
        const channel = props.userchans.find((chan) => chan.name === chatName);
    
        console.log("CHAN POPULATED", channel);
    
        if (channel) {
          const channelusers = props?.users;
          console.log("Channel users:::::", channelusers);
          const filteredusers = channelusers.filter(
            (user) => user.username !== channel.owner?.username && user.username !== props.yourId
          );
          console.log("FILTERED users:::::", filteredusers);
    
          return filteredusers;
        }
      }
    
      return null; // Or handle the case when no channel or users are found
    };
    
    const filteredUsers = UserListPublic(props.currentChat.chatName);
    const filteredUsersUsernames = filteredUsers?.map((user) => user.username);
    
  function seeProfile(username: string): void {
    console.log("SEE PROFILE of", username, "if you want to find the User you need to put this.userservice.findonebyname")
  }

  function playPong(): void {
  
    console.log("PLAY PONNNNG with 2 usernames. User to find with userservice.findonebyname()", props.members[0], props.members[1])
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
  {props.users?.map((user, i) => (
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
      {/* {((!isDM) && (!isBanned) && (!(props.accessType === "protected" && props.passwordError))) && props.currentChat.chatName && ( */}
        {((!isDM) && (!isBanned) &&  isMember(props.currentChat.chatName)  && props.currentChat.chatName &&
        <ChannelInfo>
        {/* <p style={{ fontWeight: 500, fontSize: '0.875rem' }}> {props.currentChat.chatName}</p> */}
            {/* <p style={{ fontWeight: 500, fontSize: '0.875rem' }}>{props.members?.join(', ')}</p> */}

            {(!isDM && props.userchans[0] && !((props.accessType !== 'private')  && !isAdmin)) && (
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
  <Button3 onClick={() => playPong()}>
    Play pong
  </Button3>
</div>

  </ChannelInfo>
)}
{showModal2 && (
  <ModalContainer2>
    <CloseButton onClick={closeModal2}>X</CloseButton>
    
    <div>
    {isAdmin  &&  (props.accessType === 'private') &&
      <MemberList isAdmin={isAdmin} accessType={props.accessType} members={filteredMembersUsernames} kickFunction={kickMember} banFunction={banMember} muteFunction={muteMember} />
    }
    {isAdmin  &&  (props.accessType !== 'private') &&
      <MemberList isAdmin={isAdmin} accessType={props.accessType} members={filteredUsersUsernames}  banFunction={banMember} muteFunction={muteMember} />
    }
    {/* {isAdmin &&
      <MemberList isAdmin={isAdmin} accessType={props.accessType} members={filteredMembersUsernames} kickFunction={kickMember} banFunction={banMember} muteFunction={muteMember} />
    } */}
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
       {/* && (props.accessType === 'private') */}
    {isOwner && (props.accessType === 'private') && (
            <div style={{ display: 'flex', alignItems: 'center' , justifyContent: 'center'}}>
  <Button3 onClick={openAddUserModal}>Add user</Button3>
  </div>
    )}
      <PopupModal
        isOpen={showAddUserPopup}
        onRequestClose={closeAddUserModal}
        onSave={addUser} //attention: plutot call invite que add non ? appelle add apres premiere connexion?? en consideration des chats prives
        onCancel={closeAddUserModal}
        value={member}
        onChange={handleMemberAdding}
        placeholder="Enter username here"
        modalId="add-user-modal"
        buttonText="Add User"
      />
       {isOwner && (props.accessType !== 'public') && (
      <div>
<h3 style={{ fontWeight: 500, fontSize: 'medium', color: '#8d2bd2' }}>All Members except owner and yourself</h3>

  <ul>
  {filteredMembersUsernames?.map((user, i) => (
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
    {isOwner && (props.accessType === 'public' || props.accessType === 'protected') && (
<div>
<h3 style={{ fontWeight: 500, fontSize: 'medium', color: '#8d2bd2' }}>All Members</h3>
<ul>
  {filteredUsersUsernames?.map((user, i) => (
    user !== props.currentUser.username && (
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
</div>
    )}
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
{props.accessType === 'private' &&
<div style={{ display: 'flex', alignItems: 'center' , justifyContent: 'center'}}>
<Button3 onClick={() => {
      props.removeMember(props.yourId);
    closeModal2();

    }}>	
      Leave Chan
    </Button3>	
    </div>
}
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
