import React, { useEffect, useState } from "react";
import { IPublishSettingForm } from "./IPublishSettingForm";
import { useNavigate, useParams } from "react-router-dom";
import {
  CButton,
  CCol,
  CColorPicker,
  CForm,
  CInput,
  CRow,
  CSpace,
  CTextArea,
  CTypography,
  CUpload,
  File,
  CUploadProps,
  CMessage,
  RcFile,
} from "../../../../../../components";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CPlusOutlined } from "../../../../../../components/common/icons";
import "./PublishSettingForm.scss";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks";
import {
  selectPublishChatbotDetails,
  updatePublishBotDetails,
} from "../../../../../../store/chatbot";
import { publicSettingFormInitials } from "../constants";

interface IFormInput {
  initialMessage: string;
  displayName: string;
  profilePictureUrl: string;
  userMessageColor: string;
  chatBubbleColor: string;
}

const PublishSettingForm: React.FC<IPublishSettingForm> = ({
  displayName,
  initialMessage,
  profilePictureUrl,
  chatBubbleColor,
  userMessageColor,
  handleFormChange,
  handleReset,
  chatbotChannelId,
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [fileList, setFileList] = useState<File[]>([]);
  const { botId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const publishChatbotDetails = useAppSelector(selectPublishChatbotDetails);
  const { data: publishChatbotDetailsData, isLoading } = publishChatbotDetails;
  const settingDetail = publishChatbotDetailsData ?? publicSettingFormInitials;

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<IFormInput>({
    defaultValues: {
      initialMessage,
      userMessageColor,
      chatBubbleColor,
      displayName,
      profilePictureUrl,
    },
  });

  useEffect(() => {
    setValue("initialMessage", initialMessage);
    setValue("displayName", displayName);
    setValue("profilePictureUrl", profilePictureUrl);
    setValue("userMessageColor", userMessageColor);
    setValue("chatBubbleColor", chatBubbleColor);
  }, [
    displayName,
    initialMessage,
    profilePictureUrl,
    userMessageColor,
    chatBubbleColor,
    setValue,
  ]);

  useEffect(() => {
    if (settingDetail.profilePictureUrl) {
      setFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: settingDetail.profilePictureUrl,
        },
      ]);
    }
  }, [settingDetail.profilePictureUrl]);

  const onReset = (field: string) => {
    handleReset && handleReset(field);
  };

  const handleFileUpload = (file: File) => {
    const url = URL.createObjectURL(file as any);
    handleFormChange && handleFormChange("profilePictureUrl", url);
    file["url"] = url;
    setFileList([file]);
  };

  const handleFileRemove = (file: File) => {
    setFileList([]);
    handleReset && handleReset("profilePictureUrl");
  };

  const uploadProps: CUploadProps = {
    multiple: false,
    accept: "image/png",
    beforeUpload: (file) => {
      const isJpgOrPng = ["image/png"].includes(file.type);
      if (!isJpgOrPng) {
        CMessage.error("You can only upload JPG/PNG file!");
      } else {
        handleFileUpload(file);
      }
      return isJpgOrPng || CUpload.LIST_IGNORE;
    },
    onRemove: handleFileRemove,
    fileList,
    listType: "picture-card",
  };

  const onSubmit: SubmitHandler<IFormInput> = ({
    displayName,
    initialMessage,
    userMessageColor,
    chatBubbleColor,
  }) => {
    const formData = new FormData();
    formData.append("displayName", displayName);
    formData.append("userMessageColor", userMessageColor);
    formData.append("initialMessage", initialMessage);
    formData.append("chatBubbleColor", chatBubbleColor);

    if (fileList.length && fileList[0]?.uid !== "-1") {
      fileList.forEach((file) => {
        formData.append("profilePictureUrl", file as RcFile);
      });
    }
    setIsSubmitting(true);
    dispatch(
      updatePublishBotDetails({ formData, chatbotChannelId, chatbotId: botId })
    )
      .unwrap()
      .then(() => {
        setIsSubmitting(false);
        navigate(-1);
      })
      .catch(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <CRow>
        <CCol>
          <CForm onFinish={handleSubmit(onSubmit)} layout="vertical">
            <Controller
              name="initialMessage"
              control={control}
              defaultValue=""
              rules={{ required: "Please Enter a Initial Message" }}
              render={({ field }) => (
                <CForm.Item
                  label={
                    <div className="reset-btn">
                      Initial Messages
                      <CButton
                        style={{ borderRadius: "180px" }}
                        onClick={() => onReset("initialMessage")}
                      >
                        Reset
                      </CButton>
                    </div>
                  }
                  validateStatus={errors.initialMessage ? "error" : ""}
                  help={errors.initialMessage && errors.initialMessage.message}
                  required
                >
                  <CTextArea
                    {...field}
                    rows={3}
                    value={initialMessage}
                    onChange={(
                      e: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >
                    ) => {
                      handleFormChange &&
                        handleFormChange(e.target.name, e.target.value);
                    }}
                  />
                </CForm.Item>
              )}
            />
            <Controller
              name="displayName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <CForm.Item label="Display Name">
                  <CInput
                    {...field}
                    value={displayName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleFormChange &&
                        handleFormChange(e.target.name, e.target.value);
                    }}
                  />
                </CForm.Item>
              )}
            />
            <CSpace.Compact block>
              <Controller
                name="profilePictureUrl"
                control={control}
                defaultValue=""
                render={() => (
                  <CForm.Item label="Chatbot Profile Picture">
                    <CUpload {...uploadProps}>
                      <div>
                        <CPlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    </CUpload>
                  </CForm.Item>
                )}
              />
              <CTypography.Paragraph
                className="paragraph-text"
                style={{ marginTop: "3rem" }}
              >
                Recommended resolution is 640*640 with file size less than 2MB,
                keep visual elements centred
              </CTypography.Paragraph>
            </CSpace.Compact>

            <Controller
              name="userMessageColor"
              control={control}
              defaultValue=""
              render={() => (
                <CForm.Item
                  label={
                    <div className="reset-btn">
                      User Message Colour
                      <CButton
                        style={{ borderRadius: "180px" }}
                        onClick={() => onReset("userMessageColor")}
                      >
                        Reset
                      </CButton>
                    </div>
                  }
                >
                  <CColorPicker
                    format="hex"
                    value={userMessageColor}
                    onChange={(value: any, hex: string) => {
                      handleFormChange &&
                        handleFormChange("userMessageColor", hex);
                    }}
                  />
                </CForm.Item>
              )}
            />

            <Controller
              name="chatBubbleColor"
              control={control}
              defaultValue=""
              render={() => (
                <CForm.Item
                  label={
                    <div className="reset-btn">
                      Chat Bubble Button Colour
                      <CButton
                        style={{ borderRadius: "180px" }}
                        onClick={() => onReset("chatBubbleColor")}
                      >
                        Reset
                      </CButton>
                    </div>
                  }
                >
                  <CColorPicker
                    format={"hex"}
                    value={chatBubbleColor}
                    onChange={(value: any, hex: string) => {
                      handleFormChange &&
                        handleFormChange("chatBubbleColor", hex);
                    }}
                  />
                </CForm.Item>
              )}
            />
            <CRow>
              <CCol span={12}>
                <CButton
                  type="primary"
                  htmlType="submit"
                  className="margin-top-1rem margin-bottom-1rem"
                  style={{ width: "100%" }}
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  Save
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </CCol>
      </CRow>
    </>
  );
};

export default PublishSettingForm;
