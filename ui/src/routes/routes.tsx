import { createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "../components";
import React from "react";

const MainLayout = React.lazy(() => import("../layouts/mainLayout/MainLayout"));
const UserLayout = React.lazy(() => import("../layouts/userLayout/UserLayout"));

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

const Registration = React.lazy(
  () => import("../pages/registration/Registration")
);
const Login = React.lazy(() => import("../pages/login/Login"));

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
        path: "bot/:botId",
        element: <Chatbot />,
      },
      {
        path: "bot/create",
        element: <ChatbotCreation />,
      },
      {
        path: "bot/:botId/setting",
        element: <ChatbotSetting />,
      },
      {
        path: "bot/:botId/publish",
        element: <ChatbotPublish />,
      },
    ],
  },

  {
    path: "/sign-up",
    element: <Registration />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
