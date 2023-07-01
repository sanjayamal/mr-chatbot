import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChatbot, IInitialChatbotState } from "../../interfaces";
import { RootState } from "../index";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getChatbotByIdAPI,
  getChatbotsAPI,
  processBotDataSourceDetailAPI,
  createChatbotAPI,
} from "../../services";

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
  profilePictureUrl: "",
};

const initialChatbotState: IInitialChatbotState = {
  chatbot: { data: chatbot, isLoading: false },
  chatbots: { data: [], isLoading: false },
  botDataSource: {
    files: [],
    text: "",
    filesCharacterCount: 0,
    textCharacterCount: 0,
  },
  isProcessingDataSource: false,
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

export const getChatbots = createAsyncThunk(
  "chatbot/getChatbots",
  async ({ dispatch }: any) => {
    const response: any = await getChatbotsAPI();
    dispatch(setChatbots(response.data));
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
  async (formData: any, { rejectWithValue }) => {
    try {
      const response: any = await createChatbotAPI(formData);
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
    setChatbots(state, action: PayloadAction<Array<IChatbot>>) {
      state.chatbots.data = action.payload;
    },
    setChatbot(state, action: PayloadAction<IChatbot>) {
      state.chatbot.data = action.payload;
    },
    setBotDataSource: (state, action: PayloadAction<any>) => {
      if (action.payload?.typeOfData === "file") {
        state.botDataSource = {
          ...state.botDataSource,
          files: action.payload.source,
        };
      } else if (action.payload?.typeOfData === "text") {
        state.botDataSource = {
          ...state.botDataSource,
          text: action.payload.source,
          textCharacterCount: action.payload.source?.length,
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
export const {
  setChatbot,
  setChatbots,
  setBotDataSource,
  setBotDataSourceProcessingStatus,
  setBotDataSourceDetail,
} = chatbotSlice.actions;

export default chatbotSlice;
