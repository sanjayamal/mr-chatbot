export type MessageDirection = "incoming" | "outgoing" | 0 | 1;

export type MessagePosition =
  | "single"
  | "first"
  | "normal"
  | "last"
  | 0
  | 1
  | 2
  | 3;

export type MessageType = "html" | "text" | "image" | "custom";

export interface IMessageModel {
  message: string;
  sentTime: string;
  sender: string;
  direction: MessageDirection;
  position: MessagePosition;
  type: MessageType;
  payload: string | object;
}
