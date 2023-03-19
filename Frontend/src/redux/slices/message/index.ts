export { default, messageActions, messageSlice } from "./messageSlice";

export interface MessageState {
  messages: any[];
  privateMessages: any[];
  privateClient: Object;
  clientId: String;
  isPrivate: Boolean;
  privateArray: any[];
}
