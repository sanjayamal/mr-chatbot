import { createBrowserRouter } from "react-router-dom";
import { ErrorPage, Protected } from "../components";
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
const PublicBot = React.lazy(() => import("../pages/chatbot-iframe/PublicBot"));
const RetrainChatbot = React.lazy(
  () => import("../pages/retrainChatbot/RetrainChatbot")
);

const ChangePassword = React.lazy(
  () => import("../pages/changePassword/ChangePassword")
);

const Pricing = React.lazy(() => import("../pages/pricing/Pricing"));

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
    element: (
      <Protected>
        <UserLayout />
      </Protected>
    ),
    children: [
      {
        path: "bots",
        element: (
          <Protected>
            <Bots />
          </Protected>
        ),
      },
      {
        path: "bot/:botId",
        element: (
          <Protected>
            <Chatbot />
          </Protected>
        ),
      },
      {
        path: "bot/create",
        element: (
          <Protected>
            <ChatbotCreation />
          </Protected>
        ),
      },
      {
        path: "bot/:botId/setting",
        element: (
          <Protected>
            <ChatbotSetting />
          </Protected>
        ),
      },
      {
        path: "bot/:botId/edit",
        element: (
          <Protected>
            <ChatbotPublish />
          </Protected>
        ),
      },
      {
        path: "bot/:botId/retrain",
        element: (
          <Protected>
            <RetrainChatbot />
          </Protected>
        ),
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
  {
    path: "/bot-iframe/:botId",
    element: <PublicBot />,
  },
  {
    path: "/pricing",
    element: <Pricing />,
  },
  {
    path: "/pricing",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Pricing />,
      },
    ],
  },
  {
    path: "/change-password",
    element: (
      <Protected>
        <ChangePassword />
      </Protected>
    ),
  },
]);
