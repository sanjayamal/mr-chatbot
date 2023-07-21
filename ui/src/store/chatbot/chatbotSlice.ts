import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IChatbot,
  IChatbotSetting,
  IInitialChatbotState,
  IPublishChatbot,
} from "../../interfaces";
import { RootState } from "../index";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getChatbotByIdAPI,
  getChatbotsAPI,
  processBotDataSourceDetailAPI,
  createChatbotAPI,
  getChatbotSettingAPI,
  getPublishChatbotDetailAPI,
  updateChatbotSettingAPI,
  updatePublishChatbotDetailAPI,
  retrainChatbotAPI,
  getChatbotDataSourceAPI,
  getBotAnswerAPI,
  removeDataSourceAPI,
} from "../../services";
import { successNotification, errorNotification } from "../../components";
import { NotificationType, TypeOfDataSource } from "../../constants";
import _ from "lodash";

const chatbot: IChatbot = {
  id: "",
  name: "",
  userId: "",
  model: "",
  temperature: 0,
  promptMessage: "",
  textSource: "",
  numberOfCharacters: 0,
  status: 0,
  description: "",
  createdDate: "",
  updatedData: "",
};

const chatbotSetting: IChatbotSetting = {
  name: "",
  model: "gpt-3.5-turbo",
  promptMessage: "",
  temperature: 0,
  textSource: "",
  description: "",
  numberOfCharacters: 0,
};

const publishChatbot: IPublishChatbot = {
  initialMessage: "Hi! What can I help you with?",
  userMessageColor: "#5688C7",
  chatBubbleColor: "#5688C7",
  displayName: "",
  profilePictureUrl: "",
  chatbotChannelId: "",
  id: "",
  type: "",
  createdDate: "",
};
const initialChatbotState: IInitialChatbotState = {
  chatbot: { data: chatbot, isLoading: false },
  chatbots: { data: [], isLoading: false },
  botDataSource: {
    files: [],
    text: "",
    filesCharacterCount: 0,
    textCharacterCount: 0,
    existingFiles: [],
    existingFilesCharacterCount: 0,
  },
  isProcessingDataSource: false,
  chatbotSetting: {
    data: chatbotSetting,
    isLoading: false,
  },
  publishChatbot: {
    data: publishChatbot,
    isLoading: false,
  },
};

const getFilesCharacterCount = (
  files: Array<{ name: string; count: number }>
): number => {
  try {
    return files.reduce(
      (accumulator, currentValue) => accumulator + currentValue.count,
      0
    );
  } catch (error) {
    return 0;
  }
};

const removeFileName = (
  files: Array<string>,
  fileName: string
): Array<string | undefined> => {
  try {
    const result = _.without(files, fileName);
    return result;
  } catch (error) {
    return [];
  }
};
export const getChatbots = createAsyncThunk(
  "chatbot/getChatbots",
  async (_: void, { dispatch }) => {
    const response: any = await getChatbotsAPI();
    dispatch(setChatbots(response));
  }
);

export const getChatbot = createAsyncThunk(
  "chatbot/getChatbot",
  async (chatbotId: string, { dispatch }: any) => {
    const response: any = await getChatbotByIdAPI(chatbotId);
    dispatch(setChatbot(response.data));
  }
);

export const getBotDataSourceDetail = createAsyncThunk(
  "chatbot/getBotDataSourceDetail",
  async (formData: any, { dispatch, rejectWithValue }) => {
    try {
      const response: any = await processBotDataSourceDetailAPI(formData);
      dispatch(
        setBotDataSourceDetail({
          count: getFilesCharacterCount(response?.files),
        })
      );
    } catch (e: any) {
      return rejectWithValue(e);
    }
  }
);

export const createChatbot = createAsyncThunk(
  "chatbot/create-bot",
  async (formData: any, { dispatch, rejectWithValue }) => {
    try {
      const response: any = await createChatbotAPI(formData);
      const { title, message } = response;
      successNotification({
        type: NotificationType.SUCCESS,
        title: title as string,
        description: message as string,
      });
      return response;
    } catch (e: any) {
      const { title, message } = e.response.data?.error;
      errorNotification({
        type: NotificationType.SUCCESS,
        title: title as string,
        description: message as string,
      });
      return rejectWithValue(e);
    }
  }
);

