import React, { useState, useEffect} from 'react';
import styled from "styled-components"
import Popup from 'reactjs-popup';
import Modal from "react-modal";
import PopupModal from "./PopUpModal"
import CustomPopup from "./CustomPopup"
import { m } from 'framer-motion';

// const initialRooms = [
//     "general",
//     "random",
//     "jokes",
//     "javascript"
// ];
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

// const TextBox = styled.textarea`
//     height: 15%;
//     width: 100%;
// `;

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


// const ModalContainer2 = styled.div`
//   height: 100%;
//   width: 15%;
//   border-left: 1px solid black;
//   position: absolute;
//   top: 0;
//   right: 0;
//   display: flex;

// `;

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


const RoomNameSection = styled.div`
  /* styles for the room name section */
`;

const UsersSection = styled.div`
  /* styles for the users section */
`;

const Input = styled.input`
  /* styles for the input fields */
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
        // setRooms([...rooms, newRoom]);
        // props.createNewChannel(newRoom);

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

      function handleRoomNameSubmit() {
        // add the new room to the list of rooms
       
        setRooms([...rooms, roomName]);
        // reset the room name state variable
        setRoomName('');
      }
      
      function handleUsersToAddSubmit() {
        // add the new users to the room
        // code to add users here...
        // reset the users to add state variable
        setUsersToAdd('');
      }

    // function addRoom() {
    //     setNewRoomName('');
    //     const newRoomName = window.prompt('Enter the name of the new room');
    //     if (newRoomName !== null && newRoomName !== '') {
    //         setRooms([...rooms, newRoomName]);
    //     }
    // }


    
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
        return(
            <Row onClick={() => {
                props.toggleChat(currentChat);
            }} key={user.username}>
                {user.username}
            </Row>
        )
    }

    function renderMessages(message, index){
        return (
            <div key={index}>
                <h3>{message.sender}</h3>
                <p>{message.content}</p>
            </div>
        )
    }


    function renderMembersOfTheRoom(room) {
      console.log("member array", props.currentChat.members);
      return (
        <div>
          <h3>Members of this channel:</h3>
          <ul>
            {props.currentChat.members.map((member, index) => (
              <li key={index}>{member}</li>
            ))}
          </ul>
        </div>
      );
    }
    function handleRemoveFromChan(member: any): void {
      throw new Error('Function not implemented.');
    }

    function handleMakeAdmin(member: any): void {
      throw new Error('Function not implemented.');
    }


    function changeMembersOfTheRoom(room) {
      console.log("member array", props.currentChat.members);
   
      return (
        <div>
          <h3>Members of this channel:</h3>
          <ul>
            {props.currentChat.members.map((member, index) => (
              <li key={index}>
                {member}
                <button onClick={() => handleRemoveFromChan(member)}>Remove from Chan</button>
                <button onClick={() => handleMakeAdmin(member)}>Make Admin</button>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    

    function renderUser(user){
          return (
              <Row key={user.username}>
                  You: {user.username}
              </Row>
          );
      const currentChat = {
          chatName : user.username,
          isChannel: false,
          receiverId: user.username,
      };
      // return(
      //     <Row onClick={() => {
      //         props.toggleChat(currentChat);
      //     }} key={user.username}>
      //         {user.username}
      //     </Row>
      // )
  }

    

    let body;
    if(!props.currentChat.isChannel || props.connectedRooms.includes(props.currentChat.chatName)){
        body = (
            <Messages>
                {props.messages?.map(renderMessages)}
            </Messages>
        )
    } else
    {
        body = (
            <button onClick={() => props.joinRoom(props.currentChat.chatName)}> Join {props.currentChat.chatName}</button>
        )
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
  <TextBox
    value={chatName}
    onChange={handleChatNameChange}
    onKeyPress={handleChatNameKeyPress}
    placeholder="Enter chat name here"
  />

  <div>
    <input type="checkbox" id="password-checkbox" onChange={handlePasswordToggle} />
    <label htmlFor="password-checkbox">Require Password</label>
  </div>
  {requirePassword && (
    <TextBox
      value={password}
      onChange={handlePasswordChange}
      placeholder="Enter password here"
    />
  )}
                   
  <button onClick={() => closeModal()}>Close Modal</button>
</ModalContainer>
                )}
                <h3>Channels</h3>
                {/* {props.rooms?.map(renderRooms)} */}
                {props.rooms && Array.isArray(props.rooms) && props.rooms.map(renderRooms)}

        <h3>All connected Users</h3>
        {props.allUsers?.map(renderUser)}
     </SideBar>

     <ChatPanel>
        <ChannelInfo>
            {props.currentChat.chatName}    
            {props.currentChat?.members?.map(renderMembersOfTheRoom)} 

            {/* {props.currentChat.members}     a ajouter */}
            {/* <button onClick={openModal2}> Parameters : Add members, block, kick, change password</button> */}
            <button onClick={openModal2}>
               Parameters : Add members, block, kick, change password
            </button>
        </ChannelInfo>
        <BodyContainer>
        {/* <Popup open={showPopup} onClose={() => setShowPopup(false)}>
  <div>The room has been deleted</div>
</Popup> */}
{showModal2 && (
  <ModalContainer2>
    <CloseButton onClick={closeModal2}>X</CloseButton>
    {props.currentChat?.members?.map(changeMembersOfTheRoom)} 
            
{/* ADMIN :
    - Remove member
    - change a member to admin
    - remove an admin
     // a rechecker
    */}
    {/* <h3>Members of this chan</h3> */}
        {/* {props.members?.map(renderMembersOfTheRoom)}  */}
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
{/*si l'admin n'est membre encore a ajouter dans la liste des membres avant !!donc je changerais ca pour que toggle une liste des membres et ne peut cliquer que sur membre pour admin adding */}
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
    </div>

    <Button onClick={() => {
      props.removeChannel(props.currentChat.chatName);
      // setShowPopup(true); // set showPopup to true to display the popup
      // closeModal2(); // close the modal
    }}>	
      Remove Channel

    </Button>	

    ALL USERS:
    - Block a member	
    - Mute a member	
    - Leave Chan



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
