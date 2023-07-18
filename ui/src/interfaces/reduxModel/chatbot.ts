export interface IChatbot {
  id: string;
  name: string;
  userId: string;
  model: string;
  temperature: number;
  promptMessage: string;
  textSource: string;
  numberOfCharacters: number;
  status: number;
  description: string;
  createdDate: string;
  updatedData: string;
}

export type IChatbotSetting = Pick<
  IChatbot,
  | "name"
  | "model"
  | "temperature"
  | "promptMessage"
  | "numberOfCharacters"
  | "description"
  | "textSource"
>;

export interface IPublishChatbot {
  displayName: string;
  initialMessage: string;
  profilePictureUrl: string;
  userMessageColor: string;
  chatBubbleColor: string;
  chatbotChannelId: string;
  id: string;
  createdDate: string;
  type: string;
}

export interface IInitialChatbotState {
  chatbot: { data: IChatbot; isLoading: boolean };
  chatbots: { data: Array<IChatbot>; isLoading: boolean };
  botDataSource: {
    files: Array<any>;
    text: string;
    filesCharacterCount: number;
    textCharacterCount: number;
    existingFiles: Array<any>;
    existingFilesCharacterCount: number;
  };
  isProcessingDataSource: boolean;
  chatbotSetting: { data: IChatbotSetting; isLoading: boolean };
  publishChatbot: { data: IPublishChatbot; isLoading: boolean };
}
