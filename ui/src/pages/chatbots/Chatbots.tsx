import { useNavigate } from "react-router-dom";
import {
  CCol,
  CRow,
  Loader,
  TitleWithBackButton,
  CButton,
  CEmpty,
} from "../../components";
import { BotItem } from "./components";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { getChatbots, selectChatbots } from "../../store/chatbot/chatbotSlice";
import { IChatbot } from "../../interfaces";
import BotIcon from "../../assets/images/botIcon.jpg";
import "./Chatbots.scss";
import { useEffect } from "react";

const Chatbots = () => {
  const navigate = useNavigate();
  const chatbots = useAppSelector(selectChatbots);
  const dispatch = useAppDispatch();

  // const { data: chatbotsData, isLoading } = chatbots;

  const { data: chatbotsData, isLoading } = {
    data: [
      {
        id: "4545",
        name: "Rajitha",
        description: "test",
        profilePictureUrl: "",
        userId: "",
        model: "",
        temperature: 0,
        promptMessage: "",
        textSource: "",
        numberOfCharacters: "",
        status: 0,
        createdDate: "",
        updatedData: "",
      },
    ],
    isLoading: false,
  };

  useEffect(() => {
    dispatch(getChatbots({}));
  }, []);

  const handleOnClick = () => {
    const path = `/bot/create`;
    navigate(path);
  };

  return (
    <>
      {isLoading && <Loader />}
      {!isLoading && (
        <div>
          <CRow>
            <CCol flex={23}>
              <TitleWithBackButton title="Chatbots" />
            </CCol>
            <CCol
              flex={1}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CButton onClick={handleOnClick}>Create Chatbot </CButton>
            </CCol>
          </CRow>
          <CRow gutter={{ xs: 8, sm: 8, md: 8 }}>
            {chatbotsData.length === 0 ? (
              <div className="empty">
                <CEmpty />
              </div>
            ) : (
              chatbotsData.map(
                ({
                  id,
                  name,
                  description,
                }: Pick<IChatbot, "id" | "name" | "description">) => (
                  <CCol className="gutter-row" xs={24} sm={12} md={6} lg={8}>
                    <BotItem
                      botId={id}
                      name={name}
                      description={description}
                      profilePictureUrl={BotIcon}
                    />
                  </CCol>
                )
              )
            )}
          </CRow>
        </div>
      )}
    </>
  );
};

export default Chatbots;
