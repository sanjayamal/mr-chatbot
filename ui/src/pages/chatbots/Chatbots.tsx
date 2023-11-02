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
import { useEffect, useState } from "react";
import _ from "lodash";
import moment from "moment";

const Chatbots = () => {
  const navigate = useNavigate();
  const chatbots = useAppSelector(selectChatbots);
  const dispatch = useAppDispatch();
  const [isPageRefresh, setIsPageRefresh] = useState<boolean>(true);

  const { data: chatbotsData, isLoading } = chatbots;

  useEffect(() => {
    const getBots = () => {
      dispatch(getChatbots())
        .then(() => {
          setIsPageRefresh(false);
        })
        .catch(() => {
          setIsPageRefresh(false);
        });
    };
    getBots();
    const getBotIntervalId = setInterval(getBots, 30000);
    return () => {
      clearInterval(getBotIntervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnClick = () => {
    const path = `/bot/create`;
    navigate(path);
  };

  const sortChatbot = (bots: Array<IChatbot>): Array<IChatbot> => {
    try {
      return _.sortBy(bots, (bot: IChatbot) =>
        moment(bot.createdDate).toDate()
      ).reverse();
    } catch (error) {
      return [];
    }
  };
  return (
    <>
      {isLoading && isPageRefresh && <Loader />}
      {!(isLoading && isPageRefresh) && (
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
              sortChatbot(chatbotsData).map(
                ({
                  id,
                  name,
                  description,
                  status,
                }: Pick<
                  IChatbot,
                  "id" | "name" | "description" | "status"
                >) => (
                  <CCol
                    className="gutter-row"
                    xs={24}
                    sm={12}
                    md={6}
                    lg={8}
                    key={id}
                  >
                    <BotItem
                      botId={id}
                      name={name}
                      description={description}
                      profilePictureUrl={BotIcon}
                      status={status}
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
