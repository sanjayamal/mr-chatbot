import {
  CRow,
  CCol,
  CTypography,
  CSpace,
  CButton,
} from "../../../../components";
import "./MainSection.scss";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import mainSectionBot from "../../../../assets/jsons/home-main-bot.json";

const MainSection = () => {
  const navigate = useNavigate();
  const handleOnClick = () => {
    const path = `/bot/create`;
    navigate(path);
  };
  return (
    <CRow>
      <CCol
        xs={{ span: 24, offset: 0 }}
        sm={{ span: 16, offset: 0 }}
        md={{ span: 14, offset: 2 }}
      >
        <CSpace
          direction="vertical"
          size="small"
          style={{ display: "flex", padding: "4rem" }}
        >
          <CTypography.Title level={2} className="title">
            Build Your Custom Chatbot and Engage Your Website Visitors
          </CTypography.Title>
          <CTypography.Text className="description" type="secondary">
            Looking to enhance your website's user experience and boost customer
            engagement? Look no further! Mr.Chatbot is here to revolutionize the
            way you interact with your website visitors. With our powerful
            platform, you can easily build and deploy a personalized chatbot
            tailored to your unique needs.
          </CTypography.Text>
          <CButton
            onClick={handleOnClick}
            style={{ backgroundColor: "#36d7b7" }}
          >
            Build Your Chatbot
          </CButton>
        </CSpace>
      </CCol>
      <CCol
        xs={{ span: 20, offset: 2 }}
        sm={{ span: 6, offset: 0 }}
        md={{ span: 8, offset: 0 }}
        className="bot-animation"
      >
        <Lottie animationData={mainSectionBot} />
      </CCol>
    </CRow>
  );
};

export default MainSection;
