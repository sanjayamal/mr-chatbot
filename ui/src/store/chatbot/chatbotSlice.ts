import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChatbot, IInitialChatbotState } from "../../interfaces";
import { RootState } from "..";

const chatbot: IChatbot = {
  id: "",
  name: "",
  userId: "",
  model: "",
  temperature: 0,
  promptMessage: "",
  textSource: "",
  numberOfCharacters: "",
  status: 0,
  description: "",
  createdDate: "",
  updatedData: "",
};

const initialChatbotState: IInitialChatbotState = {
  chatbot: chatbot,
  chatbots: [],
};

const chatbotSlice = createSlice({
  name: "bot",
  initialState: initialChatbotState,
  reducers: {
    setChatbots(state, action: PayloadAction<Array<IChatbot>>) {
      state.chatbots = action.payload;
    },
    setChatbot(state, action: PayloadAction<IChatbot>) {
      state.chatbot = action.payload;
    },
  },
});

export const selectChatbots = (state: RootState) => {
  return state.bot.chatbots;
};

export const selectChatbot = (state: RootState) => {
  return state.bot.chatbot;
};

export default chatbotSlice;
