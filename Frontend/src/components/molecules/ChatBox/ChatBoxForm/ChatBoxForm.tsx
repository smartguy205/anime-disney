import { useEffect, useState } from "react";
import { Field, reduxForm } from "redux-form";
import SocketService from "services/socket.service";
import { config } from "config";
import axios from "axios";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { toast, ToastContainer } from "react-toastify";
import { useAppSelector } from "redux/hooks";

import "react-toastify/dist/ReactToastify.css";
function ChatBoxForm() {
  const user = useAppSelector((state) => state.auth.user);
  const messageInfo = useAppSelector((state) => state.message);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const FileInput = () => (
    <input
      type="file"
      accept="image/*"
      id="selectImagePublic"
      hidden
      onChange={(e) => onChangeFile(e)}
    />
  );
  const clickupload = () => {
    const fileInput = document.getElementById("selectImagePublic");
    fileInput?.click();
  };
  const onChangeFile = (e: any) => {
    setAttachment(e.target.files[0]);
  };
  const sendMessage = async () => {
    console.log(user);
    if (attachment === null && message === "") {
      toast.error("Enter message", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } else {
      let new_message;
      if (message) {
        const rexpURL = /(((https?:\/\/)|(www\.))[^\s]+)/g;
        new_message = message.replace(rexpURL, (url: any) => {
          return (
            '<a href="' +
            url +
            '" target="_blank" style="text-decoration: none; color: white; cursor: pointer">' +
            url +
            "</a>"
          );
        });
      }
      if (attachment) {
        const body = new FormData();
        body.append("image", attachment);
        const response = await axios.post(
          `${config.API_URL}/guest/upload`,
          body,
          {
            headers: { "content-type": "multipart/form-data" },
          }
        );
        if (response.status === 200) {
          if (response.data.message == "success") {
            console.log(response.data.data.url);
            if (messageInfo.isPrivate) {
              const valuesPrivate = {
                id: localStorage.getItem("socketId"),
                message: new_message,
                attachment: response.data.data.url,
                userid: user ? user._id : null,
                isPrivate: true,
                user: user,
                client: messageInfo.privateClient,
                createdAt: new Date(),
              };

              SocketService.sendPrivate(valuesPrivate);
            } else {
              const values = {
                id: localStorage.getItem("socketId"),
                message: new_message,
                attachment: response.data.data.url,
                userid: user ? user._id : null,
              };
              SocketService.send(values);
            }

            setAttachment(null);
            setMessage("");
          }
        }
      } else if (attachment === null) {
        if (messageInfo.isPrivate) {
          const valuesPrivate = {
            id: localStorage.getItem("socketId"),
            message: new_message,
            attachment: "",
            userid: user ? user._id : null,
            isPrivate: true,
            user: user,
            client: messageInfo.privateClient,
            createdAt: new Date(),
          };
          console.log(valuesPrivate);
          SocketService.sendPrivate(valuesPrivate);
        } else {
          const values = {
            id: localStorage.getItem("socketId"),
            message: new_message,
            attachment: "",
            userid: user ? user._id : null,
          };
          SocketService.send(values);
        }

        setAttachment(null);
        setMessage("");
      }
    }
  };

  return (
    <div
      // onSubmit={handleSubmit}
      className="form"
      style={{ alignItems: "stretch" }}>
      <textarea
        name="message"
        placeholder="Message"
        // component="textarea"
        rows={6}
        style={{
          width: "100%",
          margin: "0",
          background: "none",
          border: "2px solid #ffffff",
          padding: "10px",
          paddingRight: "20px",
          paddingBottom: "20px",
        }}
        value={message}
        onChange={(e: any) => setMessage(e.target.value)}
        onKeyDown={(e: any) => {
          if (e.keyCode === 13 && !e.shiftKey) {
            sendMessage();
          }
        }}
      />
      {attachment != null && (
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "130px",
            width: "20px",
            cursor: "pointer",
          }}>
          Selected
        </div>
      )}
      <AttachFileIcon
        style={{
          position: "absolute",
          bottom: "10px",
          right: "100px",
          width: "20px",
          cursor: "pointer",
        }}
        color="primary"
        onClick={clickupload}></AttachFileIcon>
      <div>
        <Field name="file" component={FileInput} />
      </div>

      <br />

      <button
        style={{
          color: "white",
          padding: "18px 24px",
          background: "none",
          border: "2px solid #ffffff",
        }}
        onClick={() => sendMessage()}>
        Send
      </button>
    </div>
  );
}

export default reduxForm({ form: "ChatBoxForm" })(ChatBoxForm);
