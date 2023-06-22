import { API } from "../helpers/axios";

export const getChatbots = async () => {
  const response = await API.get("/chatbot");
  return response.data;
};

export const getChatbotById = async (chatbotId: string) => {
  const response = await API.get(`/chatbot/${chatbotId}`);
  return response.data;
};
