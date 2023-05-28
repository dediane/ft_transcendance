import { useRouter } from "next/router";
import styled from "styled-components";

const Messages = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;
function ChatRoom(props :any) {
  // your ChatRoom component logic here
  return (
    <div>
      {/* <button onClick={() => props.renderMessages(props.currentChat)}>Toggle Chat</button>
      // your chat room UI here */}
       <Messages>
                {props.messages?.map(props.renderMessages)}
       </Messages>
    </div>
  );
}
export default ChatRoom;
