import { API } from "../helpers/axios";

export const getChatbotsAPI = async () => {
  const response = await API.get("/chatbot");
  return response.data;
};

export const getChatbotByIdAPI = async (chatbotId: string) => {
  const response = await API.get(`/chatbot/${chatbotId}`);
  return response.data;
};

export const processBotDataSourceDetailAPI = async (formData: any) => {
  const response = await API.post(`/process-source`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const createChatbotAPI = async (formData: any) => {
  const response = await API.post(`/bot-create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
