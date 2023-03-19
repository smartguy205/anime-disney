import GuestIcon from "assets/Tiger.png";
import moment from "moment";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import MessageService from "services/message.service";
import SocketService from "services/socket.service";
import { LightgalleryItem } from "react-lightgallery";
import { messageActions } from "redux/slices/message";
import { useSnapCarousel } from "react-snap-carousel";
export default function Chat() {
  const dispatch = useAppDispatch();
  const scrollRef_ = useRef<HTMLDivElement>(null);
  const { user } = useAppSelector((state) => state.auth);
  const message = useAppSelector((state) => state.message);
  const messages = message.isPrivate
    ? message.privateMessages.filter(
        (item) => item.clientid == message.clientId
      )
    : message.messages;
  useEffect(() => {
    MessageService.getMessages(dispatch);
    SocketService.message(user?._id, dispatch);
    SocketService.messagePrivateToUser(user?._id, dispatch);
    // if(message.isPrivate) MessageService.getPrivateMessages(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef_.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const users = useAppSelector((state) => state.user.users);

  const goToPrivateChat = (user: any) => {
    dispatch(messageActions.setPrivateChat(user));
  };
  const { scrollRef, pages, activePageIndex, next, prev, goTo } =
    useSnapCarousel();
  return (
    <>
      {message.isPrivate && (
        <div style={{ display: "flex", justifyItems: "center" }}>
          <span
            style={{
              padding: "6px",
              marginLeft: "5px",
              background: "#05467c",
              margin: "auto",
              height: "36px",
              cursor: "pointer",
            }}
            onClick={() => dispatch(messageActions.setPublic())}>
            Chat
          </span>

          <div
            style={{
              padding: "6px",
              marginLeft: "10px",
              background: "#0f7aae",
              marginTop: "23px",
              height: "36px",
              cursor: "pointer",
            }}
            onClick={() => prev()}>
            Prev
          </div>
          <ul
            ref={scrollRef}
            style={{
              display: "flex",
              overflow: "hidden",
              scrollSnapType: "x mandatory",
            }}>
            {users.map((user: any, index: number) => (
              <li
                style={{
                  height: "50px",
                  flexShrink: 0,
                  color: "#fff",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}>
                <span
                  style={{
                    padding: "6px",
                    marginLeft: "12px",
                    background: "#05467c",
                    cursor: "pointer",
                  }}
                  onClick={() => goToPrivateChat(user)}>
                  {user.name}
                </span>
              </li>
            ))}
          </ul>
          <div
            style={{
              padding: "6px",
              marginLeft: "5px",
              background: "#0f7aae",
              margin: "auto",
              height: "36px",
            }}
            onClick={() => next()}>
            Next
          </div>
        </div>
      )}

      {/* <div>
        {activePageIndex + 1} / {pages.length}
      </div>
      <button onClick={() => prev()}>Prev</button>
      <button onClick={() => next()}>Next</button> */}

      <p
        style={{ marginBottom: "10px", cursor: "pointer" }}
        onClick={() => dispatch(messageActions.setPublic())}>
        {message.isPrivate && "Back to public chat"}
      </p>
      <div style={{ height: "calc( 100vh - 282px )", overflowY: "auto" }}>
        {messages.map((message: any, index: any) => (
          <div className="chat-message" key={index} ref={scrollRef_}>
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
                    : message.name}
                </p>
                <div>
                  <p>{message.message}</p>
                </div>
                {message.attachment != "" && (
                  <div>
                    <LightgalleryItem
                      src={`${process.env.REACT_APP_FILE_URL}/${message.attachment}`}>
                      <img
                        src={`${process.env.REACT_APP_FILE_URL}/${message.attachment}`}></img>
                    </LightgalleryItem>
                  </div>
                )}
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
