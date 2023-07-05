import React, { useEffect, useState } from "react";
import {
  CButton,
  CCol,
  CForm,
  CInput,
  CRow,
  CSpace,
  TitleWithBackButton,
} from "../../../../components";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { DummyChatUI, PublishSettingForm } from "./components";
import { IPublishSettingForm } from "./components/publishSettingForm/IPublishSettingForm";
import { publicSettingFormInitials } from "./components/constants";
import "./Publish.scss";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import {
  getPublishBotDetails,
  selectPublishChatbotDetails,
} from "../../../../store/chatbot";
import { useParams } from "react-router-dom";

const Publish = () => {
  const publishChatbotDetails = useAppSelector(selectPublishChatbotDetails);
  const dispatch = useAppDispatch();
  const { botId } = useParams();

  const [formData, setFormData] = useState<IPublishSettingForm>(
    publicSettingFormInitials
  );

  const { data: publishChatbotDetailsData, isLoading } = publishChatbotDetails;

  const settingDetail = publishChatbotDetailsData ?? publicSettingFormInitials;

  useEffect(() => {
    if (botId) {
      dispatch(getPublishBotDetails(botId));
    }
  }, [botId]);

  useEffect(() => {
    const {
      initialMessage,
      userMessageColor,
      profilePictureUrl,
      chatBubbleColor,
      displayName,
    } = settingDetail;
    setFormData({
      initialMessage,
      userMessageColor,
      profilePictureUrl,
      chatBubbleColor,
      displayName,
    });
  }, [publishChatbotDetailsData]);

  const handleFormChange = (field: string, value: string | number) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleReset = (field: string) => {
    let data = formData;
    if (field === "profilePictureUrl") {
      data = {
        ...formData,
        profilePictureUrl: "",
      };
    } else {
      data = {
        ...formData,
        [field]: (settingDetail as any)[field],
      };
    }
    setFormData(data);
  };

  return (
    <>
      <CRow>
        <CCol>
          <TitleWithBackButton title="Chat Interface" />
        </CCol>
      </CRow>
      <CRow style={{ marginLeft: "1.5rem" }}>
        <CCol>
          <CRow>
            <CCol
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 12 }}
              lg={{ span: 12 }}
            >
              <PublishSettingForm
                {...formData}
                handleFormChange={handleFormChange}
                handleReset={handleReset}
              />
            </CCol>
            <CCol
              xs={{ span: 16 }}
              sm={{ span: 16 }}
              md={{ span: 10, offset: 1 }}
              lg={{ span: 10, offset: 1 }}
            >
              <CSpace direction="vertical" className="space-container">
                <DummyChatUI {...formData} />
              </CSpace>
            </CCol>
          </CRow>
        </CCol>
      </CRow>
    </>
  );
};

export default Publish;
