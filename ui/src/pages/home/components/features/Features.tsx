import React from "react";
import { CCard, CCol, CRow, CTypography } from "../../../../components";
import { featureList } from "../../constants";
import { IFeature } from "../../interfaces";
import "./Feature.scss";

const Features = () => {
  return (
    <CRow gutter={[8, 8]} style={{ marginLeft: 0, marginRight: 0 }}>
      {featureList.map(({ title, description }: IFeature) => (
        <CCol
          className="gutter-row"
          xs={{ span: 21, offset: 1 }}
          sm={{ span: 12, offset: 0 }}
          md={{ span: 6, offset: 0 }}
        >
          <CCard title={title} bordered={false} className="feature-card">
            <CTypography.Text>{description}</CTypography.Text>
          </CCard>
        </CCol>
      ))}
    </CRow>
  );
};

export default Features;
