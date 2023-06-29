import { createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "../components";
import React from "react";

const Home = React.lazy(() => import("../pages/home/Home"));
const Bots = React.lazy(() => import("../pages/chatbots/Chatbots"));
const Chatbot = React.lazy(() => import("../pages/chatbot/Chatbot"));
const ChatbotPublish = React.lazy(
  () => import("../pages/chatbot/components/publish/Publish")
);
const ChatbotSetting = React.lazy(
  () => import("../pages/chatbot/components/setting/Setting")
);
const ChatbotCreation = React.lazy(
  () => import("../pages/chatbotCreation/ChatbotCreation")
);

const MainLayout = React.lazy(() => import("../layouts/mainLayout/MainLayout"));
const UserLayout = React.lazy(() => import("../layouts/userLayout/UserLayout"));

export const routers = createBrowserRouter([
  {
    path: "",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        path: "bots",
        element: <Bots />,
      },
    ],
  },

  {
    path: "/bot",
    element: <UserLayout />,
    children: [
      {
        path: ":botId",
        element: <Chatbot />,
      },
      {
        path: "create",
        element: <ChatbotCreation />,
      },
      {
        path: ":botId/setting",
        element: <ChatbotSetting />,
      },
      {
        path: ":botId/publish",
        element: <ChatbotPublish />,
      },
    ],
  },
]);
