import { CCol, CRow, TitleWithBackButton } from "../../components";
import { BotItem } from "./components";

const Chatbots = () => {
  return (
    <div>
      <CRow>
        <CCol>
          <TitleWithBackButton title="Chatbots" />
        </CCol>
      </CRow>
      <CRow gutter={{ xs: 8, sm: 8, md: 8 }}>
        {[0, 1, 3].map(() => (
          <CCol className="gutter-row" xs={24} sm={12} md={6} lg={8}>
            <BotItem
              botId="1545"
              name="bot A"
              description="test"
              profilePictureUrl="https://xsgames.co/randomusers/avatar.php?g=pixel"
            />
          </CCol>
        ))}
      </CRow>
    </div>
  );
};

export default Chatbots;