export const getBotSettings = createAsyncThunk(
  "chatbot/getBotSettings",
  async (chatbotId: string, { dispatch, rejectWithValue }) => {
    try {
      const response: any = await getChatbotSettingAPI(chatbotId);
      dispatch(setChatbotSettings(response));
    } catch (e: any) {
      return rejectWithValue(e);
    }
  }
);

export const getPublishBotDetails = createAsyncThunk(
  "chatbot/getPublishBotDetails",
  async (chatbotId: string, { dispatch, rejectWithValue }) => {
    try {
      const response: any = await getPublishChatbotDetailAPI(chatbotId);
      dispatch(setPublishChatbot(response));
    } catch (e: any) {
      return rejectWithValue(e);
    }
  }
);

export const updateBotSetting = createAsyncThunk(
  "chatbot/updateBotSetting",
  async ({ formData, chatbotId }: any, { rejectWithValue }) => {
    try {
      const response: any = await updateChatbotSettingAPI(formData, chatbotId);
      const { title, message } = response;
      successNotification({
        type: NotificationType.SUCCESS,
        title: title as string,
        description: message as string,
      });
      return response;
    } catch (e: any) {
      const { title, message } = e.response.data?.error;
      errorNotification({
        type: NotificationType.SUCCESS,
        title: title as string,
        description: message as string,
      });
      return rejectWithValue(e);
    }
  }
);

export const updatePublishBotDetails = createAsyncThunk(
  "chatbot/updatePublishBotDetails",
  async (
    { formData, chatbotChannelId, chatbotId }: any,
    { rejectWithValue }
  ) => {
    try {
      const response: any = await updatePublishChatbotDetailAPI(
        formData,
        chatbotChannelId,
        chatbotId
      );
      const { title, message } = response;
      successNotification({
        type: NotificationType.SUCCESS,
        title: title as string,
        description: message as string,
      });
      return response;
    } catch (e: any) {
      const { title, message } = e.response.data?.error;
      errorNotification({
        type: NotificationType.SUCCESS,
        title: title as string,
        description: message as string,
      });

      return rejectWithValue(e);
    }
  }
);

export const getBotAnswer = createAsyncThunk(
  "chatbot/getBotAnswer",
  async ({ data, chatbotId }: any, { rejectWithValue }) => {
    try {
      const response: any = await getBotAnswerAPI(data, chatbotId);
      return response.result;
    } catch (e: any) {
      const { title, message } = e.response.data?.error;
      errorNotification({
        type: NotificationType.SUCCESS,
        title: title as string,
        description: message as string,
      });
      return rejectWithValue(e);
    }
  }
);

export const getChatbotDataSource = createAsyncThunk(
  "chatbot/getChatbotDataSource",
  async (chatbotId: string, { dispatch, rejectWithValue }) => {
    try {
      const response: any = await getChatbotDataSourceAPI(chatbotId);
      dispatch(
        setBotDataSource({
          source: response,
          typeOfData: TypeOfDataSource.EXISTING_DATA_SOURCE,
        })
      );
    } catch (e: any) {
      return rejectWithValue(e);
    }
  }
);

