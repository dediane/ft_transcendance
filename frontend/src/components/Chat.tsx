import React, { useState, useEffect} from 'react';
import styled from "styled-components"
import Popup from 'reactjs-popup';
import Modal from "react-modal";
import PopupModal from "./PopUpModal"
import CustomPopup from "./CustomPopup"
import { m } from 'framer-motion';
import Link from 'next/link';
import MemberList from './MemberList';
import MemberListModal from './MemberListModal';
// import ChatRoom from '@/pages/[chatname]';


import Message from '@/components/Message';
// import ChatRoom from '@/pages/[chatname]';


const TextBox = styled.textarea`
    height: 15%;
    width: 100%;
`;

const Container = styled.div`
    height: 100vh;
    width: 100%;
    display: flex;
`;

const AddRoomButton = styled.div`
  background-color: blue;
  color: white;
  padding: 10px;
  cursor: pointer;
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

// ce sont ces lignes qui font bug le password en le mettant en bas mais peut pas enlever sinon le toggle to the bottom quand envoie message ne fonctionne pas    display: flex;
// flex-direction: column-reverse;

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

    display: flex;
align-items: flex-start;
justify-content: space-between;
`;



// const Row = styled.div`
//     cursor: pointer;
// `;

const Row = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;

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
// const TextBox = styled.textarea`
//   width: 100%;
//   height: 15%;
//   overflow: scroll;
  
//   &.show-modal {
//     width: 75%;
//     height: calc(100% - 40px); /* Adjust the value if needed */
//     margin-right: 25%;
//   }
// `;

// const ModalContainer2 = styled.div`
//   height: 100%;
//   width: 20%;
//   position: absolute;
//   background-color: white;
//   right: 0;
//   z-index: 1;
//   padding: 20px;
//   overflow-y: scroll;
// `;

// .button { 
// 	display: block;
// 	width: 100%;
// 	border-radius: 0.5rem;
// 	background-image: linear-gradient(to right, #ff4b96, #ff83a8);
// 	padding-left: 1.25rem;
// 	padding-right: 1.25rem;
// 	padding-top: 0.75rem;
// 	padding-bottom: 0.75rem;
// 	font-size: 0.875rem;
// 	font-weight: 500;
// 	color: #fff;
// }

// .button:hover {
// background-image: linear-gradient(to right, #ff6fab, #ffa2c1);
// }
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
const Button = styled.button`
  position: relative;

  font-size: 0.875rem;

  font-weight: bold;
  color: var(--line_color);
  letter-spacing: 2px;
  transition: all 0.3s ease;
  overflow-wrap: break-word;
  &:hover {
    letter-spacing: 6px;
  }
  
  &::before,
  &::after,
  .button__text::before,
  .button__text::after {
    content: "";
    position: absolute;
    height: 3px;
    border-radius: 2px;
    background: var(--line_color);
    transition: all 0.5s ease;
  }
  
  &::before {
    top: 0;
    left: 54px;
    width: calc(100% - 128px);
  }
  
  &::after {
    top: 0;
    right: 54px;
    width: 8px;
  }
  
  .button__text::before {
    bottom: 0;
    right: 54px;
    width: calc(100% - 128px);
  }
  
  .button__text::after {
    bottom: 0;
    left: 54px;
    width: 8px;
  }
  
  &:hover::before,
  &:hover .button__text::before {
    width: 8px;
  }
  
  &:hover::after,
  &:hover .button__text::after {
    width: calc(100% - 128px);
  }
`;

