import chatbotSlice from "./chatbotSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getChatbotById, getChatbots } from "../../services";

const { setChatbot, setChatbots } = chatbotSlice.actions;

const getChatbotsAPI = createAsyncThunk(
  "chatbot/getChatbots",
  async ({ dispatch }: any) => {
    const response: any = await getChatbots();
    dispatch(setChatbots(response.data));
  }
);

const getChatbotAPI = createAsyncThunk(
  "chatbot/getChatbot",
  async (chatbotId: string, { dispatch }: any) => {
    const response: any = await getChatbotById(chatbotId);
    dispatch(setChatbot(response.data));
  }
);
