import React from "react";
import "./DummyChatUI.scss";
import MessagesIcon from "../../../../../../assets/images/message_icon.svg";
import { CButton, CTypography, CAvatar } from "../../../../../../components";
import {
  CSendOutlined,
  CSyncOutlined,
} from "../../../../../../components/common/icons";

const { Title } = CTypography;
interface IDummyChatUI {
  initialMessage?: string;
  profilePictureUrl?: string;
  displayName?: string;
  userMessageColor?: string;
  chatBubbleColor?: string;
}

const DummyChatUI: React.FC<IDummyChatUI> = ({
  initialMessage = "Hi! ",
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
              <CAvatar
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
            {displayName && (
              <Title level={5} style={{ paddingBottom: "20px" }}>
                {displayName}
              </Title>
            )}
          </div>
          <CSyncOutlined />
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
              <CSendOutlined />
            </div>
          </div>
        </div>
      </div>
      <div className="chat-bubble">
        <CButton
          shape="circle"
          icon={<img src={MessagesIcon} alt="chat-bubble" />}
          size="large"
          style={{ backgroundColor: chatBubbleColor }}
        />
      </div>
    </div>
  );
};

export default DummyChatUI;
