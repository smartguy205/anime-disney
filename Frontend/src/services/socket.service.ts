import io from "socket.io-client";
import { AppDispatch } from "./../redux/store";
import ToasterService from "utils/toaster.util";
import { messageActions } from "redux/slices/message";
import AuthService from "./auth.service";
import MessageService from "./message.service";


const api = process.env.REACT_APP_API_URL
// const socket = io(`${api}`);
// const socket = io("https://api.animedisney.com");

const socket = io("http://localhost:3001");
const SocketService = {

  join: (user: any) => {
    let r = (Math.random() + 1).toString(36).substring(7);
    let name = '';
    let socketId = localStorage.getItem("socketId");
    socket.emit(
      "join",
      { name: user ? user.name : name, room: "room", id: socketId, userId: user ? user._id : '', isLogin: user ? true : false },
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
      // dispatch(userActions.setRoomUsers(users));
    });
  },

  getCurrent: () => {
    socket.on("getCurrent", (data: any) => {
      console.log("Here is Current user", data);
      localStorage.setItem("socketId", data.id);
    });
  },

  send: async (value: any) => {
    try {
      await socket.emit("sendMessage", value, () => console.log("done"));
    } catch (error) {

    }

  },
  sendPrivate: async (value: any) => {
    try {
      await socket.emit("sendMessagePrivate", value, () => console.log("done"));
    } catch (error) {

    }

  },
  sendPrivateMessageToClient: async (id: any, dispatch: AppDispatch) => {
    try {
      socket.removeAllListeners("sendPrivateMessageToClient")
      socket.on("sendPrivateMessageToClient", (message: any) => {
        const new_private_message = {
          clientid: message.client._id,
          createdAt: message.createdAt,
          isPrivate: message.isPrivate,
          message: message.message,
          attachment: message.attachment,
          name: message.user.name,
          userId: message.user._id,
          sender: message.user
        }
        dispatch(messageActions.addPrivateMessage(new_private_message));
      })

    } catch (error) {

    }
  },
  messagePrivateToUser: async (id: any, dispatch: AppDispatch) => {
    try {
      socket.removeAllListeners("sendPrivateMessageToUser")
      socket.on("sendPrivateMessageToUser", (message: any) => {
        const new_private_message = {
          clientid: message.client._id,
          createdAt: message.createdAt,
          isPrivate: message.isPrivate,
          message: message.message,
          attachment: message.attachment,
          name: message.user.name,
          userId: message.user._id,
          sender: message.user
        }
        dispatch(messageActions.addPrivateMessage(new_private_message));
        MessageService.addPrivateMessage(id, new_private_message);
      })

    } catch (error) {

    }
  },
  message: async (id: any, dispatch: AppDispatch) => {
    try {
      interface UserData {
        relationship: string;
        property: string;
        role: string;
        online: boolean;
        _id: string;
        dob: string;
        email: string;
        name: string;
        race: string;
        gender: string;
        password: string | null;
        age: string;
        zodiac: string;
        star: string;
        planet: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
      }
      socket.removeAllListeners("message")
      socket.on("message", (message: any) => {
        // console.log(message); // Log message here

        if (message.userId === null) {
          dispatch(messageActions.addMessage(message));
          MessageService.addMessage(id, message);
        } else {
          const user = localStorage.getItem('user')
          if (user !== null) {
            const visitedUser = JSON.parse(user) as UserData;
            const newMessage = {
              sender: {
                name: visitedUser.name,
                race: visitedUser.race
              },
              message: message.message,
              createdAt: message.createdAt,
              attachment: message.attachment,
              id: message.id
            }
            const newMessageForDatabase = {
              message: message.message,
              createdAt: message.createdAt,
              attachment: message.attachment,
              name: visitedUser.race,
              id: message.id
            }
            dispatch(messageActions.addMessage(newMessage))
            MessageService.addMessage(id, newMessageForDatabase);
          }
        }
      });

    } catch (error) {
      console.log(error);
    }
  },

};

export default SocketService;
