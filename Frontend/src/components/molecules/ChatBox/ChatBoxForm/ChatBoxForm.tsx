import { useState } from "react";
import { Field, reduxForm } from "redux-form";
import SocketService from "services/socket.service";
import { config } from "config";

function ChatBoxForm() {
  const [attachment, setAttachment] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const FileInput = () => (
    <input type="file" onChange={(e) => onChangeFile(e)} />
  );
  const onChangeFile = (e: any) => {
    setAttachment(e.target.files[0]);
  };
  const getUploadParams = (file: File | null) => {
    if (file) {
      console.log("this is form data", file);
      const body = new FormData();
      body.append("attachment", file);
      return { url: `${config.API_URL}/guest/upload`, body };
    }
    // return { url: `${config.API_URL}/guest/upload`, body };
  };
  const sendMessage = () => {
    console.log(
      "this is attachment data",
      attachment,
      localStorage.getItem("socketId"),
      message
    );
    // const params = getUploadParams(attachment);
    // console.log("this is params", params);
    //   id: localStorage.getItem("socketId"),
    //   message: message,
    // };
    const values = {
      id: localStorage.getItem("socketId"),
      message: message,
    };
    SocketService.send(values);
    // if (attachment==null){
    //   SocketService.send(values);
    // } else {
    //   values.file=attachment;
    //   SocketService.sendWithAttachment(values)
    // }
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
        }}
        defaultValue={message}
        onChange={(e: any) => setMessage(e.target.value)}
        onKeyDown={(e: any) => {
          if (e.keyCode === 13 && !e.shiftKey) {
            sendMessage();
          }
        }}
      />
      {/* <div>
        <label htmlFor="file">File:</label>
        <Field name="file" component={FileInput} />
      </div> */}

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
