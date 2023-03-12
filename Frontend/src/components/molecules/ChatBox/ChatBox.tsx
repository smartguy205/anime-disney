import { useAppDispatch, useAppSelector } from "redux/hooks";
// import { messageActions } from "redux/slices/message";
import SocketService from "services/socket.service";
import ChatBoxForm from "./ChatBoxForm";

export default function ChatBox({ type }: any) {
  // const user = useAppSelector((state) => state.auth.user);
  // const chat = useAppSelector((state) => state.chat.chats);
  // const guest = useAppSelector((state) => state.user.user);
  const handleSubmit = (values: any) => {
    // values.user = user ? user.username : guest?.name;
    values.id = localStorage.getItem("socketId");
    SocketService.send(values);
  };

  return <ChatBoxForm onSubmit={handleSubmit} />;
}
