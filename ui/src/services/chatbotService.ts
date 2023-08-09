import { API } from "../helpers/axios";

export const getChatbotsAPI = async () => {
  const response = await API.get("/bots");
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

export const getChatbotSettingAPI = async (chatbotId: string) => {
  const response = await API.get(`/bot/${chatbotId}/setting-details`);
  return response.data;
};

export const getPublishChatbotDetailAPI = async (chatbotId: string) => {
  const response = await API.get(`/bot/${chatbotId}/publish-details`);
  return response.data;
};

export const updateChatbotSettingAPI = async (
  formData: any,
  chatbotId: string
) => {
  const response = await API.put(
    `/bot/${chatbotId}/setting-details`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const updatePublishChatbotDetailAPI = async (
  formData: any,
  chatbotChannelId: string,
  chatbotId: string
) => {
  const response = await API.put(
    `/bot/${chatbotId}/web-channel/${chatbotChannelId}/publish-details`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const getChatbotDataSourceAPI = async (chatbotId: string) => {
  const response = await API.get(`/bot/${chatbotId}/data-source`);
  return response.data;
};

export const retrainChatbotAPI = async (formData: any, chatbotId: string) => {
  const response = await API.post(`/bot/${chatbotId}/retrain`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getBotAnswerAPI = async (data: any, chatbotId: string) => {
  const response = await API.post(`/bot/web-chat/${chatbotId}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const removeDataSourceAPI = async (
  requestBody: any,
  chatbotId: string
) => {
  const response = await API.post(
    `/bot/${chatbotId}/remove-data-source`,
    requestBody
  );
  return response.data;
};

export const addReviewAPI = async (formData: any) => {
  const response = await API.post(`/review-create`, formData);
  return response.data;
};

export const getReviewsAPI = async () => {
  const response = await API.get("/reviews");
  return response.data;
};