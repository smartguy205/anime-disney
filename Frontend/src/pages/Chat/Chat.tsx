import GuestIcon from "assets/Tiger.png";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import MessageService from "services/message.service";
import SocketService from "services/socket.service";
import { LightgalleryItem } from "react-lightgallery";
import { messageActions } from "redux/slices/message";
import Carousel, {
  useSnapCarousel,
  SnapCarouselResult,
} from "react-snap-carousel";

// import ReactHtmlParser from "react-html-parser";

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
    if (user) {
      console.log(user);
      MessageService.getPrivateMessages(user._id, dispatch);
    }
    MessageService.getMessages(dispatch);

    SocketService.message(user?._id, dispatch);
    SocketService.messagePrivateToUser(user?._id, dispatch);
    SocketService.sendPrivateMessageToClient(user?._id, dispatch);
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
  const goToPrivateChatAndStart = (user: any) => {
    dispatch(messageActions.addPrivateList(user));
    dispatch(messageActions.setPrivateChat(user));
  };
  const { scrollRef, pages, activePageIndex, next, prev, goTo } =
    useSnapCarousel();

  const convert = (item: String) => {
    return item.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  };

  return (
    <>
      <div style={{ display: "flex", justifyItems: "center" }}>
        {/* {activePageIndex > 0 && (
          <div
            style={{
              padding: "6px",
              marginLeft: "10px",

              marginTop: "21px",
              height: "40px",
              cursor: "pointer",
              border: "2px solid white",
              background: "transparent",
            }}
            onClick={() => prev()}>
            Prev
          </div>
        )} */}
        <div
          style={{
            padding: "6px",
            marginLeft: "10px",

            marginTop: "21px",
            height: "40px",
            width: "10px",
            background: "transparent",
          }}></div>
        <div style={{ width: "100%", overflow: "auto" }}>
          <ul
            ref={scrollRef}
            style={{
              paddingLeft: "10px",
              paddingRight: "10px",
              display: "flex",
              // overflow: "auto",
              position: "relative",
              scrollSnapType: "x mandatory",
              width: "fit-content",
            }}>
            {message.privateArray.map((user: any, index: number) => (
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
                    cursor: "pointer",
                    border: "2px solid white",
                    background: "transparent",
                  }}
                  onClick={() => goToPrivateChat(user)}>
                  {user.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div
          style={{
            padding: "6px",
            marginLeft: "10px",

            marginTop: "21px",
            height: "40px",
            width: "10px",
            background: "transparent",
          }}></div>
        {/* {pages.length > 1 && (
          <div
            style={{
              padding: "6px",
              marginLeft: "5px",
              margin: "auto",
              height: "40px",
              cursor: "pointer",
              border: "2px solid white",
              background: "transparent",
            }}
            onClick={() => next()}>
            Next
          </div>
        )} */}
      </div>

      {/* <div>
        {activePageIndex + 1} / {pages.length}
      </div> */}

      <p
        style={{ marginBottom: "10px", cursor: "pointer" }}
        onClick={() => dispatch(messageActions.setPublic())}>
        {message.isPrivate && "Back to public chat"}
      </p>
      <div style={{ height: "calc( 100vh - 282px )", overflowY: "auto" }}>
        {messages.map((message: any, index: any) => (
          <div className="chat-message" key={index} ref={scrollRef_}>
            <div className="chat-user-data">
              <LightgalleryItem
                src={
                  message.sender && message.sender.profile_picture
                    ? process.env.REACT_APP_FILE_URL +
                      "/" +
                      message.sender.profile_picture
                    : GuestIcon
                }>
                <img
                  src={
                    message.sender && message.sender.profile_picture
                      ? process.env.REACT_APP_FILE_URL +
                        "/" +
                        message.sender.profile_picture
                      : GuestIcon
                  }
                  alt="Guest"
                />
              </LightgalleryItem>
              <p
                style={{ textTransform: "capitalize", cursor: "pointer" }}
                onClick={() => goToPrivateChatAndStart(message.sender)}>
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
                {/* {message.message != null && convert(message.message)} */}
                <div
                  dangerouslySetInnerHTML={{ __html: convert(message.message) }}
                />
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
