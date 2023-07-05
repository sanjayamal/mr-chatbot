import React, { useEffect, useRef, useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
  Button,
  TypingIndicator,
  Avatar,
} from "@chatscope/chat-ui-kit-react";
import "./Bot.scss";
import { SyncOutlined } from "@ant-design/icons";
import { IMessageModel, MessageDirection } from "./interfaces";
import { useDispatch, useSelector } from "react-redux";
import { useAppSelector, useAppDispatch } from "../../hooks";

import { useParams } from "react-router-dom";
import moment from "moment";
import he from "he";
import { Loader } from "../loader";

const ChatBot = () => {
  const dispatch = useAppDispatch();
  const { botId } = useParams();

  const [messages, setMessages] = useState<Array<Partial<IMessageModel>>>([]);
  const [history, setHistory] = useState<Array<Array<string>>>([]);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState("");
  const [sendDisabled, setSendDisabled] = useState<boolean>(true);

  const msgListRef = useRef<any>(null);

  const { initialMessage, profilePictureUrl, displayName, userMessageColor } = {
    initialMessage: "Hi",
    profilePictureUrl: "",
    displayName: "bot",
    userMessageColor: "#7696ec",
  };

  useEffect(() => {}, [botId]);

  useEffect(() => {
    const root = document.documentElement;
    root?.style.setProperty(
      "--background-color",
      userMessageColor || "#7696ec"
    );
  }, [messages, userMessageColor]);

  useEffect(() => {
    setSendDisabled(inputValue.length === 0);
  }, [inputValue]);

  const mapToMessageModel = (
    message: string,
    sender: string,
    direction: MessageDirection
  ): IMessageModel | Pick<IMessageModel, "direction" | "position"> => {
    try {
      return {
        message,
        sentTime: moment().format("LT"),
        sender,
        direction,
        position: "single",
        type: "text",
        payload: message,
      };
    } catch (error) {
      return {
        direction: "outgoing",
        position: "single",
      };
    }
  };

  const handleSend = async (msg: string) => {
    const newMsg = msg.replace(/<br\s*\/?>/gi, "\n");
    const question = he.decode(newMsg);
    setInputValue("");
    const newMessage: Partial<IMessageModel> = mapToMessageModel(
      question,
      "user",
      "outgoing"
    );
    setMessages((prevM) => [...prevM, newMessage]);
    setIsTyping(true);
    if (msgListRef.current) {
      msgListRef.current.scrollToBottom("auto");
    }
    getChatBotResponse(question);
  };

  const getChatBotResponse = (question: string) => {
    const request = {
      question,
      history,
    };
    // dispatch(getBotResponse({ apiPrivate, businessId, botId, request }))
    //   .unwrap()
    //   .then((response) => {
    //     const { answer, history } = response;
    //     const newMessage = mapToMessageModel(answer, "chatGPT", "incoming");
    //     setMessages((prevMessage) => [...prevMessage, newMessage]);
    //     setHistory(history);
    //     setIsTyping(false);
    //     if (msgListRef.current) {
    //       msgListRef.current.scrollToBottom("auto");
    //     }
    //   })
    //   .catch(() => {
    //     setIsTyping(false);
    //   });
  };
  const resetChat = () => {
    setMessages([]);
    setHistory([]);
  };

  return (
    <>
      {pageLoading ? (
        <Loader />
      ) : (
        <MainContainer responsive>
          <ChatContainer>
            <ConversationHeader>
              {profilePictureUrl && (
                <Avatar
                  src={profilePictureUrl}
                  name={displayName}
                  status="available"
                />
              )}
              {displayName ? (
                <ConversationHeader.Content userName={displayName} />
              ) : (
                <ConversationHeader.Content />
              )}
              <ConversationHeader.Actions>
                <Button
                  icon={<SyncOutlined />}
                  className="btn-color"
                  onClick={() => resetChat()}
                />
              </ConversationHeader.Actions>
            </ConversationHeader>
            <MessageList
              scrollBehavior="auto"
              typingIndicator={
                isTyping ? (
                  <TypingIndicator
                    content={`${displayName ? displayName : "Bot"} is typing`}
                  />
                ) : null
              }
              ref={msgListRef}
            >
              <Message
                key={0}
                model={mapToMessageModel(
                  initialMessage || "Hi! What can I help you with?",
                  "ChatGpt",
                  "incoming"
                )}
              />
              {messages.map((message: any, i: any) => {
                return <Message key={i} model={message} />;
              })}
            </MessageList>
            <MessageInput
              placeholder="Type message here"
              sendDisabled={sendDisabled}
              onChange={(val) => setInputValue(val)}
              value={inputValue}
              onSend={handleSend}
              attachButton={false}
              className="btn-color"
              onPaste={(event) => {
                event.preventDefault();
                setInputValue(
                  `${inputValue}${event.clipboardData.getData("text")}`
                );
              }}
            />
          </ChatContainer>
        </MainContainer>
      )}
    </>
  );
};

export default ChatBot;
