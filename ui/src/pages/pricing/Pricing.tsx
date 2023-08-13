import { useState } from "react";
import { CCol, CRow, CSegmented, CTypography } from "../../components";
import "./Pricing.scss";

import { ISubscriptionPlan } from "../../interfaces";
import { SubscriptionPlan } from "./components";

const Pricing = () => {
  const [subscriptionMode, setSubscriptionMode] = useState<string | number>(
    "Monthly"
  );

  const onChange = (mode: string | number) => {
    setSubscriptionMode(mode);
  };

  const plans: Array<ISubscriptionPlan> = [
    {
      name: "Standard",
      mode: subscriptionMode === "Monthly" ? "month" : "year",
      price: 14,
      features: ["Embed on unlimited websites", "50 Chatbots"],
    },
    {
      name: "Standard",
      mode: subscriptionMode === "Monthly" ? "month" : "year",
      price: 45,
      features: ["Embed on unlimited websites", "50 Chatbots"],
    },
    {
      name: "Standard",
      mode: subscriptionMode === "Monthly" ? "month" : "year",
      price: 45,
      features: ["Embed on unlimited websites", "50 Chatbots"],
    },
  ];
  return (
    <>
      <CRow>
        <CCol
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "auto",
          }}
          span={24}
        >
          <CTypography.Title level={2}>Subscription Plans </CTypography.Title>
        </CCol>
      </CRow>
      <CRow className="margin-bottom-1rem">
        <CCol
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "auto",
          }}
          span={24}
        >
          <CSegmented
            options={["Monthly", "Yearly"]}
            value={subscriptionMode}
            onChange={onChange}
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol span={20} offset={2}>
          <CRow gutter={[16, 8]}>
            {plans.map((plan, index) => (
              <CCol xs={24} sm={8} key={index}>
                <SubscriptionPlan {...plan} />
              </CCol>
            ))}
          </CRow>
        </CCol>
      </CRow>
    </>
  );
};

export default Pricing;
