import GuestIcon from "assets/Tiger.png";
import moment from "moment";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import MessageService from "services/message.service";
import SocketService from "services/socket.service";

export default function Chat() {
  const dispatch = useAppDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAppSelector((state) => state.auth);
  const { messages } = useAppSelector((state) => state.message);
  console.log("this is messages", messages);
  useEffect(() => {
    MessageService.getMessages(dispatch);
    SocketService.message(user?._id, dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <>
      {/* <h2 className="heading">Chat</h2> */}
      <div style={{ height: "calc( 100vh - 282px )", overflowY: "auto" }}>
        {messages.map((message: any, index: any) => (
          <div className="chat-message" key={index} ref={scrollRef}>
            <div className="chat-user-data">
              <img
                src={
                  message.sender && message.sender?.profile_image
                    ? message.sender?.profile_image
                    : GuestIcon
                }
                alt="Guest"
              />
              <p style={{ textTransform: "capitalize" }}>
                {message.sender != null && message.sender.name}
              </p>
            </div>
            <div className="bubble">
              <div className="bubble-inner">
                <p style={{ textAlign: "right" }}>
                  {message.sender != null && message.sender.race
                    ? message.sender.race
                    : "human"}
                </p>
                <div>
                  <p>{message.message}</p>
                </div>
                <div className="race-chat">
                  <p>
                    {moment(message.createdAt).format("h:mm a")}&nbsp;&nbsp;
                  </p>
                  <p>{moment(message.createdAt).format("DD/MM/yyyy")} </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
