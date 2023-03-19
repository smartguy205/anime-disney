import http from "./http.service";
import Promisable from "./promisable.service";
import { AppDispatch } from "redux/store";
import message, { messageActions } from "redux/slices/message";

const MessageService = {
  addMessage: async (id: any, data: any, dispatch?: AppDispatch) => {


    let payload = {
      sender: id,
      name: data.name,
      message: data.message,
      attachment: data.attachment
    };

    console.log("sssss----", data.message, typeof data.message)

    console.log('payload is ', payload)
    const [success, error]: any = await Promisable.asPromise(
      http.post("guest/addChat", payload)
    );


    // if (success) {
    //   const { message } = success.data.data;
    //   dispatch?.(messageActions.addMessage(message));
    // }

    return [success, error];
  },
  addPrivateMessage: async (id: any, data: any, dispatch?: AppDispatch) => {


    const [success, error]: any = await Promisable.asPromise(
      http.post("guest/addChatPrivate", data)
    );

    // if (success) {
    //   const { message } = success.data.data;
    //   dispatch?.(messageActions.addMessage(message));
    // }

    return [success, error];
  },
  getMessages: async (dispatch?: AppDispatch) => {
    const [success, error]: any = await Promisable.asPromise(
      http.get("/guest/getChat")
    );

    if (success) {
      const { messages } = success.data.data;

      dispatch?.(messageActions.setMessages(messages));
    }

    return [success, error];
  },

  getPrivateMessages: async (id: any, dispatch?: AppDispatch) => {
    const [success, error]: any = await Promisable.asPromise(
      http.post("/guest/getPrivateChat", { id: id })
    );

    if (success) {
      const { messages } = success.data.data;
      dispatch?.(messageActions.setPrivateMessages(messages));
    }

    return [success, error];
  },
};

export default MessageService;
