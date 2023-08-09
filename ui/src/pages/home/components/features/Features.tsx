import React from "react";
import { CCard, CCol, CRow, CTypography } from "../../../../components";
import { featureList } from "../../constants";
import { IFeature } from "../../interfaces";
import "./Feature.scss";
import Lottie from "lottie-react";
import mainSectionBot from "../../../../assets/jsons/home-main-bot.json";
import customizationBot from "../../../../assets/jsons/customization.json";
import costEffect from "../../../../assets/jsons/cost-effect.json";
import userFriendly from "../../../../assets/jsons/user-friendly.json";
import easyIntegration from "../../../../assets/jsons/integration.json";
const Features = () => {
  return (
    <>
      {/* Customization */}
      <CRow gutter={[8, 8]} style={{ marginLeft: 0, marginRight: 0 }}>
        <CCol
          className="gutter-row feature-animation"
          xs={{ span: 24, order: 2 }}
          sm={{ span: 10, order: 1 }}
        >
          <Lottie animationData={customizationBot} />
        </CCol>
        <CCol
          className="gutter-row feature-card"
          xs={{ span: 24, order: 1 }}
          sm={{ span: 14, order: 2 }}
        >
          <CCard title={featureList[0].title} bordered={false}>
            <CTypography.Text>{featureList[0].description}</CTypography.Text>
          </CCard>
        </CCol>
      </CRow>
      {/* Easy Integration */}
      <CRow
        gutter={[8, 8]}
        style={{ marginLeft: 0, marginRight: 0 }}
        className="margin-top-1rem"
      >
        <CCol
          className="gutter-row feature-card"
          xs={{ span: 24, offset: 0 }}
          sm={{ span: 12, offset: 4 }}
        >
          <CCard title={featureList[1].title} bordered={false}>
            <CTypography.Text>{featureList[1].description}</CTypography.Text>
          </CCard>
        </CCol>
        <CCol
          className="gutter-row feature-animation"
          xs={{ span: 24 }}
          sm={{ span: 8 }}
        >
          <Lottie animationData={easyIntegration} />
        </CCol>
      </CRow>
      {/* User-Friendly Interface */}
      <CRow
        gutter={[8, 8]}
        style={{ marginLeft: 0, marginRight: 0 }}
        className="margin-top-1rem"
      >
        <CCol
          className="gutter-row feature-animation"
          xs={{ span: 24, order: 2 }}
          sm={{ span: 10, order: 1 }}
        >
          <Lottie animationData={userFriendly} />
        </CCol>
        <CCol
          className="gutter-row feature-card"
          xs={{ span: 24, order: 1 }}
          sm={{ span: 14, order: 2 }}
        >
          <CCard title={featureList[2].title} bordered={false}>
            <CTypography.Text>{featureList[2].description}</CTypography.Text>
          </CCard>
        </CCol>
      </CRow>
      {/* Cost-Effective Solutions */}
      <CRow
        gutter={[8, 8]}
        style={{ marginLeft: 0, marginRight: 0 }}
        className="margin-top-1rem"
      >
        <CCol
          className="gutter-row feature-card"
          xs={{ span: 24, offset: 0 }}
          sm={{ span: 12, offset: 4 }}
        >
          <CCard title={featureList[3].title} bordered={false}>
            <CTypography.Text>{featureList[3].description}</CTypography.Text>
          </CCard>
        </CCol>
        <CCol
          className="gutter-row feature-animation-cost"
          xs={{ span: 24 }}
          sm={{ span: 8 }}
        >
          <Lottie animationData={costEffect} />
        </CCol>
      </CRow>
    </>
  );
};

export default Features;

// <CRow gutter={[8, 8]} style={{ marginLeft: 0, marginRight: 0 }}>
// {featureList.map(({ title, description }: IFeature) => (
//   <CCol
//     className="gutter-row"
//     xs={{ span: 21, offset: 1 }}
//     sm={{ span: 12, offset: 0 }}
//     md={{ span: 6, offset: 0 }}
//   >
//     <CCard title={title} bordered={false} className="feature-card">
//       <CTypography.Text>{description}</CTypography.Text>
//     </CCard>
//   </CCol>
// ))}
// </CRow>
