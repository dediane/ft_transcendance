import styled from "styled-components";

const Button = styled.button`

  position: relative;
 
  font-family: Arial, sans-serif;
  font-size: 14px;
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


const MemberName = styled.span`

  position: relative;
 
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: bold;
  color: var(--line_color);
  letter-spacing: 2px;
`;

function MemberList({ isAdmin, accessType, members, kickFunction, banFunction, muteFunction }) {
if (!members)
  return;
    const handleKickClick = (memberName) => {
      kickFunction(memberName);
    };
  
    const handleBanClick = (memberName) => {
      banFunction(memberName);
    };
  
    const handleMuteClick = (memberName) => {
      muteFunction(memberName);
    };
  
    return (
      <ul>
        {members?.map((member, index) => (
          <li key={index}>
            <div>

            <MemberName>{member}</MemberName>
            {/* Display kick button only if the channel is private and the user is an admin */}
            {isAdmin && accessType === 'private' && (
              <Button onClick={() => handleKickClick(member)}>| Kick </Button>
            )}
            {/* Display ban and mute buttons for all admins */}
            {isAdmin && (
              <div>
                <Button onClick={() => handleBanClick(member)}>| Ban </Button>
                <Button onClick={() => handleMuteClick(member)}> | Mute |</Button>
              </div>
            )}
              </div>

          </li>
        ))}
      </ul>
    );
         }

  export default MemberList;