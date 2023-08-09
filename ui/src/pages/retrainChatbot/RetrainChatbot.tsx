import {
  CButton,
  CCol,
  CForm,
  CRow,
  TitleWithBackButton,
  DataSource,
  CStatistic,
  CMessage,
  RcFile,
  CSpin,
  Loader,
  CModal,
} from "../../components";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  getChatbotDataSource,
  resetBotDataSourceDetail,
  retrainChatbot,
  selectBotDataSource,
  selectIsProcessingDataSource,
} from "../../store/chatbot";
import { TextCharacterCountLimit } from "../../constants";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function RetrainChatbot() {
  const { handleSubmit } = useForm();
  const dispatch = useAppDispatch();
  const { botId } = useParams();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const botDataSource = useAppSelector(selectBotDataSource);
  const {
    files,
    filesCharacterCount,
    text,
    existingFiles,
    existingFilesCharacterCount,
  } = botDataSource;
  const isProcessingDataSource = useAppSelector(selectIsProcessingDataSource);

  useEffect(() => {
    if (botId) {
      setIsLoading(true);
      dispatch(getChatbotDataSource(botId))
        .then(() => {
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
    return () => {
      dispatch(resetBotDataSourceDetail());
    };
  }, [botId]);

  const handleNavigation = () => {
    navigate(`/bots`);
  };

  const getSuccessModal = () => {
    CModal.info({
      title: "Chatbot is been retrained.",
      content:
        "retraining process will take several minutes. Pleas try after sometime",
      onOk: handleNavigation,
    });
  };
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
          getSuccessModal();
        })
        .catch(() => {
          setIsSubmitting(false);
        });
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
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
                <CSpin
                  spinning={isProcessingDataSource}
                  style={{ width: "50%" }}
                >
                  <CRow className="margin-top-1rem">
                    <CCol span={6}>
                      <CStatistic
                        title={`${files.length + existingFiles.length} File(s)`}
                        value={
                          filesCharacterCount + existingFilesCharacterCount
                        }
                      />
                    </CCol>
                    <CCol span={6}>
                      <CStatistic
                        title="Text input characters"
                        value={text.length}
                      />
                    </CCol>
                  </CRow>
                </CSpin>
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
      )}
    </>
  );
}

export default RetrainChatbot;
