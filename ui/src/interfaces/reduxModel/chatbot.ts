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
  profilePictureUrl: string;
}

export interface IInitialChatbotState {
  chatbot: { data: IChatbot; isLoading: boolean };
  chatbots: { data: Array<IChatbot>; isLoading: boolean };
  botDataSource: {
    files: Array<any>;
    text: string;
    filesCharacterCount: number;
    textCharacterCount: number;
  };
  isProcessingDataSource: boolean;
}
