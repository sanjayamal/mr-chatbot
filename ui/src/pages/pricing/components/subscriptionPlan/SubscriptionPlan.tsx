import React from "react";
import { CBadge, CButton, CCard, CTypography } from "../../../../components";
import { CCheckCircleTwoTone } from "../../../../components/common/icons";
import { ISubscriptionPlan } from "../../../../interfaces";

const SubscriptionPlan: React.FC<ISubscriptionPlan> = ({
  name,
  mode,
  price,
  features,
}) => {
  return (
    <CBadge.Ribbon
      text={
        <CTypography.Text>
          {
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
              ${price}
            </span>
          }
          /{mode}
        </CTypography.Text>
      }
      color="cyan"
    >
      <CCard
        title={name}
        bordered={false}
        className="price-card"
        actions={[
          <CButton type="primary" className="sub-btn">
            Subscribe
          </CButton>,
        ]}
      >
        {features.map((feature, index) => (
          <CTypography.Paragraph key={index}>
            <CCheckCircleTwoTone twoToneColor="#52c41a" />
            <CTypography.Text style={{ marginLeft: "4px" }}>
              {feature}
            </CTypography.Text>
          </CTypography.Paragraph>
        ))}
      </CCard>
    </CBadge.Ribbon>
  );
};

export default SubscriptionPlan;
