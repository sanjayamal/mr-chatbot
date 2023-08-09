import React from "react";
import { CButton } from "../common";
import { CArrowLeftOutlined } from "../common/icons";
import { useNavigate } from "react-router-dom";
import "./TitleWithBackButton.scss";

interface ITitleWithBackButton {
  title: string;
}
const TitleWithBackButton: React.FC<ITitleWithBackButton> = ({ title }) => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        margin: "2px 0 1px 1px",
        display: "flex",
        justifyContent: "start",
        alignItems: "center",
      }}
    >
      <CButton
        type="text"
        icon={<CArrowLeftOutlined />}
        size="small"
        className="back-btn"
        onClick={() => {
          navigate(-1);
        }}
      />
      <h3 style={{ marginLeft: "1px" }}>{title}</h3>
    </div>
  );
};

export default TitleWithBackButton;
