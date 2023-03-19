import { MessageState } from ".";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: MessageState = {
  messages: [],
  privateMessages: [],
  privateClient: {
  },
  clientId: '',
  isPrivate: false,
  privateArray: []
};

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setPrivateChat: (state, action) => {
      state.privateClient = action.payload;
      state.clientId = action.payload._id;
      state.isPrivate = true
    },
    setPrivateMessages: (state, action) => {
      state.privateMessages = action.payload
    },
    addPrivateList: (state, action) => {
      const index = state.privateArray.findIndex(item => item._id === action.payload._id)
      if (index == -1) {
        state.privateArray.push(action.payload)
      }

    },
    deletePrivateList: (state, action) => {
      const index = state.privateArray.findIndex(item => item._id == action.payload._id)
      const newArray = [...state.privateArray]; // create a shallow copy of the array
      newArray.splice(index, 1); // remove the element at the specified index
      state.privateArray = newArray;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    deleteMessage: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.messages = state.messages.filter(({ _id }) => _id !== id);
    },
    addPrivateMessage: (state, action) => {
      state.privateMessages.push(action.payload)
    },
    setPublic: (state) => {
      state.isPrivate = false
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    updateMessage: (state, action) => {
      const id = action.payload._id;
      state.messages.every(({ _id }, i) => {
        if (id === _id) {
          state.messages[i] = action.payload;
          return false;
        }
        return true;
      });
    },
  },
});

const messageReducer = messageSlice.reducer;

export const messageActions = messageSlice.actions;
export default messageReducer;
