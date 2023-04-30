function MemberList({ members, kickFunction, banFunction, muteFunction }) {
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
            {member}
        {/* if member affiché est l'owner ne pas afficher ces boutons */}
            <button onClick={() => handleKickClick(member)}>| Kick</button>
            <button onClick={() => handleBanClick(member)}>| Ban</button>
            <button onClick={() => handleMuteClick(member)}>| Mute</button>
          </li>
        ))}
      </ul>
    );
  }

  export default MemberList;