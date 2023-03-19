import GuestIcon from "assets/Tiger.png";
import moment from "moment";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import MessageService from "services/message.service";
import SocketService from "services/socket.service";
import { LightgalleryItem } from "react-lightgallery";
import { messageActions } from "redux/slices/message";
import { useSnapCarousel } from "react-snap-carousel";
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
    // if (user) {
    //   MessageService.getPrivateMessages(user._id, dispatch);
    // }
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
  const goToPrivateChatAndStart = (user: any) => {
    dispatch(messageActions.addPrivateList(user));
    dispatch(messageActions.setPrivateChat(user));
  };
  let { scrollRef, pages, activePageIndex, next, prev, goTo } =
    useSnapCarousel();

  const convert = (item: any) => {
    const parser: DOMParser = new DOMParser();

    // Parse the HTML string into a DOM element
    const parsedHtml: Document = parser.parseFromString(item, "text/html");

    // Extract the href attribute value from the anchor tag
    const href: string | undefined =
      parsedHtml.querySelector("a")?.getAttribute("href") ?? "";
    return (
      <div>
        {parsedHtml.body.childNodes}{" "}
        <a href={href} target="_blank" rel="noopener noreferrer">
          {href}
        </a>
      </div>
    );
  };

  return (
    <>
      <div style={{ display: "flex", justifyItems: "center" }}>
        {activePageIndex > 1 && (
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
        )}
        <div
          style={{
            padding: "6px",
            marginLeft: "10px",

            marginTop: "21px",
            height: "40px",
            width: "10px",
            background: "transparent",
          }}></div>
        <ul
          ref={scrollRef}
          style={{
            paddingLeft: "10px",
            paddingRight: "10px",
            display: "flex",
            overflow: "hidden",
            scrollSnapType: "x mandatory",
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
        <div
          style={{
            padding: "6px",
            marginLeft: "10px",

            marginTop: "21px",
            height: "40px",
            width: "10px",
            background: "transparent",
          }}></div>
        {pages.length > 1 && (
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
        )}
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
                <div dangerouslySetInnerHTML={{ __html: message.message }} />
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
