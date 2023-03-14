import io from "socket.io-client";
import { AppDispatch } from "./../redux/store";
import ToasterService from "utils/toaster.util";
import { messageActions } from "redux/slices/message";
import AuthService from "./auth.service";
import MessageService from "./message.service";

// const socket = io("localhost:3001");
const socket = io("https://api.animedisney.com");
const SocketService = {
  join: (user: any) => {
    let r = (Math.random() + 1).toString(36).substring(7);
    let name = "Anime" + r;
    let socketId = localStorage.getItem("socketId");
    socket.emit(
      "join",
      { name: user ? user.name : name, room: "room", id: socketId },
      (data: any, error: any) => {
        if (error) {
          ToasterService.showError(error);
        }
        if (data) {
          AuthService.addSocketUser(data);
        }
      }
    );
  },
  connections: (dispatch: AppDispatch) => {
    socket.on("roomData", ({ users }: any) => {
      console.log("Here is socket room data", users);
      // dispatch(userActions.setRoomUsers(users));
    });
  },

  getCurrent: () => {
    socket.on("getCurrent", (data: any) => {
      console.log("Here is Current user", data);
      localStorage.setItem("socketId", data.id);
    });
  },

  send: (value: any) => {
    socket.emit("sendMessage", value, () => console.log("done"));
  },

  message: (id: any, dispatch: AppDispatch) => {
    socket.on("message", (message: any) => {
      dispatch(messageActions.addMessage(message));
      MessageService.addMessage(id, message);
    });
  },
};

export default SocketService;
