import http from "./http.service";
import Promisable from "./promisable.service";
import { AppDispatch } from "redux/store";
import { messageActions } from "redux/slices/message";

const MessageService = {
  addMessage: async (id: any, data: any, dispatch?: AppDispatch) => {
    let payload = {
      sender: id,
      name: data.name,
      message: data.message,
    };
    const [success, error]: any = await Promisable.asPromise(
      http.post("guest/addChat", payload)
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
};

export default MessageService;
