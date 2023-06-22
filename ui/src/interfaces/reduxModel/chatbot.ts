export interface IChatbot {
  id: string;
  name: string;
  userId: string;
  model: string;
  temperature: number;
  promptMessage: string;
  textSource: string;
  numberOfCharacters: string;
  status: number;
  description: string;
  createdDate: string;
  updatedData: string;
}

export interface IInitialChatbotState {
  chatbot: IChatbot;
  chatbots: Array<IChatbot>;
}
