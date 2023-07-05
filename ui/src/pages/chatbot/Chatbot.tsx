import React from "react";
import { Bot, CCol, CRow, TitleWithBackButton } from "../../components";

const Chatbot = () => {
  return (
    <>
      <CRow>
        <CCol>
          <TitleWithBackButton title="Chatbot" />
        </CCol>
      </CRow>
      <CRow>
        <CCol span={14} offset={5} style={{ height: "85vh" }}>
          <Bot />
        </CCol>
      </CRow>
    </>
  );
};

export default Chatbot;
