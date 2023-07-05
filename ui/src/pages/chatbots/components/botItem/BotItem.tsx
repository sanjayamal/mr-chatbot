import React from "react";
import {
  CApiOutlined,
  CEditOutlined,
  CSettingOutlined,
  CRobotOutlined,
} from "../../../../components/common/icons";
import {
  CAvatar,
  CCard,
  CMeta,
  CModal,
  CToolTip,
} from "../../../../components/common";
import { useNavigate } from "react-router-dom";
import { EmbedSection } from "../../../chatbot/components";

interface IBotItem {
  botId: string;
  name: string;
  description: string;
  profilePictureUrl: string;
}

const BotItem: React.FC<IBotItem> = ({
  botId,
  name,
  description,
  profilePictureUrl,
}) => {
  const navigate = useNavigate();
  const handleOnClick = (pathName: string) => {
    let path: string = botId;
    if (pathName.length > 0) {
      path = `${botId}/${pathName}`;
    }
    navigate(`/bot/${path}`);
  };

  const embedModal = () => {
    CModal.info({
      title: "Embed on website",
      content: <EmbedSection />,
      onOk() {},
    });
  };
  return (
    <>
      <CCard
        style={{ width: "auto", marginTop: 16, backgroundColor: "#f5f7f5" }}
        actions={[
          <CToolTip title="Settings">
            <CSettingOutlined
              key="setting"
              onClick={() => handleOnClick("setting")}
            />
          </CToolTip>,
          <CToolTip title="Edit">
            <CEditOutlined key="edit" onClick={() => handleOnClick("edit")} />
          </CToolTip>,
          <CToolTip title="Retrain Chatbot">
            <CRobotOutlined
              key="retain"
              onClick={() => handleOnClick("retrain")}
            />
          </CToolTip>,
          <CToolTip title="Embed on website">
            <CApiOutlined key="embed" onClick={embedModal} />
          </CToolTip>,
        ]}
      >
        <div
          onClick={() => {
            handleOnClick("");
          }}
        >
          <CMeta
            avatar={
              <CAvatar
                src={profilePictureUrl}
                size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
              />
            }
            title={name}
            description={description}
          />
        </div>
      </CCard>
    </>
  );
};

export default BotItem;
