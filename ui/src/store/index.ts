import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { chatbotSlice } from "./chatbot";

const rootReducer = combineReducers({
  bot: chatbotSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // serializableCheck: {
      //   ignoredActions: ["chatbot/updatePublishBotDetails"],
      //   // Ignore these field paths in all actions
      //   ignoredActionPaths: ["meta.arg", "payload.source"],
      //   // Ignore these paths in the state
      //   ignoredPaths: ["bot.botDataSource.files"],
      // },
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
