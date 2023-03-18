export { default, messageActions, messageSlice } from "./messageSlice";

export interface MessageState {
  messages: any[];
  privateMessages: any[];
  privateClientId: String,
  isPrivate: Boolean
}
