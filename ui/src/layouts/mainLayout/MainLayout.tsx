import React from "react";
import { Outlet } from "react-router-dom";
import {
  AppFooter,
  CContent,
  CLayout,
  CMenu,
  CHeader,
  CImage,
  CButton,
} from "../../components";
import logo from "../../assets/images/logo.jpg";
import { CLoginOutlined } from "../../components/common/icons";
import { useNavigate } from "react-router-dom";
import "./MainLayout.scss";

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const items = [
    {
      label: "Home",
      key: "home",
    },
    {
      label: "Features",
      key: "feature",
    },
    {
      label: "Pricing",
      key: "pricing",
    },
    {
      label: "Chatbots",
      key: "chatbots",
    },
  ];
  const onClick = (e: any) => {
    navigate(getPath(e.key));
  };

  const getPath = (key: string): string => {
    try {
      switch (key) {
        case "home":
          return "/";
        case "chatbots":
          return "/bots";
        case "feature":
          return "/feature";
        case "pricing":
          return "/pricing";
        default:
          return "/";
      }
    } catch (error) {
      return "";
    }
  };

  const onClickLogin = () => {
    navigate("/login");
  };
  return (
    <CLayout style={{ minHeight: "100vh" }}>
      <CHeader style={{ padding: 0, background: "#ffff" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CImage
            width={50}
            src={logo}
            preview={false}
            style={{ marginLeft: "10px" }}
          />
          <CMenu
            mode="horizontal"
            items={items}
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              width: "90vw",
            }}
            onClick={onClick}
          />
          <CButton
            type="text"
            icon={<CLoginOutlined />}
            size="small"
            className="login-btn"
            onClick={onClickLogin}
          >
            Log In
          </CButton>
        </div>
      </CHeader>
      <CContent
        style={{
          background: "#ffff",
          height: "auto",
        }}
      >
        <Outlet />
      </CContent>
      <AppFooter />
    </CLayout>
  );
};

export default MainLayout;
