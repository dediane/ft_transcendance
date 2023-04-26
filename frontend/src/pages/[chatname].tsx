import { useRouter } from "next/router";

function ChatRoom() {
  const router = useRouter();
  const { chatname } = router.query;

  return <div>Chat Room: {chatname}</div>;
}

export default ChatRoom;
