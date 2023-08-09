import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  CContent,
  CImage,
  CLayout,
  CMenu,
  CSider,
} from "../../components/common";
import { AppFooter, CurrentUser } from "../../components";
import logo from "../../assets/images/logo.jpg";
import "./UserLayout.scss";
import { Affix } from "antd";

const App: React.FC = () => {
  const navigate = useNavigate();
  const items = [
    {
      label: "Chatbots",
      key: "chatbots",
    },

    {
      label: "Pricing",
      key: "pricing",
    },
  ];

  const onClick = (e: any) => {
    navigate(getPath(e.key));
  };

  const getPath = (key: string): string => {
    try {
      switch (key) {
        case "chatbots":
          return "/bots";
        case "pricing":
          return "/pricing";
        default:
          return "";
      }
    } catch (error) {
      return "";
    }
  };
  return (
    <CLayout style={{ background: "#ffff" }}>
      <div style={{ minHeight: "100vh", height: "auto" }}>
        <Affix offsetTop={0}>
          <CSider
            breakpoint="lg"
            collapsedWidth="0"
            style={{
              background: "#ffff",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "100vh",
                height: "auto",
              }}
            >
              <div>
                <CImage
                  width={50}
                  src={logo}
                  preview={false}
                  style={{ marginLeft: "10px" }}
                  onClick={() => navigate("/")}
                />
                <CMenu
                  mode="inline"
                  defaultSelectedKeys={["chatbots"]}
                  items={items}
                  onClick={onClick}
                />
              </div>

              <div className="margin-bottom-1rem">
                <CurrentUser isNameHide={false} />
              </div>
            </div>
          </CSider>
        </Affix>
      </div>
      <CLayout style={{ background: "#ffff" }}>
        <CContent
          style={{
            margin: "24px 16px 0",
            height: "auto",
          }}
        >
          <Outlet />
        </CContent>
        <AppFooter />
      </CLayout>
    </CLayout>
  );
};

export default App;