const Button2 = styled.button`
  position: relative;
  width: 100px;
  font-size: 0.875rem;
  font-weight: bold;
  color: var(--line_color);
  letter-spacing: 2px;
  transition: all 0.3s ease;

  &:hover {
    letter-spacing: 6px;
  }

  &::before,
  &::after,
  .button__text::before,
  .button__text::after {
    content: "";
    position: absolute;
    height: 3px;
    border-radius: 2px;
    background: var(--line_color);
    transition: all 0.5s ease;
  }

  &::before {
    top: 0;
    left: 54px;
    width: calc(100% - 128px);
  }

  &::after {
    top: 0;
    right: 54px;
    width: 8px;
  }

  .button__text::before {
    bottom: 0;
    right: 54px;
    width: calc(100% - 128px);
  }

  .button__text::after {
    bottom: 0;
    left: 54px;
    width: 8px;
  }

  &:hover::before,
  &:hover .button__text::before {
    width: 8px;
  }

  &:hover::after,
  &:hover .button__text::after {
    width: calc(100% - 128px);
  }
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
    const [rooms, setRooms] = React.useState(props.rooms);
    // const [rooms, setRooms] = React.useState(Array.from(new Set(props.rooms)));
// const [rooms, setRooms] = useState<string[]>(props.rooms);

  const [newRoomName, setNewRoomName] = React.useState('');
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
  
  // const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setPassword(event.target.value);
  // };

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
  






  const openAddAdminModal = () => {
    setShowAddAdminPopup(true);
  };

  const closeAddAdminModal = () => {
    setShowAddAdminPopup(false);
    // setPassword('');
  };

  
  const addAdmin = () => {
  props.addAdmin(admin);

    // do something with the new user
    closeAddAdminModal();
  };

  function handleAdminAdding(event) {
    setAdmin(event.target.value);
  }
  const [blockedUsers, setBlockedUsers] = useState(props.currentUser?.blockedUsers || []);


  const isUserBlocked = (username : string) => {
    // console.log("BLOC CHANELS POPULATEd", props.currentUser.username, props.currentUser?.adminChannels)
    return blockedUsers.some((user) => user.username === username);
  };
  const blockUser2 = (username) => {
    const updatedBlockedUsers = [...blockedUsers, { username }];
    setBlockedUsers(updatedBlockedUsers);
    // Additional logic to save the updated blocked users in the backend or perform any necessary operations
    props.blockUser(username);
  };

  const unblockUser2 = (username) => {
    const updatedBlockedUsers = blockedUsers.filter((user) => user.username !== username);
    setBlockedUsers(updatedBlockedUsers);
    // Additional logic to save the updated blocked users in the backend or perform any necessary operations
    props.unblockUser(username);
  };

  const [adminUsers, setAdminUsers] = useState(props.currentUser?.adminUsers || []);

 
  const isMemberAdmin = (username: string) => {
    // return(filteredAdmins.some(
    //   (admin) => admin.username === username
    // ));
    return props.admins[props.currentChat.chatName].includes(username);
    };
  

  const addAdmin2 = (username) => {
    const updatedAdminUsers = [...adminUsers, username];
    setAdminUsers(updatedAdminUsers);
    // Additional logic to save the updated admin users in the backend or perform any necessary operations
    props.addAdmin(username);
  };

  const removeAdmin2 = (username) => {
    const updatedAdminUsers = adminUsers.filter((admin) => admin !== username);
    setAdminUsers(updatedAdminUsers);
    // Additional logic to save the updated admin users in the backend or perform any necessary operations
    props.removeAdmin(username);
  };

  const isUserAdmin = (channelName : string) => {
    // console.log("ADMIN CHANNELS POPULATEd",  props.currentUser?.adminChannels)
     // Check if the channel exists in the admins object
     if (props.admins && props.admins[channelName]) {
      // Check if the current user is in the admins list of the channel
      return props.admins[channelName].includes(props.yourId);
     }
    
  
  };
  const isAdmin = isUserAdmin(props.currentChat.chatName);

  const isUserBanned= (channelName : string) => {
    if (props.bannedmembers && props.bannedmembers[channelName]) {
      // Check if the current user is in the bannedmembers list of the channel
      return props.bannedmembers[channelName].includes(props.yourId);
     }
    //  console.log("isbannedCHANNELS POPULATEd",  props.currentUser?.isbanned)
    // if (props.currentUser && props.currentUser.isbanned) {
    //   return props.currentUser.isbanned.some(
    //     (chan) => chan.name === chatName
    //   );
    // }
    // return false;
  };
  const isBanned= isUserBanned(props.currentChat.chatName);


  const isUsermuted= (channelName : string) => {
    if (props.mutedMembers && props.mutedMembers[channelName]) {
      // Check if the current user is in the mutedMembers list of the channel
      return props.mutedMembers[channelName].includes(props.yourId);
     }

  };
  const ismuted= isUsermuted(props.currentChat.chatName);

  // const isUserOwner = (user: User, channelName: string): boolean => {
  //   console.log("OWNER CHANNELS POPULATEd", props.currentUser?.username, props.currentUser?.ownedChannels)

  //   return user?.ownedChannels.some((channel: Channel) => channel.name === channelName);
  // };
  
  // const isOwner = isUserOwner(props.currentUser, props.currentChat.chatName);

  
  const isUserOwner = (channelName: string): boolean => {
    console.log("?????CHAT PROPS OWNER", channelName, "is", props.owner[channelName])
    return (props.owner[channelName] == props.yourId)
    // return props.owner[channelName].includes(props.yourId);
  };
  
  const isOwner = isUserOwner(props.currentChat.chatName);

  const [blockUsername, setBlockUser] = useState('');
  const [showBlockUserPopup, setBlockUserPopup] = useState(false);

  const openBlockUserModal = () => {
    setBlockUserPopup(true);
  };

  const closeBlockUserModal = () => {
    setBlockUserPopup(false);
    setBlockUser('');
  };
  
  const blockUser = () => {
  props.blockUser(blockUsername);
    // do something with the new user
    closeBlockUserModal();
  // location.reload();

  };

  function handleBlockUserChange(event) {
    setBlockUser(event.target.value);
  }

 

  const [UnblockUsername, setUnblockUser] = useState('');

  const [showUnblockUserPopup, setUnblockUserPopup] = useState(false);




  const openUnblockUserModal = () => {
    setUnblockUserPopup(true);
  };

  const closeUnblockUserModal = () => {
    setUnblockUserPopup(false);
    setUnblockUser('');
  };
  
  const UnblockUser = () => {
  props.unblockUser(UnblockUsername);
  

    // do something with the new user
    closeUnblockUserModal();
  };

  function handleUnblockUserChange(event) {
    setUnblockUser(event.target.value);
  }


  
  const [AdmintoRemove, setAdmintoRemove] = useState('');
  const [showRemoveAdminPopup, setShowRemoveAdminPopup] = useState(false);

  const openRemoveAdminModal = () => {
    setShowRemoveAdminPopup(true);
  };

  const closeRemoveAdminModal = () => {
    setShowRemoveAdminPopup(false);
    // setPassword('');
  };

  const removeAdmin = () => {
  props.removeAdmin(AdmintoRemove);

    // do something with the new user
    closeRemoveAdminModal();
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
  // const newRoom = {
  //   chatName: chatName,
  //   password: requirePassword ? password : null
  // };

  const newRoom = {
    chatName: chatName,
    accessType: accessType,
    password: requirePassword ? password : null
  };
  props.createNewChannel(newRoom);
    // do something with the new user
    // closeAddAdminModal();
  };

function handleChatNameKeyPress(event) {
  if (event.key === "Enter" || event.key === "Next") {
    event.preventDefault();
    // add the new room to the list of rooms if it doesn't already exist
    if (chatName !== null && chatName !== '') {
      if (!rooms.includes(chatName)) {
        const newRoom = {
          chatName: chatName,
          password: requirePassword ? password : null
        };
        setRooms([...rooms, chatName]);
        props.createNewChannel(newRoom);
      } else {
        setShowPopup(true);
        console.log('Error: Room already exists'); // add the error message to the screen
      }
    }
    // reset the chat name state variable
    setChatName('');
    setShowModal(false);
  }
}


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


    function renderRooms(room){
        const currentChat = {
            chatName: room,
            isChannel: true,
            receiverId: "",
        };
        return (
          <Row style={{ fontWeight: 500, fontSize: '0.875rem' }} onClick={() => props.toggleChat(currentChat)} key={room}>
          {room}
      </Row>
      
        )
    }


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
          <div onClick={() => {
              props.toggleChat(currentChat);
          }} key={user.username}>
              {user.username}
          </div>
      )
  }

  const userStyle = {
    fontweight: "500",
    fontsize: " 0.875rem",
  };

    // function renderMessages(message, index){
    //     return (
    //         <div key={index}  style={userStyle}>
    //             <h3>{message.sender}</h3>
    //             <p>{message.content}</p>
    //         </div>
    //     )
    // }


    // function renderMessages(message, index) {
    //   const isMyMessage = message.sender === props.yourid;
    
    //   return (
    //     <Message key={index} isMyMessage={isMyMessage}>
    //       <h3>{message.sender}</h3>
    //       <p>{message.content}</p>
    //     </Message>
    //   );
    // }


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
if (isBanned) {
  body = (
    <Messages>
      Can't access this chan, you were banned from this channel
    </Messages>
  );
} else {
  body = (
    
    <Messages>
      {props.messages?.map(renderMessages)}
    </Messages>
  );
}

        if (props.accessType === 'protected') {
  body = (
    <>
         <Pass>
      <input type="password" placeholder="Enter password" onChange={(e) => setUserPassword(e.target.value)} />
      <Button3 onClick={() => props.checkChatPassword(userPassword)}>Join {props.currentChat.chatName}</Button3>
      {props.passwordError && <span style={{color: 'red'}}>Try again.</span>}
    
    </Pass>  {/* {!props.passwordError && <Button onClick={() => props.joinRoom(props.currentChat.chatName)}>Join {props.currentChat.chatName}</Button>} */}
    </>
  );
  if (!props.passwordError)
  {
    body = (
      <Messages>
          {props.messages?.map(renderMessages)}
      </Messages>
  )
  }
    }
    function handleKeyPress(e){
        if(e.key === "Enter"){
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
    // const UserList = (chatName : string) => {
    //   console.log("USERLIST POPULATEd",  props.userchans)
    //   if (props.userchans)
    //   {
    //     const channel = props.userchans.some(
    //       (chan) => chan.name === chatName
    //     );
    //   console.log("CHAN POPULATEd",  channel)

        

    //   }
   

    //   // if (props.currentUser && props.currentUser.adminChannels) {
    //   //   return props.currentUser.adminChannels.some(
    //   //     (chan) => chan.name === chatName
    //   //   );
    //   // }
    //   // const chanmembers = channel?.members;

    //   // const filteredMembers = chanmembers.filter(member => member === channel.owner && member === yourId);

    //   // return filteredMembers;
    // };
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
          // Filter channel members based on conditions
          // const filteredMembers = channelMembers.filter(
          //   (member) => member.username !== channel.owner?.username && member.username !== props.yourId
          // );
          console.log("FILTERED MEMBERS:", filteredMembers);
    
          return filteredMembers;
        }
      }
    
      return null; // Or handle the case when no channel or members are found
    };
    
    // const [filteredMembers, setFilteredMembers] = useState([]);
    // if (!isDM)
    // {
      const filteredMembersUsernames = UserList(props.currentChat.chatName);

    // }
    // const filteredMembersUsernames = filteredMembers?.map((member) => member.username);
    
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

                {showModal && (
                  
                  <ModalContainer>
<form onSubmit={handleRoomCreation}>
      <label htmlFor="chatNameInput">Chat Name:</label>
      <input
        id="chatNameInput"
        type="text"
        value={chatName}
        onChange={handleChatNameChange}
        placeholder="Enter chat name here"
        required
      />
      <label htmlFor="accessTypeSelect">  Type of chan </label>
      <select id="accessTypeSelect" value={accessType} onChange={handleAccessTypeChange}>
        <option value="public">Public</option>
        <option value="protected">Protected</option>
        <option value="private">Private</option>
      </select>

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

      <Button type="submit">Create Group</Button>
    </form>
                   
  <Button onClick={() => closeModal()}>Close Modal</Button>
</ModalContainer>
                )}
                <h3 style={{ fontWeight: 500, fontSize: 'medium', color: '#8d2bd2' }}>Channels</h3>


              
                {props.rooms?.map(renderRooms)}
                {/* {props.rooms && Array.isArray(props.rooms) && props.rooms.map(renderRooms)} */}
                {/* {props.currentChat.members && Array.isArray(props.currentChat.members) && props.currentChat.members.map(renderUser)} */}

        <h3 style={{ fontWeight: 500, fontSize: 'medium', color: '#8d2bd2' }}>All connected Users</h3>

        {props.allUsers?.map(renderUser)}
{/* OK */}
        {/* <h3>All Users</h3>
        <ul>
        {props.users?.map((user, i) => (
          <li key={i}>{user.username}</li>
          ))}
        </ul> */}
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
          {/* <div style={{ marginLeft: 'auto' }}> */}
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
                    See Profile
                  </Button3>
            </>
          {/* </div> */}
        </div>
      </li>
    )
  ))}
</ul>


    </div>
        </div>

     </SideBar>

     <ChatPanel>
     {(!isDM &&
        <ChannelInfo>
        <p style={{ fontWeight: 500, fontSize: '0.875rem' }}> {props.currentChat.chatName}</p>
            <p style={{ fontWeight: 500, fontSize: '0.875rem' }}>{props.members?.join(', ')}</p>

            {(!isDM && props.userchans[0] && !((props.accessType !== 'private')  && !isAdmin)) && (
  <Button onClick={openModal2}>
    Parameters
  </Button>
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
</div>
    <div>
      {isOwner && (props.accessType === 'protected') && (
  <Button onClick={() => {
    props.removeChatPassword(props.currentChat.chatName);
  }}>
    Make chan public
  </Button>
)}
      {/* et que le user est un owner ou un admin */}

      {isOwner && (props.accessType === 'protected') && (
      <Button onClick={openPasswordModal}>Change chat password</Button>
      )}
      {/* et que le user est un owner ou un admin */}
      {isOwner && props.accessType === 'public' && (
  <Button onClick={openPasswordModal}>Make channel password-protected</Button>
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
  <Button onClick={openAddUserModal}>Add user</Button>
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
    <h3>All Members</h3>
  <ul>
  {filteredMembersUsernames?.map((user, i) => (
user!== props.currentUser.username && (
<li key={i}>
  <label>
    {user}
    {isMemberAdmin(user) ? (
      <Button3 onClick={() => removeAdmin2(user)}>
        Remove Admin
      </Button3>
    ) : (
      <Button3 onClick={() => addAdmin2(user)}>Add Admin</Button3>
    )}
  </label>
    </li>
  )
))}
      </ul>
    </div>)}
    {isOwner && (props.accessType === 'public') && (
<div>
  
    <h3>All Members</h3>
<ul>
  {filteredUsersUsernames?.map((user, i) => (
    user !== props.currentUser.username && (
      <li key={i}>
        <label>
          {user}
          {isMemberAdmin(user) ? (
            <Button2 onClick={() => removeAdmin2(user)}>
              Remove Admin
            </Button2>
          ) : (
            <Button2 onClick={() => addAdmin2(user)}>Add Admin</Button2>
          )}
        </label>
      </li>
    )
  ))}
</ul>
</div>
    )}
{/* {isOwner ? (
  <>
    <Button onClick={openAddAdminModal}>Make a user admin</Button>
    <PopupModal
      isOpen={showAddAdminPopup}
      onRequestClose={closeAddAdminModal}
      onSave={addAdmin}
      onCancel={closeAddAdminModal}
      value={admin}
      onChange={handleAdminAdding}
      placeholder="Enter the username of the user you want to make an admin"
      modalId="add-user-modal"
      buttonText="Add User"
    />

    <Button onClick={openRemoveAdminModal}>Remove admin from chat</Button>
    <PopupModal
      isOpen={showRemoveAdminPopup}
      onRequestClose={closeRemoveAdminModal}
      onSave={removeAdmin}
      onCancel={closeRemoveAdminModal}
      value={AdmintoRemove}
      onChange={handleAdminRemoveing}
      placeholder="Enter the username of the user you want to remove as an admin"
      modalId="Remove-user-modal"
      buttonText="Remove User"
    />
  </>
) : null} */}


    </div>
{isOwner &&
  <Button onClick={() => {
    props.removeChannel(props.currentChat.chatName);
  }}>
    Delete Chan
  </Button>
}
{props.accessType === 'private' &&
<Button onClick={() => {
      props.removeMember(props.yourId);
      closeRemoveMemberModal();
    }}>	
      Leave Chan
    </Button>	
}
  </ModalContainer2>
)}
        <BodyContainer className={showModal2 ? "show-modal" : ""}>

{body}

        </BodyContainer>
         <TextBox
         className={showModal2 ? "show-modal" : ""}
            value={props.message}
            onChange={props.handleMessageChange}
            onKeyPress={handleKeyPress}
            placeholder="enter message here"
        />
     </ChatPanel>
     
     </Container>
            )
}

  export default Chat;
