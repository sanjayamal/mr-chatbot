import { useEffect, useState } from "react";
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
  Loader,
} from "../../../../components";
import {
  SubmitHandler,
  useForm,
  Controller,
  useFieldArray,
} from "react-hook-form";
import { IChatbotSetting } from "../../../../interfaces";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import {
  getBotSettings,
  selectChatbotSettings,
  updateBotSetting,
} from "../../../../store/chatbot";
import {
  CMinusCircleOutlined,
  CPlusOutlined,
} from "../../../../components/common/icons";

/* eslint-disable no-useless-escape */
const Setting = () => {
  const { botId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const chatbotSetting = useAppSelector(selectChatbotSettings);
  const { data: chatbotSettingData, isLoading } = chatbotSetting;
  const { name, model, temperature, promptMessage, description, domains } =
    chatbotSettingData;

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<IChatbotSetting>({
    defaultValues: {
      name: "",
      model: "",
      promptMessage: "",
      description: "",
      domains: [{ domain: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "domains",
  });

  useEffect(() => {
    if (botId) {
      dispatch(getBotSettings(botId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [botId]);

  useEffect(() => {
    setValue("name", name);
    setValue("model", model);
    setValue("temperature", temperature);
    setValue("description", description);
    setValue("promptMessage", promptMessage);
    setValue("domains", domains);
  }, [model, name, temperature, description, promptMessage, domains, setValue]);

  const onSubmit: SubmitHandler<IChatbotSetting> = ({
    name,
    model,
    promptMessage,
    temperature,
    description,
    domains,
  }) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("model", model);
    formData.append("promptMessage", promptMessage);
    formData.append("temperature", temperature.toString());
    formData.append("description", description);
    formData.append("domains", JSON.stringify(domains));

    setIsSubmitting(true);

    dispatch(updateBotSetting({ formData, chatbotId: botId }))
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
      {isLoading ? (
        <Loader />
      ) : (
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
                      help={
                        errors.promptMessage && errors.promptMessage.message
                      }
                      required
                    >
                      <CTextArea {...field} rows={6} />
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
                {fields.map((item, index) => (
                  <Controller
                    key={item.id}
                    name={`domains.${index}.domain`}
                    control={control}
                    rules={{
                      pattern: {
                        value: /^(http(s)?:\/\/)?[\w\-]+(\.[\w\-]+)+[/#?]?.*$/,
                        message: "Please Enter a valid URL",
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <CRow>
                        <CCol span={fields.length > 1 ? 22 : 24}>
                          <CForm.Item
                            label={index === 0 ? "Domains" : ""}
                            validateStatus={fieldState.error ? "error" : ""}
                            help={fieldState.error && fieldState.error.message}
                          >
                            <CInput {...field} />
                          </CForm.Item>
                        </CCol>
                        <CCol span={fields.length > 1 ? 2 : 0}>
                          <CForm.Item>
                            {fields.length > 1 ? (
                              <CMinusCircleOutlined
                                style={{
                                  marginLeft: "0.5rem",
                                  ...(index === 0
                                    ? { paddingTop: "2.5rem" }
                                    : {}),
                                }}
                                onClick={() => remove(index)}
                              />
                            ) : null}
                          </CForm.Item>
                        </CCol>
                      </CRow>
                    )}
                  />
                ))}
                <CRow>
                  <CCol xs={{ span: 24 }} sm={{ span: 12 }}>
                    <CButton
                      type="dashed"
                      style={{ width: "100%" }}
                      onClick={() => append({ domain: "" })}
                      icon={<CPlusOutlined />}
                    >
                      Add domain
                    </CButton>
                  </CCol>
                </CRow>

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
                  <CCol xs={{ span: 24 }} sm={{ span: 12 }}>
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
      )}
    </>
  );
};

export default Setting;
