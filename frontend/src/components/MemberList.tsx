import styled from "styled-components";

const Button = styled.button`
  display: inline-flex;
  border-radius: 0.7rem;
  background-image: linear-gradient(to right, #ff4b96, #ff83a8);
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #fff;
`;

const MemberName = styled.span`
  position: relative;
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: bold;
  color: var(--line_color);
  letter-spacing: 2px;
`;

function MemberList({ isAdmin , accessType, members, kickFunction, banFunction, muteFunction }: { isAdmin: boolean; accessType: string; members: any[]; kickFunction: Function; banFunction: Function; muteFunction: Function }) {
  if (!members) return null;

  const handleKickClick = (memberName : any) => {
    kickFunction(memberName);
  };

  const handleBanClick = (memberName : any) => {
    banFunction(memberName);
  };

  const handleMuteClick = (memberName : any) => {
    muteFunction(memberName);
  };

  return (
    <ul>
      {members?.map((member, index) => (
        <li key={index}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontWeight: 500, fontSize: '0.875rem', marginRight: 'auto' }}>
            {member}
          </span>
            {/* Display kick button only if the channel is private and the user is an admin */}
            {isAdmin && accessType === 'private' && (
              <Button onClick={() => handleKickClick(member)}>Kick</Button>
            )}
            {/* Display ban and mute buttons for all admins */}
            {isAdmin && (
              <div>
                <Button onClick={() => handleBanClick(member)}>Ban</Button>
                <Button onClick={() => handleMuteClick(member)}>Mute</Button>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default MemberList;
