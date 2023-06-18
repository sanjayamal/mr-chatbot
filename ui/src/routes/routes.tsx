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
      {
        path: "bots/:botId",
        element: <Chatbot />,
      },
      {
        path: "/bots/:botId/setting",
        element: <ChatbotSetting />,
      },
      {
        path: "/bots/:botId/publish",
        element: <ChatbotPublish />,
      },
    ],
  },
]);
