import {
  CButton,
  CCol,
  CForm,
  CRow,
  TitleWithBackButton,
  DataSource,
  CStatistic,
  SSpin,
  CMessage,
  RcFile,
} from "../../components";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  getChatbotDataSource,
  retrainChatbot,
  selectBotDataSource,
  selectIsProcessingDataSource,
} from "../../store/chatbot";
import { TextCharacterCountLimit } from "../../contants";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function RetrainChatbot() {
  const { handleSubmit } = useForm();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const botDataSource = useAppSelector(selectBotDataSource);
  const {
    files,
    filesCharacterCount,
    text,
    existingFiles,
    existingFilesCharacterCount,
  } = botDataSource;
  const isProcessingDataSource = useAppSelector(selectIsProcessingDataSource);
  const dispatch = useAppDispatch();
  const { botId } = useParams();

  useEffect(() => {
    if (botId) {
      dispatch(getChatbotDataSource(botId));
    }
  }, [botId]);

  const onSubmit: SubmitHandler<any> = (data) => {
    if (
      filesCharacterCount + existingFilesCharacterCount + text.length <
      TextCharacterCountLimit
    ) {
      CMessage.error(
        `There should be a minimum of ${TextCharacterCountLimit} characters for the chatbot to work`
      );
    } else {
      const formData = new FormData();
      files.forEach((file: any) => {
        formData.append("files", file as RcFile);
      });
      formData.append("text", text);

      setIsSubmitting(true);

      dispatch(retrainChatbot({ formData, chatbotId: botId }))
        .unwrap()
        .then(() => {
          setIsSubmitting(false);
        })
        .catch(() => {
          setIsSubmitting(false);
        });
    }
  };

  return (
    <>
      <CRow>
        <CCol>
          <TitleWithBackButton title="Retrain Chatbot" />
        </CCol>
      </CRow>
      <CRow style={{ marginLeft: "1.5rem" }}>
        <CCol md={12}>
          <CForm onFinish={handleSubmit(onSubmit)} layout="vertical">
            <DataSource isEdit />
            <SSpin spinning={isProcessingDataSource} style={{ width: "50%" }}>
              <CRow className="margin-top-1rem">
                <CCol span={6}>
                  <CStatistic
                    title={`${files.length + existingFiles.length} File(s)`}
                    value={filesCharacterCount + existingFilesCharacterCount}
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
                  Retrain Chatbot
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </CCol>
      </CRow>
    </>
  );
}

export default RetrainChatbot;