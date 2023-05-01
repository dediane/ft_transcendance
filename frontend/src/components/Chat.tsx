import React, { useState, useEffect} from 'react';
import styled from "styled-components"
import Popup from 'reactjs-popup';
import Modal from "react-modal";
import PopupModal from "./PopUpModal"
import CustomPopup from "./CustomPopup"
import { m } from 'framer-motion';
import Link from 'next/link';
import MemberList from './MemberList';
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
    height: 100%;
    width: 15%;
    border-right: 1px solid black;
`;

const ChatPanel = styled.div`
    height: 100;
    width: 85%;
    display: flex;
    flex-direction: column;
`;

const BodyContainer = styled.div`
    width: 100%;
    height: 75%;
    overflow: scroll;
    border-bottom: 1px solid black;
`;

const ChannelInfo = styled.div`
    height: 10%;
    width: 100%;
    border-bottom: 1px solid black;
`;

const Row = styled.div`
    cursor: pointer;
`;

const Messages = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;
const ModalContainer = styled.div`
height: 100%;
border-right: 1px solid black;
`;

const ModalContainer2 = styled.div`
  height: 100%;
  width: 20%;
  border-left: 1px solid black;
  position: absolute;
  background-color: pink;
  top: 80px;
  right: 0;
  z-index: 1;
  padding: 20px;
`;

const Button = styled.button`
  /* styles for the buttons */
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
  const [member, setMember] = useState('');
  const [admin, setAdmin] = useState('');

  
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
    props.addMember(member);

    // do something with the new user
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
  const newRoom = {
    chatName: chatName,
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
            <Row onClick={() => props.toggleChat(currentChat)} key={room}>
                {room}
            </Row>
        )
    }


    function renderUser(user){
        console.log("render user");
        if (user.username === props.yourId){
            return (
                <Row key={user.username}>
                    You: {user.username}
                </Row>
            );
        }
        const currentChat = {
            chatName : user.username,
            isChannel: false,
            receiverId: user.username,
        };
    }

    function renderMessages(message, index){
        return (
            <div key={index}>
                <h3>{message.sender}</h3>
                <p>{message.content}</p>
            </div>
        )
    }


    let body;
    // // if(!props.currentChat?.isChannel || props.connectedRooms.includes(props.currentChat.chatName)){
    //     body = (
    //         <Messages>
    //             {props.messages?.map(renderMessages)}
    //         </Messages>
    //     )
    // // }
    // else
    // {
        // body =
        // (
        //     <button onClick={() => props.joinRoom(props.currentChat.chatName)}> Join {props.currentChat.chatName}</button>
        // )
    // }

    if (props.currentChat?.isChannel && !props.connectedRooms.includes(props.currentChat.chatName)) {
      body = (
        <>
          <input type="password" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={() => props.joinRoom(props.currentChat.chatName, password)}>Join {props.currentChat.chatName}</button>
        </>
      );
    } else {
      body = (
        <Messages>
          {props.messages?.map(renderMessages)}
        </Messages>
      );
    }
    

    function handleKeyPress(e){
        if(e.key === "Enter"){
            props.sendMessage();
        }
    }

    return (
        <Container>
            <SideBar>
              
                <Button onClick={openModal}>Add Room</Button>
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

      <div>
        <input
          id="passwordCheckbox"
          type="checkbox"
          checked={requirePassword}
          onChange={handlePasswordToggle}
        />
        <label htmlFor="passwordCheckbox">Require Password</label>
      </div>

      {requirePassword && (
        <><label htmlFor="passwordInput">Password:</label><input
                    id="passwordInput"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter password here"
                    required /></>
      )}

      <button type="submit">Create Group</button>
    </form>
                   
  <button onClick={() => closeModal()}>Close Modal</button>
</ModalContainer>
                )}
                <h3>Channels</h3>
                
                {props.rooms?.map(renderRooms)}
                {/* {props.rooms && Array.isArray(props.rooms) && props.rooms.map(renderRooms)} */}
                {/* {props.currentChat.members && Array.isArray(props.currentChat.members) && props.currentChat.members.map(renderUser)} */}

        <h3>All connected Users</h3>
        {props.allUsers?.map(renderUser)}

        <h3> Send DM to user/friend</h3>
        <div>
      <button onClick={openBlockUserModal}>Block a user</button>
      <PopupModal
        isOpen={showBlockUserPopup}
        onRequestClose={closeBlockUserModal}
        onSave={blockUser}
        onCancel={closeBlockUserModal}
        value={blockUsername}
        onChange={handleBlockUserChange}
        placeholder="Enter the username of the person you want to block"
        modalId="block-user-modal"
        buttonText="Save"
      />
      <button onClick={openUnblockUserModal}>Unblock a user</button>
      <PopupModal
        isOpen={showUnblockUserPopup}
        onRequestClose={closeUnblockUserModal}
        onSave={UnblockUser}
        onCancel={closeUnblockUserModal}
        value={UnblockUsername}
        onChange={handleUnblockUserChange}
        placeholder="Enter the username of the person you want to Unblock"
        modalId="Unblock-user-modal"
        buttonText="Save"
      />
        </div>

     </SideBar>

     <ChatPanel>
        <ChannelInfo>
            {props.currentChat.chatName}    
            <p>{props.members?.join(', ')}</p>

            <button onClick={openModal2}>
               Parameters : Add members, block, kick, change password
            </button>
        </ChannelInfo>
        <BodyContainer>
        <div>
    </div>
{showModal2 && (
  <ModalContainer2>
    <CloseButton onClick={closeModal2}>X</CloseButton>
    
    <div>
      <MemberList members={props.members} kickFunction={kickMember} banFunction={banMember} muteFunction={muteMember} />
    </div>
    <div>
      <button onClick={openPasswordModal}>Change password of the chat</button>
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
      <button onClick={openAddUserModal}>Invite user/add member to the chat</button>
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
{/* a mettre uniquement pour l'owner et sous forme de coche de la toggled member list */}
<button onClick={openAddAdminModal}>Add admin to Chat</button> 
      <PopupModal
        isOpen={showAddAdminPopup}
        onRequestClose={closeAddAdminModal}
        onSave={addAdmin} //attention: plutot call invite que add non ? appelle add apres premiere connexion?? en consideration des chats prives
        onCancel={closeAddAdminModal}
        value={admin}
        onChange={handleAdminAdding}
        placeholder="Enter username here"
        modalId="add-user-modal"
        buttonText="Add User"
      />
      <button onClick={openRemoveAdminModal}>Remove admin from Chat</button> 
      <PopupModal
        isOpen={showRemoveAdminPopup}
        onRequestClose={closeRemoveAdminModal}
        onSave={removeAdmin} //attention: plutot call invite que Remove non ? appelle Remove apres premiere connexion?? en consideration des chats prives
        onCancel={closeRemoveAdminModal}
        value={AdmintoRemove}
        onChange={handleAdminRemoveing}
        placeholder="Enter username here"
        modalId="Remove-user-modal"
        buttonText="Remove User"
      />


    </div>

    <Button onClick={() => {
      props.removeChannel(props.currentChat.chatName);
    }}>	
      Remove Channel
    </Button>	

{/*A TESTER, ALL MEMBERS*/}
<Button onClick={() => {
      props.removeMember(props.yourId);
      closeRemoveMemberModal();
    }}>	
      Leave Chan
    </Button>	

  </ModalContainer2>
)}
{body}


        </BodyContainer>
        <TextBox
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
