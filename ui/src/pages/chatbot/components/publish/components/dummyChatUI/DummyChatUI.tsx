import React from "react";
import "./DummyChatUI.scss";
import { SendOutlined, SyncOutlined } from "@ant-design/icons";
import { Avatar, Button, Typography } from "antd";
import MessagesIcon from "../../../../../../assets/images/message_icon.svg";

const { Title } = Typography;
interface IDummyChatUI {
  initialMessage?: string;
  profilePictureUrl?: string;
  displayName?: string;
  userMessageColor?: string;
  chatBubbleColor?: string;
}

const DummyChatUI: React.FC<IDummyChatUI> = ({
  initialMessage = "Hi! What can I help you with?",
  userMessageColor = "#5688C7",
  chatBubbleColor = "#5688C7",
  displayName,
  profilePictureUrl,
}) => {
  return (
    <div className="main-container">
      <div className="chat-container">
        <div className="chat-header">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "15px",
            }}
          >
            {profilePictureUrl && (
              <Avatar
                size="large"
                icon={
                  <img
                    src={profilePictureUrl}
                    alt="avatar"
                    style={{ width: "100%" }}
                  />
                }
              />
            )}
            {displayName && <Title level={5} style={{paddingBottom:'20px'}}>{displayName}</Title>}
          </div>
          <SyncOutlined />
        </div>
        <div className="chat-body">
          <div className="bot-message">
            <span>{initialMessage}</span>
          </div>
          <div className="message-wrapper">
            <div
              className="use-message"
              style={{ backgroundColor: userMessageColor }}
            >
              Hi!
            </div>
          </div>
          <div className="wrapper-msg-input">
            <div className="message-input">
              <SendOutlined />
            </div>
          </div>
        </div>
      </div>
      <div className="chat-bubble">
        <Button
          shape="circle"
          icon={<img src={MessagesIcon} alt="chat-bubble" />}
          style={{ backgroundColor: chatBubbleColor }}
          size="large"
        />
      </div>
    </div>
  );
};

export default DummyChatUI;