export const removeDataSource = createAsyncThunk(
  "chatbot/removeDataSource",
  async (
    { requestBody, chatbotId, existingFiles }: any,
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response: any = await removeDataSourceAPI(requestBody, chatbotId);
      const { filesCharacterCount } = response;
      const { filesToRemove } = requestBody;
      const data = {
        files: removeFileName(existingFiles, filesToRemove[0]),
        filesCharacterCount,
      };
      dispatch(
        setBotDataSource({
          source: data,
          typeOfData: TypeOfDataSource.REMOVING_EXISTING_FILE,
        })
      );
      return;
    } catch (e: any) {
      const { title, message } = e.response.data?.error;
      errorNotification({
        type: NotificationType.SUCCESS,
        title: title as string,
        description: message as string,
      });

      return rejectWithValue(e);
    }
  }
);
export const retrainChatbot = createAsyncThunk(
  "chatbot/retrainChatbot",
  async ({ formData, chatbotId }: any, { rejectWithValue }) => {
    try {
      const response: any = await retrainChatbotAPI(formData, chatbotId);
      //TODO - notification handle
      return response;
    } catch (e: any) {
      return rejectWithValue(e);
    }
  }
);
const chatbotSlice = createSlice({
  name: "bot",
  initialState: initialChatbotState,
  reducers: {
    setChatbots(state, action: any) {
      state.chatbots.data = action.payload;
    },
    setChatbot(state, action: PayloadAction<IChatbot>) {
      state.chatbot.data = action.payload;
    },
    setBotDataSource: (state, action: PayloadAction<any>) => {
      if (action.payload?.typeOfData === TypeOfDataSource.FILE) {
        state.botDataSource = {
          ...state.botDataSource,
          files: action.payload.source,
        };
      } else if (action.payload?.typeOfData === TypeOfDataSource.TEXT) {
        state.botDataSource = {
          ...state.botDataSource,
          text: action.payload.source,
          textCharacterCount: action.payload.source?.length,
        };
      } else if (
        action.payload?.typeOfData === TypeOfDataSource.EXISTING_DATA_SOURCE
      ) {
        state.botDataSource = {
          ...state.botDataSource,
          existingFiles: action.payload.source.files,
          text: action.payload.source.text,
          textCharacterCount: action.payload.source.text?.length,
          existingFilesCharacterCount:
            action.payload.source.filesCharacterCount,
        };
      } else if (
        action.payload?.typeOfData === TypeOfDataSource.REMOVING_EXISTING_FILE
      ) {
        state.botDataSource = {
          ...state.botDataSource,
          existingFiles: action.payload.source.files,
          existingFilesCharacterCount:
            action.payload.source.filesCharacterCount,
        };
      }
    },
    setBotDataSourceProcessingStatus: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isProcessingDataSource = action.payload;
    },
    setBotDataSourceDetail: (state, action: PayloadAction<any>) => {
      state.botDataSource = {
        ...state.botDataSource,
        filesCharacterCount: action.payload.count,
      };
    },
    setChatbotSettings: (state, action: PayloadAction<any>) => {
      state.chatbotSetting.data = action.payload;
    },
    setPublishChatbot: (state, action: PayloadAction<any>) => {
      state.publishChatbot.data = action.payload;
    },
    resetBotDataSourceDetail: (state) => {
      state.botDataSource = {
        files: [],
        text: "",
        filesCharacterCount: 0,
        textCharacterCount: 0,
        existingFiles: [],
        existingFilesCharacterCount: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChatbots.pending, (state) => {
        state.chatbots.isLoading = true;
      })
      .addCase(getChatbots.fulfilled, (state, action) => {
        state.chatbots.isLoading = false;
      })
      .addCase(getChatbots.rejected, (state, action) => {
        state.chatbots.isLoading = false;
      })
      .addCase(getChatbot.pending, (state) => {
        state.chatbot.isLoading = true;
      })
      .addCase(getChatbot.fulfilled, (state, action) => {
        state.chatbot.isLoading = false;
      })
      .addCase(getChatbot.rejected, (state, action) => {
        state.chatbot.isLoading = false;
      })
      .addCase(getBotSettings.pending, (state) => {
        state.chatbotSetting.isLoading = true;
      })
      .addCase(getBotSettings.fulfilled, (state, action) => {
        state.chatbotSetting.isLoading = false;
      })
      .addCase(getBotSettings.rejected, (state, action) => {
        state.chatbotSetting.isLoading = false;
      })
      .addCase(getPublishBotDetails.pending, (state) => {
        state.publishChatbot.isLoading = true;
      })
      .addCase(getPublishBotDetails.fulfilled, (state, action) => {
        state.publishChatbot.isLoading = false;
      })
      .addCase(getPublishBotDetails.rejected, (state, action) => {
        state.publishChatbot.isLoading = false;
      });
  },
});

export const selectChatbots = (state: RootState) => {
  return state.bot.chatbots;
};

export const selectChatbot = (state: RootState) => {
  return state.bot.chatbot;
};

export const selectBotDataSource = (state: RootState) => {
  return state.bot.botDataSource;
};

export const selectIsProcessingDataSource = (state: RootState) => {
  return state.bot.isProcessingDataSource;
};
export const selectChatbotSettings = (state: RootState) => {
  return state.bot.chatbotSetting;
};
export const selectPublishChatbotDetails = (state: RootState) => {
  return state.bot.publishChatbot;
};
export const {
  setChatbot,
  setChatbots,
  setBotDataSource,
  setBotDataSourceProcessingStatus,
  setBotDataSourceDetail,
  setChatbotSettings,
  setPublishChatbot,
  resetBotDataSourceDetail,
} = chatbotSlice.actions;

export default chatbotSlice;
