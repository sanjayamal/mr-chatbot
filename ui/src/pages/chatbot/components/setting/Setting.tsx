import React, { useEffect, useState } from "react";
import {
  CButton,
  CCol,
  CForm,
  CInput,
  CRow,
  CTextArea,
  TitleWithBackButton,
  CSelect,
  CSlider,
} from "../../../../components";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { IChatbotSetting } from "../../../../interfaces";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import {
  getBotSettings,
  selectChatbotSettings,
  updateBotSetting,
} from "../../../../store/chatbot";

const Setting = () => {
  const { botId } = useParams();
  const dispatch = useAppDispatch();

  const chatbotSetting = useAppSelector(selectChatbotSettings);
  const { data: chatbotSettingData, isLoading } = chatbotSetting;

  const [initialValues, setInitialValues] = useState<IChatbotSetting>({
    name: "",
    model: "gpt-3.5-turbo",
    promptMessage: "",
    temperature: 0,
    textSource: "",
    description: "",
    numberOfCharacters: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (botId) {
      dispatch(getBotSettings(botId));
    }
  }, [botId]);
  useEffect(() => {
    setInitialValues(chatbotSettingData);
  }, [chatbotSettingData]);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IChatbotSetting>({
    defaultValues: initialValues,
  });

  const onSubmit: SubmitHandler<IChatbotSetting> = ({
    name,
    model,
    promptMessage,
    temperature,
    description,
  }) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("model", model);
    formData.append("promptMessage", promptMessage);
    formData.append("temperature", temperature.toString());
    formData.append("description", description);

    setIsSubmitting(true);

    dispatch(updateBotSetting({ formData, chatbotId: botId }))
      .unwrap()
      .then(() => {
        setIsSubmitting(false);
      })
      .catch(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <CRow>
        <CCol>
          <TitleWithBackButton title="Settings" />
        </CCol>
      </CRow>
      <CRow style={{ marginLeft: "1.5rem" }}>
        <CCol md={12}>
          <CForm onFinish={handleSubmit(onSubmit)} layout="vertical">
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{ required: "Please Enter a Name" }}
              render={({ field }) => (
                <CForm.Item
                  label="Name"
                  validateStatus={errors.name ? "error" : ""}
                  help={errors.name && errors.name.message}
                  required
                >
                  <CInput {...field} />
                </CForm.Item>
              )}
            />
            <Controller
              name="promptMessage"
              control={control}
              defaultValue=""
              rules={{ required: "Please Enter a Prompt message" }}
              render={({ field }) => (
                <CForm.Item
                  label="Prompt Message"
                  validateStatus={errors.promptMessage ? "error" : ""}
                  help={errors.promptMessage && errors.promptMessage.message}
                  required
                >
                  <CTextArea {...field} rows={4} />
                </CForm.Item>
              )}
            />
            <Controller
              name="model"
              control={control}
              render={({ field }) => (
                <CForm.Item label="Model">
                  <CSelect
                    {...field}
                    options={[
                      { value: "gpt-3.5-turbo", label: "gpt-3.5-turbo" },
                      { value: "gpt-4", label: "gpt-4" },
                    ]}
                  />
                </CForm.Item>
              )}
            />
            <Controller
              name="temperature"
              control={control}
              render={({ field }) => (
                <CForm.Item label="Temperature">
                  <CSlider
                    {...field}
                    min={0}
                    max={1}
                    step={0.1}
                    marks={{ 0: "Reserved", 1: "Creative" }}
                  />
                </CForm.Item>
              )}
            />

            <Controller
              name="description"
              control={control}
              defaultValue=""
              rules={{ required: "Please Enter a Description" }}
              render={({ field }) => (
                <CForm.Item
                  label="Description"
                  validateStatus={errors.description ? "error" : ""}
                  help={errors.description && errors.description.message}
                  required
                >
                  <CTextArea {...field} rows={3} />
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

export default Setting;
