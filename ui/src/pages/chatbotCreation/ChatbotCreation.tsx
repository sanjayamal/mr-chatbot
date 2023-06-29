import {
  CButton,
  CCol,
  CForm,
  CInput,
  CRow,
  CTextArea,
  TitleWithBackButton,
  DataSource,
  CStatistic,
  SSpin,
  CMessage,
  RcFile,
} from "../../components";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  createChatbot,
  selectBotDataSource,
  selectIsProcessingDataSource,
} from "../../store/chatbot";
import { TextCharacterCountLimit } from "../../contants";
import { useState } from "react";

interface IFormInput {
  name: string;
  description: string;
}

function ChatbotCreation() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const botDataSource = useAppSelector(selectBotDataSource);
  const { files, filesCharacterCount, text } = botDataSource;
  const isProcessingDataSource = useAppSelector(selectIsProcessingDataSource);
  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    if (filesCharacterCount + text.length < TextCharacterCountLimit) {
      CMessage.error(
        `There should be a minimum of ${TextCharacterCountLimit} characters for the chatbot to work`
      );
    } else {

      const formData = new FormData();
      formData.append("name", data.name);
      files.forEach((file: any) => {
        formData.append("files", file as RcFile);
      });
      formData.append("text", text);

      setIsSubmitting(true);
      
      dispatch(createChatbot({ formData }))
        .unwrap()
        .then(() => {
          setIsSubmitting(false);
        })
        .catch(() => {
          setIsSubmitting(false);
        });
    }
    console.log(data);
  };

  return (
    <>
      <CRow>
        <CCol>
          <TitleWithBackButton title="Create Chatbot" />
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
            <DataSource />
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
            <SSpin spinning={isProcessingDataSource} style={{ width: "50%" }}>
              <CRow>
                <CCol span={6}>
                  <CStatistic
                    title={`${files.length} File(s)`}
                    value={filesCharacterCount}
                  />
                </CCol>
                <CCol span={6}>
                  <CStatistic
                    title="Text input characters"
                    value={text.length}
                  />
                </CCol>
              </CRow>
            </SSpin>
            <CRow>
              <CCol span={12}>
                <CButton
                  type="primary"
                  htmlType="submit"
                  className="margin-top-1rem margin-bottom-1rem"
                  style={{ width: "100%" }}
                  disabled={isProcessingDataSource || isSubmitting}
                  loading={isSubmitting}
                >
                  Create Chatbot
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </CCol>
      </CRow>
    </>
  );
}

export default ChatbotCreation;
