import { useState } from "react";
import { Field, reduxForm } from "redux-form";
import SocketService from "services/socket.service";
import { config } from "config";
import axios from "axios";
import AttachFileIcon from "@mui/icons-material/AttachFile";

function ChatBoxForm() {
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
      if (response.status == 200) {
        if (response.data.message == "success") {
          console.log(response.data.data.url);
          const values = {
            id: localStorage.getItem("socketId"),
            message: message,
            attachment: response.data.data.url,
          };
          SocketService.send(values);

          setAttachment(null);
          setMessage("");
        }
      }
    } else if (attachment == null) {
      const values = {
        id: localStorage.getItem("socketId"),
        message: message,
        attachment: "",
      };
      SocketService.send(values);

      setAttachment(null);
      setMessage("");
    }
  };

  return (
    <div
      // onSubmit={handleSubmit}
      className="form"
      style={{ alignItems: "stretch" }}>
      <Field
        type="text"
        name="message"
        placeholder="Message"
        component="textarea"
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
        defaultValue={message}
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
